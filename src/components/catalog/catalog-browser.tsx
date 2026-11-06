import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ProductCard } from "@/components/catalog/product-card";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { catalogCategories, type CatalogKey } from "@/lib/catalog";
import { catalogProductsQuery } from "@/lib/catalog-queries";
import { cn } from "@/lib/utils";

const ALL = "all";

type CatalogBrowserProps = {
  catalog: CatalogKey;
};

/** Shown when the catalog could not be loaded; retry re-runs the page loader. */
export const CatalogError = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Section tone="surface" innerClassName="py-10 md:py-14">
      <div className="flex flex-col items-start gap-4 border border-wire-rule bg-background p-6">
        <p className="text-[13px] text-wire-ink-soft">{t("catalog.error")}</p>
        <Button variant="outline" onClick={() => void router.invalidate()}>
          {t("catalog.retry")}
        </Button>
      </div>
    </Section>
  );
};

export const CatalogBrowser = ({ catalog }: CatalogBrowserProps) => {
  const { t } = useTranslation();
  const { data } = useSuspenseQuery(catalogProductsQuery(catalog));
  const [activeFilter, setActiveFilter] = useState<string>(ALL);

  const products = data;
  const hasProducts = products.length > 0;
  const filters = [ALL, ...catalogCategories[catalog]];
  const visibleProducts =
    activeFilter === ALL
      ? products
      : products.filter((product) => product.category === activeFilter);

  return (
    <Section tone="surface" innerClassName="py-10 md:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={isActive}
              className={cn(
                "h-9 border px-3 text-[10px] uppercase tracking-[0.14em] transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-wire-rule bg-background text-wire-ink-soft hover:border-wire-ink hover:text-foreground",
              )}
            >
              {t(`catalog.${catalog}.filters.${filter}`)}
            </button>
          );
        })}
        </div>

        {hasProducts ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-wire-ink-soft">
            {visibleProducts.length} / {products.length}
          </span>
        ) : null}
      </div>

      {!hasProducts ? (
        <div className="mt-8 border border-dashed border-wire-rule bg-background px-6 py-12 text-center">
          <p className="text-[12px] uppercase tracking-[0.12em] text-wire-ink-soft">
            {t(`catalog.${catalog}.empty`)}
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product, index) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                catalog={catalog}
                index={index}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 border-t border-wire-rule pt-4 text-[11px] leading-relaxed text-wire-ink-soft">
        {t(`catalog.${catalog}.note`)}
      </p>
    </Section>
  );
};
