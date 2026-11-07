import { useTranslation } from "react-i18next";

import { Container } from "@/components/site/container";
import { SectionLabel } from "@/components/site/section-label";

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative isolate overflow-hidden border-b border-wire-rule bg-media text-media-foreground">
      {/* Artwork layer: replaced by the final hero image/cover when available. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[12%] -top-[30%] h-[170%] w-[75%] rotate-[-10deg] border border-media-line/10" />
        <div className="absolute right-[6%] top-[12%] hidden h-[76%] w-[36%] border border-media-line/10 md:block" />
        <span className="absolute -bottom-[10%] -right-[2%] select-none text-[26vw] font-medium leading-none tracking-[-0.06em] text-media-foreground/[0.06]">
          HISA
        </span>
        <div className="absolute inset-0 bg-linear-to-r from-media via-media/90 to-media/40" />
      </div>

      <Container className="relative">
        <div className="flex min-h-[520px] flex-col justify-center py-16 md:min-h-[600px] md:py-20">
          <SectionLabel
            index="00"
            label={t("home.hero.eyebrow")}
            tone="dark"
          />

          <h1 className="mt-7 max-w-[18ch] text-display font-medium uppercase text-media-foreground">
            {t("home.hero.title")}
          </h1>

          <p className="mt-7 max-w-[26ch] text-display-sm font-medium uppercase leading-[1.05] text-media-foreground/90">
            {t("home.hero.description")}
          </p>

          <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-media-soft">
            <span aria-hidden className="h-px w-10 bg-media-line/40" />
            ALL RIGHTS RESERVED · 2026
          </div>
        </div>
      </Container>
    </section>
  );
};
