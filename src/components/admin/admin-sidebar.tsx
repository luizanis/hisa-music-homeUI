import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "@/lib/router-compat";

import { adminNavGroups } from "@/admin/admin-nav";
import { useAdminDemo } from "@/admin/admin-demo-store";
import { useLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export const AdminSidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { t } = useTranslation();
  const { to } = useLocale();
  const { role } = useAdminDemo();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-wire-rule px-5 py-5">
        <Link
          to={to("admin")}
          onClick={onNavigate}
          className="inline-flex flex-col gap-1"
        >
          <span className="text-[17px] font-semibold leading-none tracking-[0.34em] text-foreground">
            HISA
          </span>
          <span className="text-[8px] uppercase tracking-[0.24em] text-wire-ink-soft">
            {t("admin.brand")}
          </span>
        </Link>
        <p className="mt-3 text-[8px] uppercase tracking-[0.16em] text-wire-ink-soft">
          {t("admin.area")}
        </p>
      </div>

      <nav
        aria-label={t("admin.menu")}
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        {adminNavGroups.map((group) => {
          const items = group.items.filter(
            (item) => !(item.ownerOnly && role !== "owner"),
          );
          if (items.length === 0) return null;

          return (
            <div key={group.id} className="mb-5">
              <p className="px-2 text-[8px] uppercase tracking-[0.22em] text-wire-ink-soft/80">
                {t(group.labelKey)}
              </p>
              <ul className="mt-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  const href = item.path ? to(`admin/${item.path}`) : to("admin");
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={href}
                        end={!item.path}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2.5 border-l-2 py-2.5 pl-2.5 pr-2 text-[10px] uppercase tracking-[0.1em] transition-colors",
                            isActive
                              ? "border-l-foreground bg-wire-surface text-foreground"
                              : "border-l-transparent text-wire-ink-soft hover:bg-accent/60 hover:text-foreground",
                          )
                        }
                      >
                        <Icon
                          aria-hidden
                          className="h-3.5 w-3.5 shrink-0"
                          strokeWidth={1.5}
                        />
                        <span className="min-w-0 flex-1 leading-snug">
                          {t(item.labelKey)}
                        </span>
                        {item.planned ? (
                          <span className="shrink-0 border border-dashed border-wire-rule px-1 py-0.5 text-[6.5px] uppercase tracking-[0.12em] text-wire-ink-soft">
                            {t("admin.preview.planned")}
                          </span>
                        ) : item.ownerOnly ? (
                          <span className="shrink-0 text-[6.5px] uppercase tracking-[0.12em] text-wire-ink-soft">
                            {t("admin.preview.ownerOnly")}
                          </span>
                        ) : null}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-wire-rule px-5 py-4">
        <p className="text-[8px] leading-relaxed text-wire-ink-soft">
          {t("admin.preview.demoNote")}
        </p>
        <Link
          to={to("")}
          onClick={onNavigate}
          className="mt-3 inline-flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-foreground"
        >
          <ArrowUpRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
          {t("admin.preview.backToSite")}
        </Link>
      </div>
    </div>
  );
};
