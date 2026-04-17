import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import { Playfair_Display, Cairo } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";

import "@/app/admin.css";

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
    // <div className="flex min-h-screen">
    //   <AdminSidebar />
    //   <main className="flex-1 bg-background overflow-auto">{children}</main>
    // </div>
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${locale === "ar" ? cairo.variable : playfair.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <NextIntlClientProvider messages={messages} locale={locale}>
            <QueryProvider>
              <TooltipProvider>
                <SidebarProvider>
                  <AdminSidebar />
                  <SidebarInset>
                    <main className="flex flex-1 flex-col gap-4 p-4">
                      {children}
                    </main>
                  </SidebarInset>
                </SidebarProvider>
              </TooltipProvider>

              <Toaster position="bottom-right" richColors />
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
