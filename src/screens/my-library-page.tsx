import {
  ChevronDown,
  Download,
  LibraryBig,
  Search,
  SearchX,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { ProductBox } from "@/components/catalog/product-box";
import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { libraryItems } from "@/data/account";
import { useLocale } from "@/i18n/routing";
import { formatDate } from "@/lib/account";
import { catalogCategories, pickLocale } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const LibraryPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const key = pickLocale(locale);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const filters = ["all", ...catalogCategories.sounds];
  const normalized = query.trim().toLowerCase();

  const visible = libraryItems.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const matchesQuery =
      normalized.length === 0 ||
      item.title[key].toLowerCase().includes(normalized) ||
      t(`catalog.sounds.filters.${item.category}`)
        .toLowerCase()
        .includes(normalized);
    return matchesCategory && matchesQuery;
  });

  return (
    <>
      <PageHeader
        label={t("library.label")}
        title={t("library.title")}
        description={t("library.lead")}
        actions={
          <Button asChild variant="outline">
            <Link to={to("sounds")}>{t("library.browse")}</Link>
          </Button>
        }
      />

      {libraryItems.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={LibraryBig}
            title={t("library.empty.title")}
            text={t("library.empty.text")}
          >
            <Button asChild>
              <Link to={to("sounds")}>{t("library.empty.cta")}</Link>
            </Button>
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-[320px]">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-wire-ink-soft"
                strokeWidth={1.5}
              />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("library.searchPlaceholder")}
                aria-label={t("library.search")}
                className="h-10 border-wire-rule bg-background pl-9 text-[12px]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={cn(
                    "border px-2.5 py-2 text-[9px] uppercase tracking-[0.14em] transition-colors",
                    category === item
                      ? "border-wire-ink bg-primary text-primary-foreground"
                      : "border-wire-rule text-wire-ink-soft hover:border-wire-ink-soft hover:text-foreground",
                  )}
                >
                  {t(`catalog.sounds.filters.${item}`)}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={SearchX}
                title={t("library.noResults.title")}
                text={t("library.noResults.text")}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                  }}
                >
                  {t("library.noResults.clear")}
                </Button>
              </EmptyState>
            </div>
          ) : (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((item) => {
                const isOpen = openSlug === item.slug;
                return (
                  <li key={item.slug} className="flex">
                    <article className="flex w-full flex-col border border-wire-rule bg-background">
                      <ProductBox
                        title={item.title[key]}
                        kicker={t(`catalog.sounds.filters.${item.category}`)}
                        code={`SP-${item.category.slice(0, 3).toUpperCase()}`}
                        variant={item.variant}
                      />

                      <div className="flex flex-1 flex-col border-t border-wire-rule p-4">
                        <p className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                          {t(`catalog.sounds.filters.${item.category}`)} ·{" "}
                          {t("library.purchased", {
                            date: formatDate(item.purchasedAt, locale),
                          })}
                        </p>

                        <h2 className="mt-2 text-[12px] font-medium uppercase leading-snug tracking-[0.06em] text-foreground">
                          {item.title[key]}
                        </h2>

                        <p className="mt-2 font-mono text-[10px] text-wire-ink-soft">
                          {item.formats.join(" · ")}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => setDownloaded(item.slug)}
                          >
                            <Download aria-hidden strokeWidth={1.5} />
                            {t("library.download")}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setOpenSlug(isOpen ? null : item.slug)
                            }
                            aria-expanded={isOpen}
                          >
                            {isOpen ? t("library.hide") : t("library.details")}
                            <ChevronDown
                              aria-hidden
                              strokeWidth={1.5}
                              className={cn(
                                "transition-transform",
                                isOpen && "rotate-180",
                              )}
                            />
                          </Button>
                        </div>

                        {downloaded === item.slug ? (
                          <p
                            role="status"
                            className="mt-3 border border-wire-rule bg-wire-surface px-3 py-2 text-[10px] leading-relaxed text-wire-ink-soft"
                          >
                            {t("library.downloaded")}
                          </p>
                        ) : null}

                        {isOpen ? (
                          <div className="mt-4 border-t border-wire-rule pt-3">
                            <p className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                              {t("library.contents")}
                            </p>
                            <ul className="mt-2 space-y-2">
                              {item.contents.map((line) => (
                                <li
                                  key={line[key]}
                                  className="flex gap-2 text-[11px] leading-relaxed text-wire-ink-soft"
                                >
                                  <span
                                    aria-hidden
                                    className="mt-[6px] h-1 w-1 shrink-0 bg-wire-ink-soft/60"
                                  />
                                  {line[key]}
                                </li>
                              ))}
                            </ul>

                            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-wire-rule pt-3 text-[10px]">
                              <div>
                                <dt className="uppercase tracking-[0.12em] text-wire-ink-soft">
                                  {t("library.files")}
                                </dt>
                                <dd className="mt-0.5 font-mono text-foreground">
                                  {item.files}
                                </dd>
                              </div>
                              <div>
                                <dt className="uppercase tracking-[0.12em] text-wire-ink-soft">
                                  {t("library.size")}
                                </dt>
                                <dd className="mt-0.5 font-mono text-foreground">
                                  {item.size}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        ) : null}

                        <p className="mt-auto pt-4 text-[9px] leading-relaxed text-wire-ink-soft">
                          {t("library.downloadNote")}
                        </p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </>
  );
};

export default LibraryPage;
