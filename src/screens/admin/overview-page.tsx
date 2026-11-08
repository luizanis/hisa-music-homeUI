import {
  ArrowRight,
  BarChart3,
  Inbox,
  Package,
  Plus,
  ReceiptText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { adminNavGroups } from "@/admin/admin-nav";
import { useAdminDemo } from "@/admin/admin-demo-store";
import { formatAdminDate } from "@/admin/admin-utils";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";
import { catalogCategories } from "@/lib/catalog";

const AdminOverviewPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { role, products, inquiries } = useAdminDemo();

  const published = products.filter((product) => product.published).length;
  const unpublished = products.length - published;
  const newInquiries = inquiries.filter(
    (inquiry) => inquiry.status === "new",
  ).length;
  const recentInquiries = [...inquiries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  const catalogRows = (["academy", "sounds"] as const).flatMap((catalog) =>
    catalogCategories[catalog].map((category) => {
      const rows = products.filter(
        (product) =>
          product.catalog === catalog && product.category === category,
      );
      return {
        catalog,
        category,
        total: rows.length,
        published: rows.filter((product) => product.published).length,
      };
    }),
  );

  const shortcuts = [
    {
      href: to("admin/products/new"),
      label: t("admin.overview.shortcuts.newProduct"),
      icon: Plus,
    },
    {
      href: to("admin/inquiries"),
      label: t("admin.overview.shortcuts.inbox"),
      icon: Inbox,
    },
    {
      href: to("admin/content/website"),
      label: t("admin.nav.website"),
      icon: BarChart3,
    },
    ...(role === "owner"
      ? [
          {
            href: to("admin/administration/administrators"),
            label: t("admin.overview.shortcuts.admins"),
            icon: ShieldCheck,
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHeader
        label={t("admin.overview.label")}
        title={t("admin.overview.title")}
        description={t("admin.overview.description")}
        actions={
          <>
            <Button asChild>
              <Link to={to("admin/products/new")}>
                <Plus aria-hidden strokeWidth={1.5} />
                {t("admin.products.new")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={to("admin/inquiries")}>
                <Inbox aria-hidden strokeWidth={1.5} />
                {t("admin.inquiries.title")}
              </Link>
            </Button>
          </>
        }
      />

      <p className="mt-3 border-l-2 border-wire-ink bg-wire-surface px-3 py-2 text-[10px] leading-relaxed text-wire-ink-soft">
        {t("admin.overview.demoNote")}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label={t("admin.overview.metric.products")}
          value={products.length}
          icon={Package}
        />
        <AdminMetricCard
          label={t("admin.overview.metric.published")}
          value={published}
          icon={Package}
        />
        <AdminMetricCard
          label={t("admin.overview.metric.unpublished")}
          value={unpublished}
          icon={Package}
        />
        <AdminMetricCard
          label={t("admin.overview.metric.newInquiries")}
          value={newInquiries}
          icon={Inbox}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Panel
          label={t("admin.overview.catalog.title")}
          action={
            <Link
              to={to("admin/products")}
              className="inline-flex items-center gap-1 text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft hover:text-foreground"
            >
              {t("admin.common.viewAll")}
              <ArrowRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          }
          bodyClassName="p-0"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_40px_44px] gap-1.5 border-b border-wire-rule bg-wire-surface/50 px-4 py-2 text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft sm:grid-cols-[minmax(0,1fr)_70px_70px] sm:gap-2">
            <span>{t("admin.overview.catalog.category")}</span>
            <span className="text-right">
              <span className="sm:hidden">{t("admin.overview.catalog.totalShort")}</span>
              <span className="hidden sm:inline">{t("admin.overview.catalog.total")}</span>
            </span>
            <span className="text-right">
              <span className="sm:hidden">
                {t("admin.overview.catalog.publishedShort")}
              </span>
              <span className="hidden sm:inline">
                {t("admin.overview.catalog.published")}
              </span>
            </span>
          </div>
          <ul>
            {catalogRows.map((row) => (
              <li
                key={`${row.catalog}-${row.category}`}
                className="grid grid-cols-[minmax(0,1fr)_40px_44px] items-center gap-1.5 border-b border-wire-rule px-4 py-2.5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_70px_70px] sm:gap-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-[10px] uppercase tracking-[0.08em] text-foreground">
                    {t(`catalog.${row.catalog}.filters.${row.category}`)}
                  </p>
                  <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
                    {t(`catalog.${row.catalog}.label`)}
                  </p>
                </div>
                <span className="text-right font-mono text-[11px] text-foreground">
                  {row.total}
                </span>
                <span className="text-right font-mono text-[11px] text-foreground">
                  {row.published}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          label={t("admin.overview.recent.title")}
          action={
            <Link
              to={to("admin/inquiries")}
              className="inline-flex items-center gap-1 text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft hover:text-foreground"
            >
              {t("admin.common.viewAll")}
              <ArrowRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          }
          bodyClassName="p-0"
        >
          {recentInquiries.length === 0 ? (
            <p className="px-4 py-6 text-[11px] text-wire-ink-soft">
              {t("admin.overview.recent.empty")}
            </p>
          ) : (
            <ul>
              {recentInquiries.map((inquiry) => (
                <li
                  key={inquiry.id}
                  className="border-b border-wire-rule px-4 py-3 last:border-b-0"
                >
                  <Link
                    to={to(`admin/inquiries/${inquiry.id}`)}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11px] uppercase tracking-[0.06em] text-foreground">
                        {inquiry.name}
                      </p>
                      <p className="mt-1 truncate text-[9px] text-wire-ink-soft">
                        {t(`contact.form.areas.${inquiry.area}`)} ·{" "}
                        {formatAdminDate(inquiry.createdAt, locale)}
                      </p>
                    </div>
                    <AdminStatusPill tone={inquiry.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Panel label={t("admin.overview.shortcuts.title")}>
          <div className="grid gap-2 sm:grid-cols-2">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Link
                  key={shortcut.href}
                  to={shortcut.href}
                  className="flex items-center justify-between gap-3 border border-wire-rule bg-background px-3 py-3 transition-colors hover:border-wire-ink-soft/60 hover:bg-accent/40"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Icon
                      aria-hidden
                      className="h-3.5 w-3.5 shrink-0 text-wire-ink-soft"
                      strokeWidth={1.5}
                    />
                    <span className="truncate text-[10px] uppercase tracking-[0.1em] text-foreground">
                      {shortcut.label}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="h-3 w-3 shrink-0 text-wire-ink-soft"
                    strokeWidth={1.5}
                  />
                </Link>
              );
            })}
          </div>
        </Panel>

        <Panel label={t("admin.overview.awaiting.title")}>
          <p className="text-[10px] leading-relaxed text-wire-ink-soft">
            {t("admin.overview.awaiting.text")}
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between gap-3 border border-dashed border-wire-rule bg-wire-surface/40 px-3 py-2">
              <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.1em] text-foreground">
                <ReceiptText aria-hidden className="h-3 w-3" strokeWidth={1.5} />
                {t("admin.overview.metric.revenue")}
              </span>
              <span className="font-mono text-[12px] text-wire-ink-soft">—</span>
            </div>
            <div className="flex items-center justify-between gap-3 border border-dashed border-wire-rule bg-wire-surface/40 px-3 py-2">
              <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.1em] text-foreground">
                <ReceiptText aria-hidden className="h-3 w-3" strokeWidth={1.5} />
                {t("admin.overview.metric.sales")}
              </span>
              <span className="font-mono text-[12px] text-wire-ink-soft">—</span>
            </div>
            <div className="flex items-center justify-between gap-3 border border-dashed border-wire-rule bg-wire-surface/40 px-3 py-2">
              <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.1em] text-foreground">
                <Users aria-hidden className="h-3 w-3" strokeWidth={1.5} />
                {t("admin.overview.metric.students")}
              </span>
              <span className="font-mono text-[12px] text-wire-ink-soft">—</span>
            </div>
          </div>
          <p className="mt-3 text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
            {t("admin.common.notConnected")}
          </p>
        </Panel>
      </div>

      <Panel className="mt-5" label={t("admin.overview.availability.title")}>
        <p className="max-w-[80ch] text-[10px] leading-relaxed text-wire-ink-soft">
          {t("admin.overview.availability.text")}
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {adminNavGroups.flatMap((group) =>
            group.items
              .filter((item) => !(item.ownerOnly && role !== "owner"))
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path ? to(`admin/${item.path}`) : to("admin")}
                    className="flex items-center justify-between gap-3 border border-wire-rule bg-background px-3 py-2.5 transition-colors hover:border-wire-ink-soft/60"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Icon
                        aria-hidden
                        className="h-3.5 w-3.5 shrink-0 text-wire-ink-soft"
                        strokeWidth={1.5}
                      />
                      <span className="truncate text-[9px] uppercase tracking-[0.1em] text-foreground">
                        {t(item.labelKey)}
                      </span>
                    </span>
                    <AdminStatusPill
                      tone={item.planned ? "planned" : item.ownerOnly ? "owner" : "prototype"}
                    />
                  </Link>
                );
              }),
          )}
        </div>
      </Panel>
    </>
  );
};

export default AdminOverviewPage;
