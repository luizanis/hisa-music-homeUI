import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppLink as Link } from "@/components/site/app-link";

import { serviceItems } from "@/components/site/nav-items";
import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";

export const ServicesSection = () => {
  const { t } = useTranslation();
  const { to } = useLocale();

  return (
    <Section className="border-b-0" innerClassName="py-14 md:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="04" label={t("home.services.label")} />
          <h2 className="mt-5 max-w-[18ch] text-display-sm font-medium uppercase text-foreground">
            {t("home.services.title")}
          </h2>
        </div>
        <p className="max-w-[42ch] text-[13px] leading-relaxed text-wire-ink-soft">
          {t("home.services.lead")}
        </p>
      </div>

      <ul className="mt-10 grid gap-px border border-wire-rule bg-wire-rule sm:grid-cols-3">
        {serviceItems.map((item, index) => (
          <li key={item} className="relative bg-background p-5">
            <span className="font-mono text-[10px] text-wire-ink-soft">
              0{index + 1}
            </span>

            <Link
              to={`${to("contact")}#briefing`}
              aria-label={t("home.services.cta")}
              title={t("home.services.cta")}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center border border-wire-rule text-wire-ink-soft transition-colors hover:border-wire-ink hover:text-foreground"
            >
              <ArrowUpRight aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
            <h3 className="mt-3 text-[12px] uppercase tracking-[0.14em] text-foreground">
              {t(`home.services.items.${item}.title`)}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-wire-ink-soft">
              {t(`home.services.items.${item}.text`)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button asChild size="lg">
          <Link to={to("contact")}>
            {t("home.services.cta")}
            <ArrowUpRight aria-hidden strokeWidth={1.5} />
          </Link>
        </Button>
      </div>
    </Section>
  );
};
