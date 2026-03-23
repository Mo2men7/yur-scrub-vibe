import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/products/ProductGrid";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Page header */}
        <div className="bg-card border-b border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-2">
              {locale === "ar" ? "مجموعتنا" : "Collection"}
            </p>
            <h1 className="font-display text-4xl font-bold">
              {t("products.title")}
            </h1>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProductGrid products={products || []} />
        </div>
      </main>
      <Footer />
    </>
  );
}
