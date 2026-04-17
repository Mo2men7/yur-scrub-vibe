import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Heart, Star, Zap } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("about");

  const values = [
    {
      icon: Heart,
      label: locale === "ar" ? "الرعاية" : "Care",
      desc:
        locale === "ar"
          ? "نهتم بكل تفصيلة في صناعة ملابسنا"
          : "We care about every detail in crafting our garments",
    },
    {
      icon: Star,
      label: locale === "ar" ? "الجودة" : "Quality",
      desc:
        locale === "ar"
          ? "نختار أفضل الخامات لضمان المتانة والراحة"
          : "We select the finest materials for durability and comfort",
    },
    {
      icon: Zap,
      label: locale === "ar" ? "الابتكار" : "Innovation",
      desc:
        locale === "ar"
          ? "نطور تصاميمنا باستمرار لتلبية احتياجاتك"
          : "We continuously evolve our designs to meet your needs",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Header */}
        <div className="relative py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-5xl font-bold mb-4">{t("title")}</h1>
            <p className="text-xl text-muted-foreground">
              {locale === "ar"
                ? "لأن من يُنقذ الأرواح يستحق الأفضل"
                : "Because those who save lives deserve the best"}
            </p>
          </div>
        </div>

        {/* Story */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">
                  {t("story")}
                </p>
                <h2 className="font-display text-3xl font-bold mb-4">{t("story")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("storyText")}</p>
              </div>
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="font-display text-8xl font-bold text-primary/20">ys</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">
              {t("mission")}
            </p>
            <h2 className="font-display text-3xl font-bold mb-6">{t("mission")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t("missionText")}
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3 text-center">
              {t("values")}
            </p>
            <h2 className="font-display text-3xl font-bold mb-12 text-center">
              {t("values")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={i}
                    className="text-center p-8 rounded-2xl border border-border hover:border-primary/40 transition-colors"
                  >
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-5">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{v.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
