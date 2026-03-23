import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/products/ProductGrid";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Sparkles, Shield, Heart } from "lucide-react";

export default async function HomePage({
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
    .order("created_at", { ascending: false })
    .limit(6);

  const features = [
    {
      icon: Shield,
      title: t("features.quality"),
      desc: t("features.qualityDesc"),
    },
    {
      icon: Heart,
      title: t("features.comfort"),
      desc: t("features.comfortDesc"),
    },
    {
      icon: Sparkles,
      title: t("features.style"),
      desc: t("features.styleDesc"),
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden grain-overlay">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
          <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 end-1/4 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              {locale === "ar" ? "علامة طبية مصرية" : "Egyptian Medical Brand"}
            </p>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-up">
              {t("hero.tagline")}
            </h1>

            <p
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up"
              style={{ animationDelay: "150ms" }}
            >
              {t("hero.subtitle")}
            </p>

            <div
              className="flex flex-wrap gap-4 justify-center animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25"
              >
                {t("hero.cta")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-all"
              >
                {locale === "ar" ? "عن العلامة" : "Our Story"}
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
            <span className="text-xs">{t("hero.scroll")}</span>
            <div className="w-px h-8 bg-border" />
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="text-center p-8 animate-fade-up"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-5">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-medium text-primary uppercase tracking-widest mb-2">
                  {locale === "ar" ? "مجموعتنا" : "Collection"}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold">
                  {t("products.featured")}
                </h2>
              </div>
              <Link
                href={`/${locale}/products`}
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {t("products.viewAll")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <ProductGrid products={products || []} />

            <div className="mt-10 text-center sm:hidden">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {t("products.viewAll")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
