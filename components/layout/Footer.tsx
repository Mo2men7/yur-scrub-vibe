"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl font-bold mb-3">
              yur<span className="text-accent-gold">.</span>scrub
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {locale === "ar"
                ? "سكراب طبي مصري مصمم للمحترفين الذين يُحيون الأرواح."
                : "Egyptian medical scrubs designed for professionals who save lives."}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">
              {locale === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {[
                { href: `/${locale}`, label: t("nav.home") },
                { href: `/${locale}/products`, label: t("nav.products") },
                { href: `/${locale}/about`, label: t("nav.about") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">
              {locale === "ar" ? "تواصل معنا" : "Contact"}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:hello@yurscrub.com"
                  className="hover:text-foreground transition-colors"
                >
                  hello@yurscrub.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/yurscrub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  @yurscrub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} yur.scrub.{" "}
            {locale === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <p>
            {locale === "ar" ? "صُنع بـ" : "Made in"}{" "}
            <span className="text-accent-gold">🇪🇬</span> Egypt
          </p>
        </div>
      </div>
    </footer>
  );
}
