import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  console.log("requested", requested, "12323233");

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  console.log("locale", locale, "12323");

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
