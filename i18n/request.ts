import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["ar", "en"];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as string)) notFound();

  return {
    locale: locale || "en",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
