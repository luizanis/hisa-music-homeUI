import { FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AdminRoleSwitcher } from "@/components/admin/admin-role-switcher";

export const AdminPreviewBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="border-b border-wire-rule bg-wire-surface">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-3 px-5 py-2.5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-wire-ink text-foreground">
            <FlaskConical aria-hidden className="h-3 w-3" strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-[8.5px] uppercase tracking-[0.18em] text-foreground">
              {t("admin.preview.prototype")} · {t("admin.preview.demo")}
            </p>
            <p className="mt-0.5 max-w-[86ch] text-[10px] leading-relaxed text-wire-ink-soft">
              {t("admin.preview.banner")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <AdminRoleSwitcher />
          <p className="hidden text-[8.5px] uppercase tracking-[0.14em] text-wire-ink-soft xl:block">
            {t("admin.preview.roleNote")}
          </p>
        </div>
      </div>
    </div>
  );
};
