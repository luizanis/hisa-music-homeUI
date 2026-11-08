import { Inbox, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { useAdminDemo } from "@/admin/admin-demo-store";
import type { InquiryStatus } from "@/admin/admin-types";
import { formatAdminDateTime } from "@/admin/admin-utils";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrototypeLoading } from "@/hooks/use-prototype-loading";
import { useLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const areas = [
  "music",
  "academy",
  "sounds",
  "custom",
  "brands",
  "consulting",
  "show",
] as const;

const AdminInquiriesPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { inquiries, setInquiryStatus } = useAdminDemo();
  const isLoading = usePrototypeLoading();

  const [status, setStatus] = useState<"all" | InquiryStatus>("all");
  const [area, setArea] = useState("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      all: inquiries.length,
      new: inquiries.filter((inquiry) => inquiry.status === "new").length,
      read: inquiries.filter((inquiry) => inquiry.status === "read").length,
      handled: inquiries.filter((inquiry) => inquiry.status === "handled").length,
    }),
    [inquiries],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...inquiries]
      .filter((inquiry) => {
        if (status !== "all" && inquiry.status !== status) return false;
        if (area !== "all" && inquiry.area !== area) return false;
        if (!term) return true;
        return [inquiry.name, inquiry.email, inquiry.message]
          .join(" ")
          .toLowerCase()
          .includes(term);
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [area, inquiries, search, status]);

  const tabs = [
    { value: "all" as const, label: t("admin.inquiries.tab.all"), count: counts.all },
    { value: "new" as const, label: t("admin.inquiries.tab.new"), count: counts.new },
    { value: "read" as const, label: t("admin.inquiries.tab.read"), count: counts.read },
    {
      value: "handled" as const,
      label: t("admin.inquiries.tab.handled"),
      count: counts.handled,
    },
  ];

  const openInquiry = (id: string, currentStatus: InquiryStatus) => {
    if (currentStatus === "new") setInquiryStatus(id, "read");
  };

  return (
    <>
      <PageHeader
        label={t("admin.inquiries.label")}
        title={t("admin.inquiries.title")}
        description={t("admin.inquiries.description")}
        actions={
          <Button asChild variant="outline">
            <Link to={to("admin/products")}>{t("admin.products.title")}</Link>
          </Button>
        }
      />

      <div className="mt-3 flex flex-col gap-2 border-l-2 border-wire-ink bg-wire-surface px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-relaxed text-wire-ink-soft">
          {t("admin.inquiries.demoNote")}
        </p>
        <p className="shrink-0 text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
          {t("admin.inquiries.detail.replyNote")}
        </p>
      </div>

      <Panel className="mt-5" bodyClassName="p-0">
        <div className="flex flex-wrap border-b border-wire-rule">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatus(tab.value)}
              aria-pressed={status === tab.value}
              className={cn(
                "flex items-center gap-2 border-r border-wire-rule px-3 py-3 text-[9px] uppercase tracking-[0.12em] transition-colors sm:px-4",
                status === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "text-wire-ink-soft hover:bg-accent hover:text-foreground",
              )}
            >
              {tab.label}
              <span className="font-mono text-[8px] opacity-70">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-3 border-b border-wire-rule p-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-wire-ink-soft"
              strokeWidth={1.5}
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("admin.inquiries.searchPlaceholder")}
              aria-label={t("admin.common.search")}
              className="h-9 rounded-[var(--radius)] border-wire-rule pl-9 text-[11px]"
            />
          </div>
          <select
            value={area}
            onChange={(event) => setArea(event.target.value)}
            aria-label={t("admin.inquiries.filterArea")}
            className="h-9 w-full border border-wire-rule bg-background px-2 text-[9px] uppercase tracking-[0.1em] text-foreground"
          >
            <option value="all">{t("admin.inquiries.allAreas")}</option>
            {areas.map((value) => (
              <option key={value} value={value}>
                {t(`contact.form.areas.${value}`)}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={SearchX}
              title={t("admin.inquiries.empty.title")}
              text={t("admin.inquiries.empty.text")}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setArea("all");
                  setStatus("all");
                }}
              >
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
                      {t("admin.inquiries.table.from")}
                    </th>
                    <th className="px-3 py-2.5 font-normal">
                      {t("admin.inquiries.table.area")}
                    </th>
                    <th className="px-3 py-2.5 font-normal">
                      {t("admin.inquiries.table.received")}
                    </th>
                    <th className="px-3 py-2.5 font-normal">
                      {t("admin.inquiries.table.status")}
                    </th>
                    <th className="px-4 py-2.5 text-right font-normal">
                      {t("admin.inquiries.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="border-b border-wire-rule last:border-b-0 hover:bg-accent/30"
                    >
                      <td className="px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.06em] text-foreground">
                          {inquiry.name}
                        </p>
                        <p className="mt-0.5 max-w-[260px] truncate text-[9px] text-wire-ink-soft">
                          {inquiry.email}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-[9px] uppercase tracking-[0.08em] text-wire-ink-soft">
                        {t(`contact.form.areas.${inquiry.area}`)}
                      </td>
                      <td className="px-3 py-3 text-[9px] text-wire-ink-soft">
                        {formatAdminDateTime(inquiry.createdAt, locale)}
                      </td>
                      <td className="px-3 py-3">
                        <AdminStatusPill tone={inquiry.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            to={to(`admin/inquiries/${inquiry.id}`)}
                            onClick={() =>
                              openInquiry(inquiry.id, inquiry.status)
                            }
                          >
                            {t("admin.common.open")}
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="lg:hidden">
              {filtered.map((inquiry) => (
                <li
                  key={inquiry.id}
                  className="border-b border-wire-rule p-4 last:border-b-0"
                >
                  <Link
                    to={to(`admin/inquiries/${inquiry.id}`)}
                    onClick={() => openInquiry(inquiry.id, inquiry.status)}
                    className="block"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.06em] text-foreground">
                          {inquiry.name}
                        </p>
                        <p className="mt-0.5 truncate text-[9px] text-wire-ink-soft">
                          {inquiry.email}
                        </p>
                      </div>
                      <AdminStatusPill tone={inquiry.status} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-wire-ink-soft">
                      {inquiry.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
                      <span>{t(`contact.form.areas.${inquiry.area}`)}</span>
                      <span>{formatAdminDateTime(inquiry.createdAt, locale)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      <p className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
        <Inbox aria-hidden className="h-3 w-3" strokeWidth={1.5} />
        {t("admin.inquiries.demoNote")}
      </p>
    </>
  );
};

export default AdminInquiriesPage;
