import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server-client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderForm from "@/components/orders/OrderForm";
import {
  formatPrice,
  getProductName,
  getProductDescription,
} from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const name = getProductName(product, locale);
  const description = getProductDescription(product, locale);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link
              href={`/${locale}/products`}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              {t("products.title")}
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-xs">{name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted relative">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <span className="font-display text-7xl font-bold text-primary/20">
                      ys
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 relative"
                    >
                      <Image
                        src={img}
                        alt={`${name} ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details + Order Form */}
            <div>
              <div className="mb-8">
                <h1 className="font-display text-3xl font-bold mb-3">{name}</h1>
                <p className="text-3xl font-bold text-primary mb-4">
                  {formatPrice(product.price, locale)}
                </p>
                {description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-lg mb-5">
                  {t("order.title")}
                </h2>
                <OrderForm product={product} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
