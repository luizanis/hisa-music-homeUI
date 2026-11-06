import i18next, { type i18n as I18n } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import pt from "./locales/pt.json";
import { fallbackLng, supportedLngs } from "./util";

export * from "./util";

const resources = {
  pt: { translation: pt },
  en: { translation: en },
} as const;

/**
 * One fixed i18next instance per locale. The locale lives in the URL, so each
 * page renders with the instance for its own prefix (via I18nextProvider).
 * Nothing calls changeLanguage on a shared instance, which keeps server
 * rendering safe when requests for /pt and /en run side by side.
 */
const createInstance = (lng: string): I18n => {
  const instance = i18next.createInstance();
  void instance.use(initReactI18next).init({
    lng,
    fallbackLng,
    supportedLngs,
    resources,
    initAsync: false,
    // Flat dotted keys in a single namespace.
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
};

const fallbackInstance = createInstance(fallbackLng);
const instances = new Map<string, I18n>([[fallbackLng, fallbackInstance]]);
for (const code of supportedLngs) {
  if (!instances.has(code)) instances.set(code, createInstance(code));
}

export const getI18n = (locale: string): I18n => instances.get(locale) ?? fallbackInstance;

/** Translate outside React (route head(), loaders). */
export const translate = (
  locale: string,
  key: string,
  options?: Record<string, string | number>,
): string =>
  options ? getI18n(locale).t(key, options) : getI18n(locale).t(key);
