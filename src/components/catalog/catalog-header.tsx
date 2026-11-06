import { useTranslation } from "react-i18next";

import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import type { CatalogKey } from "@/lib/catalog";

type CatalogHeaderProps = {
  catalog: CatalogKey;
  index: string;
};

export const CatalogHeader = ({ catalog, index }: CatalogHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Section innerClassName="py-12 md:py-16">
      <SectionLabel index={index} label={t(`catalog.${catalog}.label`)} />
      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
        <h1 className="text-display-sm font-medium uppercase text-foreground">
          {t(`catalog.${catalog}.title`)}
        </h1>
        <p className="max-w-[56ch] text-[15px] leading-relaxed text-wire-ink-soft">
          {t(`catalog.${catalog}.lead`)}
        </p>
      </div>
    </Section>
  );
};
