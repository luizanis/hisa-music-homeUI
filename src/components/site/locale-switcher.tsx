import { useTranslation } from "react-i18next";
import { useLocation } from "@tanstack/react-router";

import { AppLink as Link } from "@/components/site/app-link";
import { languageOptions } from "@/i18n/config";
import { useLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  className?: string;
  size?: "sm" | "md";
};

/**
 * Locale toggle that swaps only the URL prefix, so the visitor stays on the
 * equivalent page in the other language (/pt/academy <-> /en/academy).
 */
export const LocaleSwitcher = ({
  className,
  size = "sm",
}: LocaleSwitcherProps) => {
  const { t } = useTranslation();
  const { pathname, searchStr } = useLocation();
  const { locale } = useLocale();

  const pathFor = (code: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const rest = segments.slice(1).join("/");
    return `${rest ? `/${code}/${rest}` : `/${code}`}${searchStr}`;
  };

  return (
    <div
      role="group"
      aria-label={t("common.language")}
      className={cn(
        "flex items-center border border-wire-rule bg-background",
        className,
      )}
    >
      {languageOptions.map((language, position) => {
        const isActive = language.value === locale;
        return (
          <Link
            key={language.value}
            to={pathFor(language.value)}
            hrefLang={language.value}
            lang={language.value}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "flex items-center justify-center uppercase tracking-[0.16em] transition-colors",
              size === "sm" ? "h-8 px-2.5 text-[10px]" : "h-10 px-3.5 text-[11px]",
              position > 0 && "border-l border-wire-rule",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-wire-ink-soft hover:bg-accent hover:text-foreground",
            )}
          >
            {language.short}
          </Link>
        );
      })}
    </div>
  );
};
