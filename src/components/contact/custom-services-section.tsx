import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppLink as Link } from "@/components/site/app-link";

import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { useLocale } from "@/i18n/routing";

/**
 * Each title is the entry point for that area: catalog pages keep their own
 * route, while custom work opens the briefing form directly.
 */
const serviceAreas = [
  { key: "music", target: "music" },
  { key: "academy", target: "academy" },
  { key: "sounds", target: "sounds" },
  { key: "custom", target: "form" },
  { key: "brands", target: "form" },
] as const;

const serviceItems = ["1", "2", "3"] as const;

export const CustomServicesSection = () => {
  const { t } = useTranslation();
  const { to } = useLocale();

  const briefHref = `${to("contact")}#briefing`;

  return (
    <Section id="services" tone="surface" innerClassName="py-14 md:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel label={t("contact.services.label")} />
          <h2 className="mt-5 max-w-[22ch] text-display-sm font-medium uppercase text-foreground">
            {t("contact.services.title")}
          </h2>
        </div>
        <p className="max-w-[40ch] text-[13px] leading-relaxed text-wire-ink-soft">
          {t("contact.services.lead")}
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {serviceAreas.map((area, index) => {
          const href = area.target === "form" ? briefHref : to(area.target);

          return (
            <li key={area.key} className="flex flex-col border border-wire-rule bg-background p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] text-wire-ink-soft">
                  0{index + 1}
                </span>
                <span aria-hidden className="h-px w-8 bg-wire-rule" />
              </div>

              <Link
                to={href}
                className="group mt-4 inline-flex items-start gap-2 text-[15px] font-medium uppercase leading-snug tracking-[0.06em] text-foreground transition-colors hover:text-wire-ink-soft"
              >
                <span>{t(`contact.services.areas.${area.key}.title`)}</span>
                <ArrowUpRight
                  aria-hidden
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </Link>

              <p className="mt-2 text-[13px] leading-relaxed text-wire-ink-soft">
                {t(`contact.services.areas.${area.key}.text`)}
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-wire-rule pt-4">
                {serviceItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[12.5px] leading-relaxed text-wire-ink-soft"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] h-1 w-1 shrink-0 bg-wire-ink-soft/60"
                    />
                    {t(`contact.services.areas.${area.key}.items.${item}`)}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};
