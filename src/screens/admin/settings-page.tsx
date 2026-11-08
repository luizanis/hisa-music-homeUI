import {
  CreditCard,
  Globe2,
  HardDrive,
  Mail,
  ServerCog,
  Video,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";

const integrations = [
  {
    key: "payments",
    icon: CreditCard,
    noteKey: "admin.settings.integration.paymentsNote",
  },
  {
    key: "email",
    icon: Mail,
    noteKey: "admin.settings.integration.emailNote",
  },
  {
    key: "storage",
    icon: HardDrive,
    noteKey: "admin.settings.integration.storageNote",
  },
  {
    key: "video",
    icon: Video,
    noteKey: "admin.settings.integration.videoNote",
  },
  {
    key: "domain",
    icon: Globe2,
    noteKey: "admin.settings.integration.domainNote",
  },
] as const;

const AdminSettingsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        label={t("admin.settings.label")}
        title={t("admin.settings.title")}
        description={t("admin.settings.description")}
        actions={<AdminStatusPill tone="planned" />}
      />

      <div className="mt-3 flex flex-col gap-2 border-l-2 border-wire-ink bg-wire-surface px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-relaxed text-wire-ink-soft">
          {t("admin.settings.note")}
        </p>
        <p className="shrink-0 text-[8px] uppercase tracking-[0.12em] text-wire-ink-soft">
          {t("admin.common.notConnected")}
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div
              key={integration.key}
              className="flex min-h-[150px] flex-col justify-between border border-dashed border-wire-rule bg-wire-surface/30 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-8 w-8 items-center justify-center border border-wire-rule bg-background text-wire-ink-soft">
                  <Icon aria-hidden className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <AdminStatusPill tone="planned" />
              </div>
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-[0.1em] text-foreground">
                  {t(`admin.settings.integration.${integration.key}`)}
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-wire-ink-soft">
                  {t(integration.noteKey)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Panel className="mt-5" label={t("admin.settings.platform")}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border border-wire-rule bg-background p-3">
            <p className="text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft">
              {t("admin.settings.platform.auth")}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-foreground">
              {t("admin.settings.platform.authValue")}
            </p>
          </div>
          <div className="border border-wire-rule bg-background p-3">
            <p className="text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft">
              {t("admin.settings.platform.database")}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-foreground">
              {t("admin.settings.platform.databaseValue")}
            </p>
          </div>
          <div className="border border-wire-rule bg-background p-3">
            <p className="text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft">
              {t("admin.settings.platform.prototype")}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-foreground">
              {t("admin.settings.platform.prototypeValue")}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 border-t border-wire-rule pt-3">
          <ServerCog
            aria-hidden
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wire-ink-soft"
            strokeWidth={1.5}
          />
          <p className="text-[9px] leading-relaxed text-wire-ink-soft">
            {t("admin.settings.phaseNote")}
          </p>
        </div>
      </Panel>
    </>
  );
};

export default AdminSettingsPage;
