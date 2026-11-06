import { Outlet, createFileRoute, redirect, useMatches } from "@tanstack/react-router";
import { I18nextProvider, useTranslation } from "react-i18next";

import { CartDrawerProvider } from "@/components/cart/cart-drawer";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getI18n } from "@/i18n/config";
import { defaultLocale, isLocale, localePath, locales } from "@/i18n/routing";

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    /** Member-area pages render as an app: same header, no marketing footer. */
    appShell?: boolean;
  }
}

/**
 * Shared shell for every public page. The locale lives in the URL, so this
 * layout is the single place that picks the translations for the page.
 */
export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params, location }) => {
    const requested: string = params.locale;
    if (locales.includes(requested)) return;
    // Keep a casing slip (/PT/music -> /pt/music) instead of losing the path.
    const normalized = requested.toLowerCase();
    const rest = location.pathname.split("/").filter(Boolean).slice(1).join("/");
    const target = isLocale(normalized)
      ? localePath(normalized, rest)
      : localePath(defaultLocale, rest);
    throw redirect({ href: `${target}${location.searchStr}`, replace: true });
  },
  component: LocaleLayout,
});

function LocaleShell() {
  const { t } = useTranslation();
  const isAppShell = useMatches({
    select: (matches) => matches.some((match) => match.staticData?.appShell),
  });

  return (
    <CartDrawerProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-wire-ink focus:bg-background focus:px-3 focus:py-2 focus:text-[11px] focus:uppercase focus:tracking-[0.16em] focus:text-foreground"
        >
          {t("common.skipToContent")}
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        {isAppShell ? null : <SiteFooter />}
      </div>
    </CartDrawerProvider>
  );
}

function LocaleLayout() {
  const { locale } = Route.useParams();

  return (
    <I18nextProvider i18n={getI18n(locale)}>
      <LocaleShell />
    </I18nextProvider>
  );
}
