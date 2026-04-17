import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  const { id } = await searchParams;
  const t = await getTranslations("success");

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center py-24">
          <div className="inline-flex p-6 rounded-full bg-green-100 dark:bg-green-900/30 mb-8 animate-fade-up">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>

          <h1
            className="font-display text-3xl font-bold mb-4 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            {t("title")}
          </h1>

          <p
            className="text-muted-foreground mb-6 leading-relaxed animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            {t("message")}
          </p>

          {id && (
            <p
              className="text-sm text-muted-foreground mb-8 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              {t("orderNumber")}:{" "}
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                {id.slice(0, 8).toUpperCase()}
              </code>
            </p>
          )}

          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            {t("back")}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
