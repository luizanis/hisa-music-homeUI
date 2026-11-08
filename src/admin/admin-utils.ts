/**
 * Small presentation helpers for the admin prototype. Nothing here touches the
 * database: dates, initials and BRL input parsing are display-only utilities.
 */
export const formatAdminDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  })
    .format(new Date(iso))
    .replace(".", "");

export const formatAdminDateTime = (iso: string, locale: string) => {
  const date = formatAdminDate(iso, locale);
  const time = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
  return `${date} · ${time}`;
};

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const priceToInput = (cents: number) => (cents / 100).toFixed(2);

export const parsePriceInput = (value: string) => {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 100)) : NaN;
};
