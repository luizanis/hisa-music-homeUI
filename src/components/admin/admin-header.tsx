import { ArrowUpRight, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { useAdminDemo } from "@/admin/admin-demo-store";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { useLocale } from "@/i18n/routing";
import { initials } from "@/admin/admin-utils";

export const AdminHeader = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  const { t } = useTranslation();
  const { to } = useLocale();
  const { role } = useAdminDemo();

  const name =
    role === "owner"
      ? t("admin.preview.identity.owner")
      : t("admin.preview.identity.admin");
  const email =
    role === "owner"
      ? t("admin.preview.email.owner")
      : t("admin.preview.email.admin");

  return (
    <header className="sticky top-0 z-30 border-b border-wire-rule bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-[1480px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={t("admin.menu")}
            className="flex h-8 items-center gap-1.5 border border-wire-rule px-2 text-foreground lg:hidden"
          >
            <Menu aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="text-[8px] uppercase tracking-[0.12em]">
              {t("common.menu")}
            </span>
          </button>
          <div className="min-w-0">
            <p className="truncate text-[9px] uppercase tracking-[0.22em] text-wire-ink-soft">
              {t("admin.area")}
            </p>
            <p className="hidden text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft/70 sm:block">
              {t("admin.brand")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={to("")}
            className="hidden items-center gap-1 text-[8px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-foreground xl:inline-flex"
          >
            <ArrowUpRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
            {t("admin.preview.backToSite")}
          </Link>
          <LocaleSwitcher />
          <div className="flex items-center gap-2 border border-wire-rule bg-background px-2 py-1.5">
            <span className="flex h-6 w-6 items-center justify-center bg-primary font-mono text-[8px] text-primary-foreground">
              {initials(name)}
            </span>
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-[140px] truncate text-[9px] uppercase tracking-[0.1em] text-foreground">
                {name}
              </p>
              <p className="max-w-[140px] truncate text-[8px] text-wire-ink-soft">
                {email}
              </p>
            </div>
            <div className="hidden md:block">
              <AdminStatusPill tone={role} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
