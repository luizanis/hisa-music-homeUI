import { useTranslation } from "react-i18next";
import { AppLink as Link } from "@/components/site/app-link";

import { ProductBox } from "@/components/catalog/product-box";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";
import {
  cardCtaKey,
  formatPrice,
  formatSchedule,
  hasInstantAccess,
  productMeta,
  productTitle,
  type CatalogKey,
  type CatalogProduct,
} from "@/lib/catalog";

type ProductCardProps = {
  product: CatalogProduct;
  catalog: CatalogKey;
  index: number;
};

export const ProductCard = ({ product, catalog, index }: ProductCardProps) => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();

  const title = productTitle(product, locale);
  const meta = productMeta(product, locale);
  const instantAccess = hasInstantAccess(product.category);
  const schedule =
    product.category === "workshops" && product.starts_at
      ? formatSchedule(product.starts_at, locale)
      : null;

  const metaLine = schedule
    ? `${t("catalog.workshop.when")}: ${schedule}`
    : catalog === "academy"
      ? `${t("catalog.academy.durationLabel")}: ${meta}`
      : meta;

  return (
    <article className="flex h-full flex-col border border-wire-rule bg-background transition-colors hover:border-wire-ink-soft/60">
      <ProductBox
        title={title}
        kicker={t(`catalog.${catalog}.filters.${product.category}`)}
        code={`${catalog === "academy" ? "AC" : "SP"}-${product.category.slice(0, 3).toUpperCase()}`}
        variant={index}
      />

      <div className="flex flex-1 flex-col border-t border-wire-rule p-4 sm:p-5">
        {instantAccess ? (
          <span className="mb-3 w-fit border border-wire-ink px-1.5 py-1 text-[8px] uppercase tracking-[0.16em] text-foreground">
            {t("catalog.tag.instant")}
          </span>
        ) : null}

        <h3 className="text-[13px] font-medium uppercase leading-snug tracking-[0.06em] text-foreground sm:text-[14px]">
          {title}
        </h3>

        <p className="mt-3 font-mono text-[14px] text-foreground">
          {formatPrice(product.price_cents)}
        </p>

        <Button asChild className="mt-4 w-full">
          <Link to={`${to("product")}/${product.slug}`}>
            {t(cardCtaKey(catalog, product.category))}
          </Link>
        </Button>

        <p className="mt-auto pt-4 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
          {metaLine}
        </p>
      </div>
    </article>
  );
};
