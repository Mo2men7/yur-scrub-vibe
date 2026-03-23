import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const product_id = formData.get("product_id") as string;
    const customer_name = formData.get("customer_name") as string;
    const customer_email = formData.get("customer_email") as string;
    const customer_phone = formData.get("customer_phone") as string;
    const delivery_address = formData.get("delivery_address") as string;
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    const payment_method = formData.get("payment_method") as "cod" | "bank_transfer";
    const screenshot = formData.get("screenshot") as File | null;

    // Validate required fields
    if (
      !product_id ||
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      !delivery_address ||
      !size ||
      !color ||
      !payment_method
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    // Fetch product price
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("price")
      .eq("id", product_id)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Upload screenshot if bank transfer
    let transfer_screenshot_url: string | null = null;

    if (payment_method === "bank_transfer" && screenshot) {
      // Validate file
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(screenshot.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG, WebP allowed." },
          { status: 400 }
        );
      }

      if (screenshot.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File too large. Max 5MB." },
          { status: 400 }
        );
      }

      const ext = screenshot.name.split(".").pop() || "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const arrayBuffer = await screenshot.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from("transfer-screenshots")
        .upload(filename, buffer, {
          contentType: screenshot.type,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: `Upload failed: ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage
        .from("transfer-screenshots")
        .getPublicUrl(filename);

      transfer_screenshot_url = urlData.publicUrl;
    }

    // Determine status
    const status =
      payment_method === "bank_transfer" ? "awaiting_confirmation" : "pending";

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        product_id,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        size,
        color,
        payment_method,
        transfer_screenshot_url,
        status,
        total_price: product.price,
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: orderError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
