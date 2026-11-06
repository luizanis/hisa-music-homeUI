import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AppLink as Link } from "@/components/site/app-link";

import { Container } from "@/components/site/container";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { mainNav } from "@/components/site/nav-items";
import { useLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const socialChannels = ["Instagram", "YouTube", "TikTok"];
const streamingChannels = ["Spotify", "Apple Music", "Deezer", "SoundCloud"];

type FooterColumnProps = {
  title: string;
  className?: string;
  children: ReactNode;
};

const FooterColumn = ({ title, className, children }: FooterColumnProps) => (
  <div className={className}>
    <h2 className="text-label uppercase text-wire-ink-soft">{title}</h2>
    <ul className="mt-4 space-y-2.5">{children}</ul>
  </div>
);

export const SiteFooter = () => {
  const { t } = useTranslation();
  const { to } = useLocale();

  return (
    <footer className="border-t border-wire-rule bg-background">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              to={to("")}
              className="inline-block text-[17px] font-semibold tracking-[0.34em] text-foreground"
            >
              HISA
            </Link>
            <p className="mt-4 max-w-[240px] text-[13px] leading-relaxed text-wire-ink-soft">
              {t("footer.tagline")}
            </p>
            <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-wire-ink-soft">
              {t("shared.phase")}
            </p>
          </div>

          <FooterColumn
            title={t("footer.navTitle")}
            className="lg:col-span-2"
          >
            {mainNav.map((item) => (
              <li key={item.path}>
                <Link
                  to={to(item.path)}
                  className="text-[12px] uppercase tracking-[0.12em] text-wire-ink-soft transition-colors hover:text-foreground"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn
            title={t("footer.socialTitle")}
            className="lg:col-span-2"
          >
            {socialChannels.map((channel) => (
              <li
                key={channel}
                className="flex items-center gap-2 text-[12px] text-wire-ink-soft"
              >
                <span aria-hidden className="h-px w-3 bg-wire-rule" />
                {channel}
              </li>
            ))}
          </FooterColumn>

          <FooterColumn
            title={t("footer.listenTitle")}
            className="lg:col-span-2"
          >
            {streamingChannels.map((channel) => (
              <li
                key={channel}
                className="flex items-center gap-2 text-[12px] text-wire-ink-soft"
              >
                <span aria-hidden className="h-px w-3 bg-wire-rule" />
                {channel}
              </li>
            ))}
          </FooterColumn>

          <FooterColumn
            title={t("footer.contactTitle")}
            className="lg:col-span-2"
          >
            <li className="text-[12px] text-foreground">
              {t("footer.contactEmail")}
            </li>
            <li className="text-[11px] leading-relaxed text-wire-ink-soft">
              {t("footer.contactNote")}
            </li>
            <li>
              <Link
                to={to("contact")}
                className={cn(
                  "text-[11px] uppercase tracking-[0.14em] text-foreground underline decoration-wire-rule underline-offset-4",
                  "transition-colors hover:decoration-foreground",
                )}
              >
                {t("shared.workWithHisa")}
              </Link>
            </li>
          </FooterColumn>
        </div>
      </Container>

      <div className="border-t border-wire-rule">
        <Container className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
              {t("shared.placeholderNote")}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
                {t("footer.localeTitle")}
              </span>
              <LocaleSwitcher />
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
