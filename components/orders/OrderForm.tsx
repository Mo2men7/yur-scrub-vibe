"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { Product, OrderFormData } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

const orderSchema = z.object({
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().min(7),
  delivery_address: z.string().min(10),
  size: z.string().min(1),
  color: z.string().min(1),
  payment_method: z.enum(["cod", "bank_transfer"]),
});

type FormValues = z.infer<typeof orderSchema>;

interface OrderFormProps {
  product: Product;
}

export default function OrderForm({ product }: OrderFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      payment_method: "cod",
      size: product.sizes?.[0] || "",
      color: product.colors?.[0] || "",
    },
  });

  const paymentMethod = watch("payment_method");
  const selectedColor = watch("color");

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: FormValues) => {
    if (data.payment_method === "bank_transfer" && !screenshot) {
      toast.error(t("order.screenshotHint"));
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      formData.append("product_id", product.id);
      if (screenshot) formData.append("screenshot", screenshot);

      const res = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit order");
      }

      const order = await res.json();
      router.push(`/${locale}/order-success?id=${order.id}`);
    } catch (err: any) {
      toast.error(err.message || t("common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Size */}
      <div>
        <label className={labelClass}>{t("order.size")} *</label>
        <select {...register("size")} className={inputClass}>
          {product.sizes?.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.size && <p className={errorClass}>{errors.size.message}</p>}
      </div>

      {/* Color */}
      <div>
        <label className={labelClass}>{t("order.color")} *</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {product.colors?.map((color) => (
            <label key={color} className="cursor-pointer">
              <input
                type="radio"
                value={color}
                {...register("color")}
                className="sr-only"
              />
              <span
                className={cn(
                  "block w-8 h-8 rounded-full border-2 transition-all",
                  selectedColor === color
                    ? "border-primary scale-110 shadow-md"
                    : "border-transparent hover:border-muted-foreground"
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            </label>
          ))}
        </div>
        {errors.color && <p className={errorClass}>{errors.color.message}</p>}
      </div>

      <hr className="border-border" />

      {/* Customer info */}
      <div>
        <label className={labelClass}>{t("order.name")} *</label>
        <input
          type="text"
          {...register("customer_name")}
          className={inputClass}
          placeholder={locale === "ar" ? "محمد أحمد" : "John Doe"}
        />
        {errors.customer_name && (
          <p className={errorClass}>{errors.customer_name.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("order.email")} *</label>
        <input
          type="email"
          {...register("customer_email")}
          className={inputClass}
          placeholder="you@example.com"
        />
        {errors.customer_email && (
          <p className={errorClass}>{errors.customer_email.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("order.phone")} *</label>
        <input
          type="tel"
          {...register("customer_phone")}
          className={inputClass}
          placeholder="+20 1XX XXX XXXX"
        />
        {errors.customer_phone && (
          <p className={errorClass}>{errors.customer_phone.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("order.address")} *</label>
        <textarea
          {...register("delivery_address")}
          rows={3}
          className={cn(inputClass, "resize-none")}
          placeholder={
            locale === "ar"
              ? "الشارع، المنطقة، المحافظة"
              : "Street, Area, City, Governorate"
          }
        />
        {errors.delivery_address && (
          <p className={errorClass}>{errors.delivery_address.message}</p>
        )}
      </div>

      <hr className="border-border" />

      {/* Payment */}
      <div>
        <label className={labelClass}>{t("order.payment")} *</label>
        <div className="grid grid-cols-2 gap-3 mt-1">
          {(["cod", "bank_transfer"] as const).map((method) => (
            <label key={method} className="cursor-pointer">
              <input
                type="radio"
                value={method}
                {...register("payment_method")}
                className="sr-only"
              />
              <div
                className={cn(
                  "p-3 rounded-xl border-2 text-sm font-medium text-center transition-all",
                  paymentMethod === method
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/40"
                )}
              >
                {method === "cod" ? t("order.cod") : t("order.bankTransfer")}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Screenshot upload */}
      {paymentMethod === "bank_transfer" && (
        <div>
          <label className={labelClass}>{t("order.screenshot")} *</label>
          <p className="text-xs text-muted-foreground mb-2">
            {t("order.screenshotHint")}
          </p>
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleScreenshot}
            />
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
                screenshotPreview
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              {screenshotPreview ? (
                <img
                  src={screenshotPreview}
                  alt="Preview"
                  className="max-h-40 mx-auto rounded-lg object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-8 h-8" />
                  <span className="text-sm">
                    {locale === "ar"
                      ? "انقر لرفع الصورة"
                      : "Click to upload image"}
                  </span>
                  <span className="text-xs">JPEG, PNG, WebP — max 5MB</span>
                </div>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4 p-4 bg-muted rounded-xl">
          <span className="text-sm font-medium text-muted-foreground">
            {locale === "ar" ? "الإجمالي" : "Total"}
          </span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price, locale)}
          </span>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("order.submitting")}
            </>
          ) : (
            t("order.submit")
          )}
        </button>
      </div>
    </form>
  );
}
