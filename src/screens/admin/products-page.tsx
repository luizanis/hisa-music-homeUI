import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  SearchX,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";
import { toast } from "sonner";

import { useAdminDemo } from "@/admin/admin-demo-store";
import type { DemoProduct } from "@/admin/admin-types";
import { formatAdminDate } from "@/admin/admin-utils";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrototypeLoading } from "@/hooks/use-prototype-loading";
import { useLocale } from "@/i18n/routing";
import { catalogCategories, formatPrice, pickLocale } from "@/lib/catalog";

type StatusFilter = "all" | "published" | "unpublished";

const AdminProductsPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { products, setPublished, moveProduct } = useAdminDemo();
  const isLoading = usePrototypeLoading();

  const [search, setSearch] = useState("");
  const [catalog, setCatalog] = useState<"all" | "academy" | "sounds">("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const localeKey = pickLocale(locale);

  const categoryOptions = useMemo(() => {
    if (catalog === "all") {
      return ["academy", "sounds"].flatMap((key) =>
        catalogCategories[key as "academy" | "sounds"].map((value) => ({
          value,
          catalog: key as "academy" | "sounds",
        })),
      );
    }
    return catalogCategories[catalog].map((value) => ({
      value,
      catalog,
    }));
  }, [catalog]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...products]
      .filter((product) => {
        if (catalog !== "all" && product.catalog !== catalog) return false;
        if (category !== "all" && product.category !== category) return false;
        if (status === "published" && !product.published) return false;
        if (status === "unpublished" && product.published) return false;
        if (!term) return true;
        return [product.titlePt, product.titleEn, product.slug]
          .join(" ")
          .toLowerCase()
          .includes(term);
      })
      .sort((a, b) => {
        if (a.catalog !== b.catalog) return a.catalog.localeCompare(b.catalog);
        return a.position - b.position;
      });
  }, [catalog, category, products, search, status]);

  const boundary = (product: DemoProduct, direction: -1 | 1) => {
    const siblings = products
      .filter((entry) => entry.catalog === product.catalog)
      .sort((a, b) => a.position - b.position);
    const index = siblings.findIndex((entry) => entry.slug === product.slug);
    return index + direction < 0 || index + direction >= siblings.length;
  };

  const resetFilters = () => {
    setSearch("");
    setCatalog("all");
    setCategory("all");
    setStatus("all");
  };

  return (
    <>
      <PageHeader
        label={t("admin.products.label")}
        title={t("admin.products.title")}
        description={t("admin.products.description")}
        actions={
          <Button asChild>
            <Link to={to("admin/products/new")}>
              <Plus aria-hidden strokeWidth={1.5} />
              {t("admin.products.new")}
            </Link>
          </Button>
        }
      />

      <div className="mt-3 flex flex-col gap-2 border-l-2 border-wire-ink bg-wire-surface px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-relaxed text-wire-ink-soft">
          {t("admin.products.demoNote")}
        </p>
        <p className="shrink-0 text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
          {t("admin.products.noDelete")}
        </p>
      </div>

      <Panel className="mt-5" bodyClassName="p-0">
        <div className="grid gap-3 border-b border-wire-rule p-4 lg:grid-cols-[minmax(0,1fr)_160px_170px_150px_auto]">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-wire-ink-soft"
              strokeWidth={1.5}
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("admin.products.searchPlaceholder")}
              aria-label={t("admin.common.search")}
              className="h-9 rounded-[var(--radius)] border-wire-rule pl-9 text-[11px]"
            />
          </div>

          <select
            value={catalog}
            onChange={(event) => {
              setCatalog(event.target.value as typeof catalog);
              setCategory("all");
            }}
            aria-label={t("admin.products.filterCatalog")}
            className="h-9 w-full border border-wire-rule bg-background px-2 text-[9px] uppercase tracking-[0.1em] text-foreground"
          >
            <option value="all">{t("admin.products.allCatalogs")}</option>
            <option value="academy">{t("catalog.academy.label")}</option>
            <option value="sounds">{t("catalog.sounds.label")}</option>
          </select>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label={t("admin.products.filterCategory")}
            className="h-9 w-full border border-wire-rule bg-background px-2 text-[9px] uppercase tracking-[0.1em] text-foreground"
          >
            <option value="all">{t("admin.products.allCategories")}</option>
            {categoryOptions.map((option) => (
              <option key={`${option.catalog}-${option.value}`} value={option.value}>
                {t(`catalog.${option.catalog}.filters.${option.value}`)}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            aria-label={t("admin.products.filterStatus")}
            className="h-9 w-full border border-wire-rule bg-background px-2 text-[9px] uppercase tracking-[0.1em] text-foreground"
          >
            <option value="all">{t("admin.products.allStatuses")}</option>
            <option value="published">{t("admin.status.published")}</option>
            <option value="unpublished">{t("admin.status.unpublished")}</option>
          </select>

          <div className="flex items-center justify-between gap-2 lg:justify-end">
            <span className="font-mono text-[9px] text-wire-ink-soft">
              {filtered.length} / {products.length}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-wire-ink-soft"
            >
              {t("admin.common.clearFilters")}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[minmax(0,1fr)_120px_80px] gap-3"
              >
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={SearchX}
              title={t("admin.products.empty.title")}
              text={t("admin.products.empty.text")}
            >
              <Button type="button" variant="outline" onClick={resetFilters}>
                {t("admin.common.clearFilters")}
              </Button>
            </EmptyState>
          </div>
        ) : (
          <>
            <div className="hidden lg:block">
              <table className="w-full caption-bottom text-left">
                <thead className="border-b border-wire-rule bg-wire-surface/40">
                  <tr className="text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft">
                    <th className="px-4 py-2.5 font-normal">
                      {t("admin.products.table.product")}
                    </th>
                    <th className="px-3 py-2.5 font-normal">
                      {t("admin.products.table.catalog")}
                    </th>
                    <th className="px-3 py-2.5 font-normal">
                      {t("admin.products.table.price")}
                    </th>
                    <th className="px-3 py-2.5 font-normal">
                      {t("admin.products.table.position")}
                    </th>
                    <th className="px-3 py-2.5 font-normal">
                      {t("admin.products.table.status")}
                    </th>
                    <th className="px-4 py-2.5 text-right font-normal">
                      {t("admin.products.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-wire-rule last:border-b-0 hover:bg-accent/30"
                    >
                      <td className="px-4 py-3">
                        <p className="max-w-[250px] truncate text-[11px] uppercase tracking-[0.06em] text-foreground">
                          {product[localeKey === "en" ? "titleEn" : "titlePt"]}
                        </p>
                        <p className="mt-0.5 max-w-[250px] truncate font-mono text-[8px] text-wire-ink-soft">
                          {product.slug}
                        </p>
                        <p className="mt-0.5 text-[8px] text-wire-ink-soft">
                          {formatAdminDate(product.updatedAt, locale)}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-[9px] uppercase tracking-[0.08em] text-foreground">
                          {t(`catalog.${product.catalog}.filters.${product.category}`)}
                        </p>
                        <p className="mt-0.5 text-[8px] uppercase tracking-[0.1em] text-wire-ink-soft">
                          {t(`catalog.${product.catalog}.label`)}
                        </p>
                      </td>
                      <td className="px-3 py-3 font-mono text-[10px] text-foreground">
                        {formatPrice(product.priceCents)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <span className="w-4 font-mono text-[10px] text-wire-ink-soft">
                            {product.position}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            aria-label={`${t("admin.products.moveUp")}: ${product.titlePt}`}
                            disabled={boundary(product, -1)}
                            onClick={() => {
                              moveProduct(product.slug, -1);
                              toast.success(t("admin.common.prototypeOnly"));
                            }}
                          >
                            <ArrowUp aria-hidden strokeWidth={1.5} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            aria-label={`${t("admin.products.moveDown")}: ${product.titlePt}`}
                            disabled={boundary(product, 1)}
                            onClick={() => {
                              moveProduct(product.slug, 1);
                              toast.success(t("admin.common.prototypeOnly"));
                            }}
                          >
                            <ArrowDown aria-hidden strokeWidth={1.5} />
                          </Button>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <AdminStatusPill
                          tone={product.published ? "published" : "unpublished"}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={to(`admin/products/${product.slug}/edit`)}>
                              <Pencil aria-hidden strokeWidth={1.5} />
                              {t("admin.common.edit")}
                            </Link>
                          </Button>
                          <AdminConfirmDialog
                            trigger={
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                aria-label={
                                  product.published
                                    ? t("admin.products.unpublish")
                                    : t("admin.products.publish")
                                }
                                title={
                                  product.published
                                    ? t("admin.products.unpublish")
                                    : t("admin.products.publish")
                                }
                              >
                                {product.published ? (
                                  <EyeOff aria-hidden strokeWidth={1.5} />
                                ) : (
                                  <Eye aria-hidden strokeWidth={1.5} />
                                )}
                              </Button>
                            }
                            title={
                              product.published
                                ? t("admin.confirm.unpublish.title")
                                : t("admin.confirm.publish.title")
                            }
                            description={
                              product.published
                                ? t("admin.confirm.unpublish.text")
                                : t("admin.confirm.publish.text")
                            }
                            confirmLabel={
                              product.published
                                ? t("admin.confirm.unpublish.cta")
                                : t("admin.confirm.publish.cta")
                            }
                            onConfirm={() => {
                              setPublished(product.slug, !product.published);
                              toast.success(t("admin.common.prototypeOnly"));
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="lg:hidden">
              {filtered.map((product) => (
                <li
                  key={product.id}
                  className="border-b border-wire-rule p-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.06em] text-foreground">
                        {product[localeKey === "en" ? "titleEn" : "titlePt"]}
                      </p>
                      <p className="mt-1 font-mono text-[8px] text-wire-ink-soft">
                        {product.slug}
                      </p>
                    </div>
                    <AdminStatusPill
                      tone={product.published ? "published" : "unpublished"}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[9px] text-wire-ink-soft">
                    <span>
                      {t(`catalog.${product.catalog}.filters.${product.category}`)}
                    </span>
                    <span className="text-right font-mono text-foreground">
                      {formatPrice(product.priceCents)}
                    </span>
                    <span className="flex items-center gap-1">
                      {t("admin.products.table.position")}: {product.position}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        aria-label={`${t("admin.products.moveUp")}: ${product.titlePt}`}
                        title={t("admin.products.moveUp")}
                        disabled={boundary(product, -1)}
                        onClick={() => {
                          moveProduct(product.slug, -1);
                          toast.success(t("admin.common.prototypeOnly"));
                        }}
                      >
                        <ArrowUp aria-hidden strokeWidth={1.5} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        aria-label={`${t("admin.products.moveDown")}: ${product.titlePt}`}
                        title={t("admin.products.moveDown")}
                        disabled={boundary(product, 1)}
                        onClick={() => {
                          moveProduct(product.slug, 1);
                          toast.success(t("admin.common.prototypeOnly"));
                        }}
                      >
                        <ArrowDown aria-hidden strokeWidth={1.5} />
                      </Button>
                    </span>
                    <span className="text-right">
                      {formatAdminDate(product.updatedAt, locale)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-1.5">
                    <Button asChild variant="outline" size="sm">
                      <Link to={to(`admin/products/${product.slug}/edit`)}>
                        {t("admin.common.edit")}
                      </Link>
                    </Button>
                    <AdminConfirmDialog
                      trigger={
                        <Button type="button" variant="outline" size="sm">
                          {product.published
                            ? t("admin.products.unpublish")
                            : t("admin.products.publish")}
                        </Button>
                      }
                      title={
                        product.published
                          ? t("admin.confirm.unpublish.title")
                          : t("admin.confirm.publish.title")
                      }
                      description={
                        product.published
                          ? t("admin.confirm.unpublish.text")
                          : t("admin.confirm.publish.text")
                      }
                      confirmLabel={
                        product.published
                          ? t("admin.confirm.unpublish.cta")
                          : t("admin.confirm.publish.cta")
                      }
                      onConfirm={() => {
                        setPublished(product.slug, !product.published);
                        toast.success(t("admin.common.prototypeOnly"));
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>
    </>
  );
};

export default AdminProductsPage;
