import { ArrowLeft } from "lucide-react";
import { I18nextProvider, useTranslation } from "react-i18next";

import { AppLink as Link } from "@/components/site/app-link";
import { Container } from "@/components/site/container";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/i18n/config";
import { useLocale } from "@/i18n/routing";

const NotFoundContent = () => {
  const { t } = useTranslation();
  const { to } = useLocale();

  return (
    <Container className="py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-wire-ink-soft">
        404
      </p>
      <h1 className="mt-6 max-w-[20ch] text-display-sm font-medium uppercase text-foreground">
        {t("notFound.title")}
      </h1>
      <p className="mt-5 max-w-[46ch] text-[14px] leading-relaxed text-wire-ink-soft">
        {t("notFound.description")}
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-4">
        <Button asChild size="lg">
          <Link to={to("")}>
            <ArrowLeft aria-hidden strokeWidth={1.5} />
            {t("notFound.action")}
          </Link>
        </Button>
        <LocaleSwitcher size="md" />
      </div>
    </Container>
  );
};

/** Works both inside the locale layout and at the root (no locale prefix). */
export const NotFoundPage = () => {
  const { locale } = useLocale();
  return (
    <I18nextProvider i18n={getI18n(locale)}>
      <NotFoundContent />
    </I18nextProvider>
  );
};
