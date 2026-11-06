export type CatalogKey = "academy" | "sounds";

/** Every category a catalog can be filtered by, in display order. */
export const catalogCategories: Record<CatalogKey, readonly string[]> = {
  academy: ["courses", "lessons", "analyses", "workshops", "mentorship"],
  sounds: ["samples", "bundles", "midi", "drums", "presets", "vocals"],
};

export type LocalizedText = { pt: string; en: string };

export type ProductModule = { title: string; detail: string };

export type ProductContent = {
  summary?: LocalizedText;
  includes?: { pt: string[]; en: string[] };
  modules?: { pt: ProductModule[]; en: ProductModule[] };
};

export type CatalogProduct = {
  id: string;
  catalog: string;
  category: string;
  slug: string;
  title_pt: string;
  title_en: string;
  meta_pt: string;
  meta_en: string;
  price_cents: number;
  starts_at: string | null;
  content: ProductContent | null;
};

export const pickLocale = (locale: string): "pt" | "en" =>
  locale === "en" ? "en" : "pt";

/** Product copy is stored per language so the catalog never mixes languages. */
export const productTitle = (product: CatalogProduct, locale: string) =>
  locale === "en" ? product.title_en : product.title_pt;

export const productMeta = (product: CatalogProduct, locale: string) =>
  locale === "en" ? product.meta_en : product.meta_pt;

export const productSummary = (product: CatalogProduct, locale: string) =>
  product.content?.summary?.[pickLocale(locale)] ?? "";

export const productIncludes = (product: CatalogProduct, locale: string) =>
  product.content?.includes?.[pickLocale(locale)] ?? [];

export const productModules = (product: CatalogProduct, locale: string) =>
  product.content?.modules?.[pickLocale(locale)] ?? [];

/** Categories that grant access as soon as the purchase is confirmed. */
export const hasInstantAccess = (category: string) =>
  ["courses", "lessons", "analyses"].includes(category);

/** Catalog-card CTA copy differs per category. */
export const cardCtaKey = (catalog: CatalogKey, category: string) => {
  if (category === "mentorship") return "catalog.cta.schedule";
  if (category === "analyses") return "catalog.cta.watch";
  return `catalog.${catalog}.cta`;
};

/** Product-page CTA copy differs per product type. */
export const productCtaKey = (catalog: CatalogKey, category: string) => {
  if (category === "mentorship") return "product.book";
  if (catalog === "sounds") return "product.buy";
  return "product.enroll";
};

/**
 * Prices are always quoted in BRL, so they keep the Brazilian format in both
 * languages: R$ 399,00 — the same string the catalog is priced with.
 */
export const formatPrice = (cents: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(cents / 100);

export const formatSchedule = (iso: string, locale: string) => {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  })
    .format(date)
    .replace(".", "")
    .toUpperCase();
  const time = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(date);

  return `${day} · ${time}`;
};
