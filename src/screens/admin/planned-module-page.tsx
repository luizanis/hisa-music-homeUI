import {
  ArrowLeft,
  Clock3,
  Database,
  Languages,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { adminNavItems } from "@/admin/admin-nav";
import { adminPlannedModules } from "@/admin/admin-modules";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";

export const AdminPlannedPage = ({ moduleId }: { moduleId: string }) => {
  const { t } = useTranslation();
  const { to } = useLocale();

  const navItem = adminNavItems.find((item) => item.id === moduleId);
  const moduleConfig = adminPlannedModules[moduleId];

  if (!navItem || !moduleConfig) {
    return (
      <PageHeader
        label={t("admin.planned.label")}
        title={t("admin.notFound.title")}
        description={t("admin.notFound.text")}
      />
    );
  }

  const Icon = navItem.icon;
  const capabilities = [
    ...moduleConfig.scopeKeys.map((key) => t(key)),
    t("admin.planned.capability.permissions"),
    t("admin.planned.capability.localization"),
  ];
  const dependencies = [
    t("admin.planned.dependency.data"),
    t("admin.planned.dependency.security"),
    t("admin.planned.dependency.integration"),
  ];

  return (
    <>
      <PageHeader
        label={t("admin.planned.label")}
        title={t(navItem.labelKey)}
        description={t(moduleConfig.descriptionKey)}
        actions={
          <>
            <AdminStatusPill tone="planned" />
            <Button asChild variant="outline">
              <Link to={to("admin")}>
                <ArrowLeft aria-hidden strokeWidth={1.5} />
                {t("admin.planned.back")}
              </Link>
            </Button>
          </>
        }
      />

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-5">
          <Panel label={t("admin.planned.capabilities")}>
            <ul className="space-y-3">
              {capabilities.map((capability) => (
                <li
                  key={capability}
                  className="flex items-start gap-2.5 text-[11px] leading-relaxed text-wire-ink-soft"
                >
                  <span
                    aria-hidden
                    className="mt-[6px] h-1 w-1 shrink-0 bg-wire-ink-soft"
                  />
                  {capability}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel label={t("admin.planned.dependencies")}>
            <ul className="space-y-3">
              {dependencies.map((dependency, index) => {
                const DependencyIcon =
                  index === 0 ? Database : index === 1 ? ShieldCheck : Languages;
                return (
                  <li
                    key={dependency}
                    className="flex items-start gap-2.5 text-[11px] leading-relaxed text-wire-ink-soft"
                  >
                    <DependencyIcon
                      aria-hidden
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wire-ink-soft"
                      strokeWidth={1.5}
                    />
                    {dependency}
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel label={t("admin.planned.statusLabel")}>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-wire-rule bg-wire-surface">
                <Clock3
                  aria-hidden
                  className="h-4 w-4 text-wire-ink-soft"
                  strokeWidth={1.5}
                />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-foreground">
                  {t("admin.planned.statusTitle")}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-wire-ink-soft">
                  {t("admin.planned.statusText")}
                </p>
              </div>
            </div>
          </Panel>

          <div className="flex flex-col items-center justify-center border border-dashed border-wire-rule bg-wire-surface/40 px-6 py-12 text-center">
            <span className="flex h-11 w-11 items-center justify-center border border-wire-rule bg-background text-wire-ink-soft">
              <Icon aria-hidden className="h-5 w-5" strokeWidth={1.25} />
            </span>
            <p className="mt-4 text-[10px] uppercase tracking-[0.12em] text-foreground">
              {t("admin.planned.placeholder")}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
              {t("admin.planned.notConnected")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
