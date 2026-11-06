import { useTranslation } from "react-i18next";

import { ArrowLink } from "@/components/site/arrow-link";
import { ecosystemAreas } from "@/components/site/nav-items";
import { PlaceholderFrame } from "@/components/site/placeholder-frame";
import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { useLocale } from "@/i18n/routing";

export const EcosystemSection = () => {
  const { t } = useTranslation();
  const { to } = useLocale();

  return (
    <Section id="ecosystem" tone="surface" innerClassName="py-14 md:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="03" label={t("home.ecosystem.label")} />
          <h2 className="mt-5 text-display-sm font-medium uppercase text-foreground">
            {t("home.ecosystem.title")}
          </h2>
        </div>
        <p className="max-w-[38ch] text-[13px] leading-relaxed text-wire-ink-soft">
          {t("home.ecosystem.lead")}
        </p>
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {ecosystemAreas.map((area, index) => (
          <li
            key={area}
            className="flex flex-col border border-wire-rule bg-background"
          >
            <PlaceholderFrame
              label={t(`home.ecosystem.${area}.visual`)}
              className="aspect-[16/10] w-full border-0 border-b border-dashed"
            />

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] text-wire-ink-soft">
                  0{index + 1}
                </span>
                <span className="border border-wire-rule px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
                  {t(`home.ecosystem.${area}.tag`)}
                </span>
              </div>

              <h3 className="mt-5 text-[17px] font-medium uppercase tracking-[0.06em] text-foreground">
                {t(`home.ecosystem.${area}.title`)}
              </h3>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-wire-ink-soft">
                {t(`home.ecosystem.${area}.description`)}
              </p>

              <ArrowLink to={to(area)} className="mt-6 self-start">
                {t(`home.ecosystem.${area}.link`)}
              </ArrowLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
};
