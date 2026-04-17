import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import { Playfair_Display, Cairo } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";

import "../../../../app/admin.css";
import { Separator } from "@/components/ui/separator";

const locales = ["ar", "en"];

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // params: Promise<{ locale: string }>;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${locale === "ar" ? cairo.variable : playfair.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" enableSystem={false}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <QueryProvider>
              <TooltipProvider>
                <SidebarProvider>
                  <AdminSidebar />
                  <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                      <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator
                          orientation="vertical"
                          className="mr-2 h-4"
                        />
                      </div>
                    </header>

                    <main className="flex flex-1 flex-col gap-4 p-4">
                      {children}
                    </main>
                  </SidebarInset>
                </SidebarProvider>
              </TooltipProvider>

              <Toaster position="bottom-right" />
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
