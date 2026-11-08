import { History, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAdminDemo } from "@/admin/admin-demo-store";
import { formatAdminDateTime } from "@/admin/admin-utils";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/i18n/routing";

type GroupFilter = "all" | "product" | "inquiry" | "administrator";

const AdminActivityPage = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { role, activity } = useAdminDemo();
  const [group, setGroup] = useState<GroupFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return activity.filter((entry) => {
      if (group !== "all" && !entry.actionKey.includes(`action.${group}`)) {
        return false;
      }
      if (!term) return true;
      return `${entry.actor} ${entry.target} ${t(entry.actionKey)}`
        .toLowerCase()
        .includes(term);
    });
  }, [activity, group, search, t]);

  if (role !== "owner") {
    return (
      <>
        <PageHeader
          label={t("admin.activity.label")}
          title={t("admin.activity.title")}
          description={t("admin.activity.description")}
        />
        <div className="mt-6">
          <AdminRestricted
            titleKey="admin.activity.restricted.title"
            textKey="admin.activity.restricted.text"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        label={t("admin.activity.label")}
        title={t("admin.activity.title")}
        description={t("admin.activity.description")}
        actions={
          <span className="inline-flex items-center gap-1.5 border border-dashed border-wire-rule px-2 py-1 text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft">
            <History aria-hidden className="h-3 w-3" strokeWidth={1.5} />
            {t("admin.activity.readOnly")}
          </span>
        }
      />

      <div className="mt-3 flex flex-col gap-2 border-l-2 border-wire-ink bg-wire-surface px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-relaxed text-wire-ink-soft">
          {t("admin.activity.demoNote")}
        </p>
        <p className="shrink-0 text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
          {t("admin.activity.readOnly")}
        </p>
      </div>

      <Panel className="mt-5" bodyClassName="p-0">
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
              placeholder={t("admin.activity.searchPlaceholder")}
              aria-label={t("admin.common.search")}
              className="h-9 rounded-[var(--radius)] border-wire-rule pl-9 text-[11px]"
            />
          </div>
          <select
            value={group}
            onChange={(event) => setGroup(event.target.value as GroupFilter)}
            aria-label={t("admin.activity.filterAction")}
            className="h-9 w-full border border-wire-rule bg-background px-2 text-[9px] uppercase tracking-[0.1em] text-foreground"
          >
            <option value="all">{t("admin.activity.allActions")}</option>
            <option value="product">{t("admin.activity.filterProducts")}</option>
            <option value="inquiry">{t("admin.activity.filterInquiries")}</option>
            <option value="administrator">
              {t("admin.activity.filterAdmins")}
            </option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={SearchX}
              title={t("admin.activity.empty.title")}
              text={t("admin.activity.empty.text")}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setGroup("all");
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
                      {t("admin.activity.table.when")}
                    </th>
                    <th className="px-3 py-2.5 font-normal">
                      {t("admin.activity.table.actor")}
                    </th>
                    <th className="px-3 py-2.5 font-normal">
                      {t("admin.activity.table.action")}
                    </th>
                    <th className="px-4 py-2.5 font-normal">
                      {t("admin.activity.table.target")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-wire-rule last:border-b-0"
                    >
                      <td className="px-4 py-3 text-[9px] text-wire-ink-soft">
                        {formatAdminDateTime(entry.createdAt, locale)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-[0.08em] text-foreground">
                            {entry.actor}
                          </span>
                          <AdminStatusPill tone={entry.actorRole} />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[10px] text-foreground">
                        {t(entry.actionKey)}
                      </td>
                      <td className="px-4 py-3 font-mono text-[9px] text-wire-ink-soft">
                        {entry.target}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="lg:hidden">
              {filtered.map((entry) => (
                <li
                  key={entry.id}
                  className="border-b border-wire-rule p-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[10px] text-foreground">
                      {t(entry.actionKey)}
                    </p>
                    <AdminStatusPill tone={entry.actorRole} />
                  </div>
                  <p className="mt-1 font-mono text-[9px] text-wire-ink-soft">
                    {entry.target}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
                    <span>{entry.actor}</span>
                    <span>{formatAdminDateTime(entry.createdAt, locale)}</span>
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

export default AdminActivityPage;
