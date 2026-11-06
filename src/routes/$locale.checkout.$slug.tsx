import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CatalogError } from "@/components/catalog/catalog-browser";
import { ProductBox } from "@/components/catalog/product-box";
import { AppLink as Link } from "@/components/site/app-link";
import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { localePath } from "@/i18n/routing";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, productTitle, type CatalogKey } from "@/lib/catalog";
import { catalogProductQuery } from "@/lib/catalog-queries";
import { translatedHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

const methods = ["credit", "pix"] as const;
type Method = (typeof methods)[number];

const signinHrefFor = (locale: string, slug: string) =>
  `${localePath(locale, "signin")}?next=${encodeURIComponent(
    `${localePath(locale, "checkout")}/${slug}`,
  )}`;

export const Route = createFileRoute("/$locale/checkout/$slug")({
  // The session lives in browser storage, so this page only renders client-side.
  ssr: false,
  beforeLoad: async ({ params }) => {
    const { data } = await supabase.auth.getUser();
    const email = data.user?.email;
    if (!email) {
      throw redirect({ href: signinHrefFor(params.locale, params.slug), replace: true });
    }
    return { email };
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(catalogProductQuery(params.slug)),
  head: ({ params }) => ({
    meta: [
      ...translatedHead(params.locale, "checkout.title", "checkout.lead").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  errorComponent: CatalogError,
  component: CheckoutPage,
});

function CheckoutPage() {
  const { locale, slug } = Route.useParams();
  const { email } = Route.useRouteContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: product } = useSuspenseQuery(catalogProductQuery(slug));

  const [method, setMethod] = useState<Method>("credit");
  const [confirmed, setConfirmed] = useState(false);

  if (!product) {
    return (
      <Section innerClassName="py-20">
        <p className="text-[13px] text-wire-ink-soft">{t("product.notFound")}</p>
        <Button asChild variant="outline" className="mt-6">
          <Link to={localePath(locale, "academy")}>{t("product.back")}</Link>
        </Button>
      </Section>
    );
  }

  const catalog = product.catalog as CatalogKey;
  const title = productTitle(product, locale);

  const signOut = async () => {
    await supabase.auth.signOut();
    void navigate({ href: signinHrefFor(locale, slug), replace: true });
  };

  return (
    <Section innerClassName="py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <SectionLabel label={t("checkout.title")} />
          <h1 className="mt-5 text-display-sm font-medium uppercase text-foreground">
            {t("checkout.title")}
          </h1>
          <p className="mt-4 max-w-[46ch] text-[13px] leading-relaxed text-wire-ink-soft">
            {t("checkout.lead")}
          </p>

          <div className="mt-8 border-t border-wire-rule pt-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
              {t("checkout.signedAs")}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className="text-[13px] text-foreground">{email}</p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 hover:text-foreground"
              >
                {t("checkout.logout")}
              </button>
            </div>
          </div>

          <fieldset className="mt-8">
            <legend className="text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
              {t("checkout.method")}
            </legend>
            <div className="mt-3 grid gap-2">
              {methods.map((item) => (
                <label
                  key={item}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 border px-4 py-3 text-[12px] uppercase tracking-[0.12em] transition-colors",
                    method === item
                      ? "border-wire-ink bg-wire-surface text-foreground"
                      : "border-wire-rule text-wire-ink-soft hover:border-wire-ink-soft",
                  )}
                >
                  <span>{t(`checkout.${item}`)}</span>
                  <input
                    type="radio"
                    name="payment-method"
                    value={item}
                    checked={method === item}
                    onChange={() => setMethod(item)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "h-3 w-3 rounded-full border",
                      method === item ? "border-wire-ink bg-wire-ink" : "border-wire-rule",
                    )}
                  />
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="self-start border border-wire-rule bg-background">
          <div className="border-b border-wire-rule p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
              {t("checkout.summary")}
            </p>
          </div>

          <div className="flex gap-4 p-4">
            <ProductBox
              title={title}
              kicker={t(`catalog.${catalog}.filters.${product.category}`)}
              code={`${catalog === "academy" ? "AC" : "SP"}-${product.category.slice(0, 3).toUpperCase()}`}
              variant={1}
            />
            <div className="flex flex-1 flex-col justify-center">
              <h2 className="text-[12px] uppercase leading-snug tracking-[0.06em] text-foreground">
                {title}
              </h2>
              <p className="mt-2 font-mono text-[13px] text-foreground">
                {formatPrice(product.price_cents)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-wire-rule px-4 py-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
              {t("checkout.total")}
            </span>
            <span className="font-mono text-[15px] text-foreground">
              {formatPrice(product.price_cents)}
            </span>
          </div>

          <div className="border-t border-wire-rule p-4">
            {confirmed ? (
              <div
                role="status"
                className="border border-wire-ink bg-wire-surface p-3 text-[11px] leading-relaxed text-foreground"
              >
                {t("checkout.draft")}
              </div>
            ) : (
              <>
                <Button size="lg" className="w-full" onClick={() => setConfirmed(true)}>
                  {t("checkout.pay")}
                </Button>
                <p className="mt-3 text-[10px] leading-relaxed text-wire-ink-soft">
                  {t("checkout.draft")}
                </p>
              </>
            )}
          </div>
        </aside>
      </div>
    </Section>
  );
}
