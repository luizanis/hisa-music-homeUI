import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronDown, Download, Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ProductBox } from "@/components/catalog/product-box";
import { EmptyState, FilterChips, PageHeader, formatDate } from "@/components/member/member-ui";
import { AppLink as Link } from "@/components/site/app-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { libraryFiles, libraryFormats, type Material } from "@/data/member-mock";
import { useLocale } from "@/i18n/routing";
import { productCode, snapshotTitle } from "@/lib/cart";
import { catalogCategories } from "@/lib/catalog";
import { useLibrary } from "@/lib/member-store";
import { translatedHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$locale/_member/my-library")({
  head: ({ params }) => ({
    meta: [
      ...translatedHead(params.locale, "member.nav.library", "library.lead").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyLibraryPage,
});

type DownloadState = "idle" | "preparing" | "downloading" | "done";

/** Simulated download: no file is delivered in Phase 01. */
const useSimulatedDownload = () => {
  const [state, setState] = useState<DownloadState>("idle");
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);

  const start = () => {
    if (state === "preparing" || state === "downloading") return;
    setState("preparing");
    setProgress(0);
    window.setTimeout(() => {
      setState("downloading");
      timer.current = window.setInterval(() => {
        setProgress((value) => {
          const next = Math.min(100, value + 20);
          if (next === 100) {
            if (timer.current) window.clearInterval(timer.current);
            setState("done");
          }
          return next;
        });
      }, 250);
    }, 600);
  };

  return { state, progress, start };
};

const DownloadButton = ({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) => {
  const { t } = useTranslation();
  const { state, progress, start } = useSimulatedDownload();

  const text =
    state === "preparing"
      ? t("library.preparing")
      : state === "downloading"
        ? `${t("library.downloading")} ${progress}%`
        : state === "done"
          ? t("library.downloaded")
          : t("library.download");

  return (
    <Button
      type="button"
      size={compact ? "sm" : "default"}
      variant={compact || state === "done" ? "outline" : "default"}
      onClick={start}
      aria-label={`${text}: ${label}`}
      aria-live="polite"
      className={cn(compact ? "" : "w-full")}
    >
      {state === "preparing" || state === "downloading" ? (
        <Loader2 aria-hidden className="animate-spin" strokeWidth={1.5} />
      ) : state === "done" ? (
        <Check aria-hidden strokeWidth={1.5} />
      ) : (
        <Download aria-hidden strokeWidth={1.5} />
      )}
      {text}
    </Button>
  );
};

const FileRow = ({ file }: { file: Material }) => (
  <li className="flex flex-wrap items-center justify-between gap-2 border-b border-wire-rule py-2.5 last:border-b-0">
    <span className="min-w-0">
      <span className="block truncate font-mono text-[11px] text-foreground">{file.name}</span>
      <span className="font-mono text-[10px] text-wire-ink-soft">{file.size}</span>
    </span>
    <DownloadButton label={file.name} compact />
  </li>
);

const categories = ["all", ...catalogCategories.sounds] as const;

function MyLibraryPage() {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { downloads } = useLibrary();
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const term = query.trim().toLowerCase();
  const visible = downloads.filter(
    ({ item }) =>
      (category === "all" || item.category === category) &&
      (!term || snapshotTitle(item, locale).toLowerCase().includes(term)),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        label={t("member.group.learning")}
        title={t("member.nav.library")}
        lead={t("library.lead")}
        actions={
          <Button asChild variant="outline">
            <Link to={to("sounds")}>{t("library.browse")}</Link>
          </Button>
        }
      />

      {downloads.length === 0 ? (
        <EmptyState title={t("library.emptyTitle")} text={t("library.emptyText")}>
          <Button asChild>
            <Link to={to("sounds")}>{t("library.browse")}</Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <div className="space-y-3">
            <div className="relative max-w-sm">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-wire-ink-soft" strokeWidth={1.5} />
              <label htmlFor="library-search" className="sr-only">
                {t("library.search")}
              </label>
              <Input
                id="library-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("library.search")}
                className="h-10 rounded-[var(--radius)] border-wire-rule bg-background pl-9 text-[12px] focus-visible:ring-1 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <FilterChips
                options={categories}
                value={category as (typeof categories)[number]}
                onChange={setCategory}
                label={t("library.filterLabel")}
                renderLabel={(option) => t(`catalog.sounds.filters.${option}`)}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-wire-ink-soft">
                {visible.length} / {downloads.length}
              </span>
            </div>
          </div>

          {visible.length === 0 ? (
            <EmptyState title={t("library.noMatch")} />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map(({ item, purchasedAt, orderId }, index) => {
                const title = snapshotTitle(item, locale);
                const files = libraryFiles(item.slug, item.category);
                const isOpen = expanded === item.slug;
                const panelId = `library-files-${item.slug}`;
                return (
                  <li key={item.slug} className="flex flex-col border border-wire-rule">
                    <ProductBox
                      title={title}
                      kicker={t(`catalog.sounds.filters.${item.category}`)}
                      code={productCode("sounds", item.category)}
                      variant={index}
                    />
                    <div className="flex flex-1 flex-col border-t border-wire-rule p-4">
                      <p className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                        {t(`catalog.sounds.filters.${item.category}`)}
                      </p>
                      <h2 className="mt-1 text-[13px] font-medium uppercase leading-snug tracking-[0.04em] text-foreground">
                        {title}
                      </h2>
                      <p className="mt-2 text-[11px] text-wire-ink-soft">
                        {t("library.purchased", { date: formatDate(purchasedAt, locale) })} ·{" "}
                        <Link to={`${to("my-orders")}/${orderId}`} className="font-mono underline decoration-wire-rule underline-offset-4 hover:text-foreground">
                          {orderId}
                        </Link>
                      </p>
                      <p className="mt-2 text-[11px] text-foreground">{t(`library.contents.${item.category}`)}</p>
                      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t("library.formats")}>
                        {(libraryFormats[item.category] ?? []).map((format) => (
                          <li key={format} className="border border-wire-rule px-1.5 py-0.5 font-mono text-[9px] uppercase text-wire-ink-soft">
                            {format}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto space-y-2 pt-4">
                        <DownloadButton label={title} />
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setExpanded(isOpen ? null : item.slug)}
                          className="flex w-full items-center justify-between border border-wire-rule px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:border-wire-ink hover:text-foreground"
                        >
                          {t("library.details", { count: files.length })}
                          <ChevronDown aria-hidden className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} strokeWidth={1.5} />
                        </button>
                        {isOpen ? (
                          <ul id={panelId} className="border border-wire-rule px-3">
                            {files.map((file) => (
                              <FileRow key={file.name} file={file} />
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="border-t border-wire-rule pt-4 text-[11px] leading-relaxed text-wire-ink-soft">
            {t("library.simulated")}
          </p>
        </>
      )}
    </div>
  );
}
