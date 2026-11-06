import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppLink as Link } from "@/components/site/app-link";

import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { shows } from "@/data/music";
import { useLocale } from "@/i18n/routing";

const formatShowDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(`${iso}T12:00:00`))
    .replace(".", "")
    .toUpperCase();

export const ShowsSection = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const activeLocale = locale === "en" ? "en" : "pt";

  return (
    <Section innerClassName="py-14 md:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="04" label={t("music.shows.label")} />
          <h2 className="mt-5 text-display-sm font-medium uppercase text-foreground">
            {t("music.shows.title")}
          </h2>
        </div>
        <p className="max-w-[36ch] text-[13px] leading-relaxed text-wire-ink-soft">
          {t("music.shows.lead")}
        </p>
      </div>

      <ul className="mt-10 border-t border-wire-rule">
        {shows.map((show) => (
          <li
            key={show.id}
            className="grid items-center gap-3 border-b border-wire-rule py-4 sm:grid-cols-[140px_1fr_auto] sm:gap-6"
          >
            <span className="font-mono text-[11px] tracking-[0.08em] text-foreground">
              {formatShowDate(show.date, locale)}
            </span>

            <div>
              <p className="text-[12px] uppercase tracking-[0.12em] text-foreground">
                {show.city[activeLocale]}
              </p>
              <p className="mt-1 text-[12px] text-wire-ink-soft">
                {show.venue}
              </p>
            </div>

            <a
              href={show.ticketsHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 border border-wire-ink px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {t("music.shows.tickets")}
              <ArrowUpRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center border border-wire-rule bg-wire-surface p-6">
        <Button asChild size="lg">
          <Link to={`${to("contact")}?area=show`}>
            {t("music.shows.cta")}
            <ArrowUpRight aria-hidden strokeWidth={1.5} />
          </Link>
        </Button>
      </div>
    </Section>
  );
};
