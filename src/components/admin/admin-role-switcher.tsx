import { useTranslation } from "react-i18next";

import { useAdminDemo } from "@/admin/admin-demo-store";
import { cn } from "@/lib/utils";

/**
 * Design-time role switch. This is not authentication and does not claim to be:
 * it only lets the reviewer inspect Owner and Admin interface states.
 */
export const AdminRoleSwitcher = () => {
  const { t } = useTranslation();
  const { role, setRole } = useAdminDemo();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[8.5px] uppercase tracking-[0.18em] text-wire-ink-soft">
        {t("admin.preview.role")}
      </span>
      <div
        role="group"
        aria-label={t("admin.preview.role")}
        className="flex border border-wire-ink bg-background"
      >
        {(["owner", "admin"] as const).map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => setRole(option)}
            aria-pressed={role === option}
            className={cn(
              "h-7 px-2.5 text-[9px] uppercase tracking-[0.14em] transition-colors",
              index > 0 && "border-l border-wire-ink",
              role === option
                ? "bg-primary text-primary-foreground"
                : "text-wire-ink-soft hover:text-foreground",
            )}
          >
            {t(`admin.preview.${option}`)}
          </button>
        ))}
      </div>
    </div>
  );
};
