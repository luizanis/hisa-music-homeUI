import { translate } from "@/i18n/config";

const siteTagline: Record<string, string> = {
  pt: "Um universo em constante recomposição",
  en: "A universe in constant recomposition",
};

const siteDescription: Record<string, string> = {
  pt: "HISA — música, conhecimento e experimentação criativa. Lançamentos, Academy, Sounds & Packs e serviços criativos.",
  en: "HISA — music, knowledge and creative experimentation. Releases, Academy, Sounds & Packs and creative services.",
};

const pick = (map: Record<string, string>, locale: string) => map[locale] ?? map["pt"] ?? "";

/** Page metadata for a localized route. `title` omitted = the site home title. */
export const pageHead = (
  locale: string,
  options: { title?: string | undefined; description?: string | undefined } = {},
) => {
  const title = options.title
    ? `${options.title} · HISA`
    : `HISA — ${pick(siteTagline, locale)}`;
  const description = options.description ?? pick(siteDescription, locale);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: locale === "en" ? "en_US" : "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  };
};

/** Shortcut for pages whose title and lead already live in the locale files. */
export const translatedHead = (locale: string, titleKey: string, descriptionKey?: string) =>
  pageHead(locale, {
    title: translate(locale, titleKey),
    description: descriptionKey ? translate(locale, descriptionKey) : undefined,
  });
