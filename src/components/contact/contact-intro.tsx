import { useTranslation } from "react-i18next";

import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";

export const ContactIntro = () => {
  const { t } = useTranslation();

  return (
    <Section innerClassName="py-12 md:py-16">
      <SectionLabel index="05" label={t("contact.label")} />
      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
        <h1 className="text-display-sm font-medium uppercase text-foreground">
          {t("contact.title")}
        </h1>
        <p className="max-w-[54ch] text-[15px] leading-relaxed text-wire-ink-soft">
          {t("contact.lead")}
        </p>
      </div>
    </Section>
  );
};
