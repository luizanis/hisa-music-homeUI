import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";

type AdminRestrictedProps = {
  titleKey?: string;
  textKey?: string;
};

export const AdminRestricted = ({
  titleKey = "admin.restricted.title",
  textKey = "admin.restricted.text",
}: AdminRestrictedProps) => {
  const { t } = useTranslation();
  const { to } = useLocale();

  return (
    <div className="flex flex-col items-center border border-dashed border-wire-rule bg-wire-surface/40 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center border border-wire-rule bg-background text-wire-ink-soft">
        <LockKeyhole aria-hidden className="h-5 w-5" strokeWidth={1.25} />
      </span>
      <h1 className="mt-5 text-[14px] uppercase tracking-[0.12em] text-foreground">
        {t(titleKey)}
      </h1>
      <p className="mt-2 max-w-[52ch] text-[12px] leading-relaxed text-wire-ink-soft">
        {t(textKey)}
      </p>
      <Button asChild variant="outline" className="mt-6">
        <Link to={to("admin")}>
          <ArrowLeft aria-hidden strokeWidth={1.5} />
          {t("admin.restricted.back")}
        </Link>
      </Button>
    </div>
  );
};
