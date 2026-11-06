import { useTranslation } from "react-i18next";

import { manifestoPrinciples } from "@/components/site/nav-items";
import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";

export const ManifestoSection = () => {
  const { t } = useTranslation();

  return (
    <Section innerClassName="py-14 md:py-20">
      <SectionLabel index="02" label={t("home.manifesto.label")} />

      <h2 className="mt-5 max-w-[26ch] text-display-sm font-medium uppercase text-foreground">
        {t("home.manifesto.title")}
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-10">
        <p className="max-w-[60ch] text-[14px] leading-relaxed text-wire-ink-soft">
          {t("home.manifesto.body1")}
        </p>
        <p className="max-w-[60ch] text-[14px] leading-relaxed text-wire-ink-soft">
          {t("home.manifesto.body2")}
        </p>
      </div>

      <ul className="mt-10 grid gap-px border border-wire-rule bg-wire-rule sm:grid-cols-2">
        {manifestoPrinciples.map((principle, index) => (
          <li key={principle} className="bg-background p-5">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] text-wire-ink-soft">
                0{index + 1}
              </span>
              <h3 className="text-[12px] uppercase tracking-[0.14em] text-foreground">
                {t(`home.manifesto.principles.${principle}.title`)}
              </h3>
            </div>
            <p className="mt-2 pl-[26px] text-[13px] leading-relaxed text-wire-ink-soft">
              {t(`home.manifesto.principles.${principle}.text`)}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
};
