import { useParams } from "@tanstack/react-router";

import { fallbackLng, supportedLngs } from "./util";

/**
 * Locale prefixes are part of the URL contract: /pt and /en. The manifest in
 * i18n.config.json stays the single source of truth for which locales exist.
 */
export const defaultLocale = fallbackLng;
export const locales = supportedLngs;

export const isLocale = (value?: string | null): value is string =>
  Boolean(value && locales.includes(value));

/** Build an in-site path for a locale: localePath("pt", "music") -> /pt/music */
export const localePath = (locale: string, path = "") => {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
};

/** Only same-origin relative paths are accepted as post-sign-in targets. */
export const safeNextPath = (value: unknown): string | undefined =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : undefined;

/**
 * Read the active locale from the route and derive links that keep the visitor
 * inside the same language. Every internal link in the app must be built with
 * `to()` so the locale prefix can never be dropped by accident.
 */
export const useLocale = () => {
  const { locale } = useParams({ strict: false }) as { locale?: string };
  const active = isLocale(locale) ? locale : defaultLocale;

  return {
    locale: active,
    to: (path = "") => localePath(active, path),
  };
};
