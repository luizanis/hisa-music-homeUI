import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CalendarDays, Play } from "lucide-react";
import { useTranslation } from "react-i18next";

import { CatalogError } from "@/components/catalog/catalog-browser";
import { ProductBox } from "@/components/catalog/product-box";
import { AppLink as Link } from "@/components/site/app-link";
import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { translate } from "@/i18n/config";
import { useLocale } from "@/i18n/routing";
import {
  formatPrice,
  formatSchedule,
  hasInstantAccess,
  productCtaKey,
  productIncludes,
  productMeta,
  productModules,
  productSummary,
  productTitle,
  type CatalogKey,
} from "@/lib/catalog";
import { catalogProductQuery } from "@/lib/catalog-queries";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/product/$slug")({
  loader: async ({ context, params }) => ({
    product: await context.queryClient.ensureQueryData(catalogProductQuery(params.slug)),
  }),
  head: ({ params, loaderData }) => {
    const product = loaderData?.product;
    if (!product) {
      return pageHead(params.locale, { title: translate(params.locale, "product.notFound") });
    }
    return pageHead(params.locale, {
      title: productTitle(product, params.locale),
      description: productSummary(product, params.locale) || productMeta(product, params.locale),
    });
  },
  errorComponent: CatalogError,
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { data: product } = useSuspenseQuery(catalogProductQuery(slug));

  if (!product) {
    return (
      <Section innerClassName="py-20">
        <p className="text-[13px] text-wire-ink-soft">{t("product.notFound")}</p>
        <Button asChild variant="outline" className="mt-6">
          <Link to={to("academy")}>{t("product.back")}</Link>
        </Button>
      </Section>
    );
  }

  const catalog = product.catalog as CatalogKey;
  const title = productTitle(product, locale);
  const summary = productSummary(product, locale);
  const includes = productIncludes(product, locale);
  const modules = productModules(product, locale);
  const meta = productMeta(product, locale);
  const instantAccess = hasInstantAccess(product.category);
  const schedule =
    product.category === "workshops" && product.starts_at
      ? formatSchedule(product.starts_at, locale)
      : null;

  const checkoutPath = `${to("checkout")}/${product.slug}`;
  const ctaHref = `${to("signin")}?next=${encodeURIComponent(checkoutPath)}`;

  return (
    <>
      <Section innerClassName="py-10 md:py-14">
        <Link
          to={to(catalog)}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t("product.back")}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <ProductBox
              title={title}
              kicker={t(`catalog.${catalog}.filters.${product.category}`)}
              code={`${catalog === "academy" ? "AC" : "SP"}-${product.category.slice(0, 3).toUpperCase()}`}
              variant={0}
              size="large"
            />

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
              {schedule ? (
                <span className="inline-flex items-center gap-1.5 border border-wire-rule px-2 py-1">
                  <CalendarDays aria-hidden className="h-3 w-3" strokeWidth={1.5} />
                  {schedule}
                </span>
              ) : (
                <span className="border border-wire-rule px-2 py-1">{meta}</span>
              )}
              {instantAccess ? (
                <span className="border border-wire-ink px-2 py-1 text-foreground">
                  {t("catalog.tag.instant")}
                </span>
              ) : null}
            </div>
          </div>

          <div>
            <SectionLabel
              label={`${t(`catalog.${catalog}.label`)} / ${t(
                `catalog.${catalog}.filters.${product.category}`,
              )}`}
            />

            <h1 className="mt-5 max-w-[20ch] text-display-sm font-medium uppercase text-foreground">
              {title}
            </h1>

            {summary ? (
              <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-wire-ink-soft">
                {summary}
              </p>
            ) : null}

            <p className="mt-6 font-mono text-[18px] text-foreground">
              {formatPrice(product.price_cents)}
            </p>

            {includes.length > 0 ? (
              <div className="mt-8 border-t border-wire-rule pt-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-wire-ink-soft">
                  {t("product.includes")}
                </p>
                <ul className="mt-3 space-y-2">
                  {includes.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-[13px] leading-relaxed text-wire-ink-soft"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] h-1 w-1 shrink-0 bg-wire-ink-soft/60"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Button asChild size="lg" className="mt-8">
              <Link to={ctaHref}>
                {t(productCtaKey(catalog, product.category))}
                <ArrowUpRight aria-hidden strokeWidth={1.5} />
              </Link>
            </Button>
            <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
              {t("product.secure")}
            </p>

            {catalog === "sounds" ? (
              <div className="mt-8 border border-wire-rule bg-background">
                <div className="flex items-center justify-between border-b border-wire-rule px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-foreground">
                    {t("product.previews")}
                  </p>
                  <span className="font-mono text-[10px] text-wire-ink-soft">WAV</span>
                </div>
                <ul>
                  {["01", "02", "03"].map((n) => (
                    <li
                      key={n}
                      className="flex items-center justify-between border-b border-wire-rule px-4 py-3 last:border-b-0"
                    >
                      <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-wire-ink-soft">
                        <Play aria-hidden className="h-3 w-3" strokeWidth={1.5} />
                        Sample {n}
                      </span>
                      <span className="font-mono text-[10px] text-wire-ink-soft">0:08</span>
                    </li>
                  ))}
                </ul>
                <p className="border-t border-wire-rule px-4 py-3 text-[10px] leading-relaxed text-wire-ink-soft">
                  {t("product.previewsNote")}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </Section>

      {modules.length > 0 ? (
        <Section tone="surface" innerClassName="py-12 md:py-16">
          <SectionLabel label={t("product.modules")} />
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {modules.map((module) => (
              <li key={module.title} className="border border-wire-rule bg-background p-5">
                <h2 className="text-[12px] uppercase tracking-[0.12em] text-foreground">
                  {module.title}
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-wire-ink-soft">
                  {module.detail}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}
    </>
  );
}
