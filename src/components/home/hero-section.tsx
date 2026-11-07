import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Crosshair,
  PixelIcon,
  TechTag,
  Waveform,
} from "@/components/home/portal-ornaments";
import { AppLink as Link } from "@/components/site/app-link";
import { Container } from "@/components/site/container";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";

export const HeroSection = () => {
  const { t } = useTranslation();
  const { to } = useLocale();

  return (
    <section className="relative isolate overflow-hidden border-b border-wire-rule">
      {/* Backdrop: floating gridlines and a retro floor grid. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 portal-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute -bottom-10 left-[-25%] h-[45%] w-[150%] portal-floor opacity-40" />
        <span className="absolute -bottom-[6%] -right-[2%] select-none font-display text-[22vw] leading-none text-foreground/[0.03]">
          HISA
        </span>
      </div>

      <Crosshair className="left-4 top-6 md:left-8" />
      <Crosshair className="right-4 top-6 md:right-8" />
      <Crosshair className="bottom-6 left-4 md:left-8" />
      <Crosshair className="bottom-6 right-4 md:right-8" />

      <Container className="relative">
        <div className="grid min-h-[560px] items-center gap-12 py-16 md:min-h-[640px] md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <TechTag>
                <span className="h-1.5 w-1.5 bg-neon motion-safe:animate-blink" />
                {"[SYS_STATUS: ONLINE]"}
              </TechTag>
              <TechTag className="hidden sm:inline-flex">{"> LOADING_DAW... 99%"}</TechTag>
            </div>

            <SectionLabel
              index="00"
              label={t("home.hero.eyebrow")}
              tone="dark"
              className="mt-8"
            />

            <h1 className="mt-6 font-display text-[clamp(3.5rem,11vw,8.5rem)] font-bold uppercase leading-[0.9] tracking-[0.04em] text-foreground text-glow">
              {t("home.hero.title")}
            </h1>

            <p className="mt-7 max-w-[26ch] text-display-sm font-medium uppercase leading-[1.05] text-foreground/90">
              {t("home.hero.description")}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="neon">
                <a href="#ecosystem">
                  {t("home.hero.ctaPrimary")}
                  <ArrowDownRight aria-hidden strokeWidth={1.5} />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={to("academy")}>
                  {t("home.hero.ctaSecondary")}
                  <ArrowUpRight aria-hidden strokeWidth={1.5} />
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-wire-ink-soft">
              <span aria-hidden className="h-px w-10 bg-neon/60" />
              ALL RIGHTS RESERVED · 2026
            </div>
          </div>

          <HeroDeck label={t("home.hero.visualLabel")} note={t("home.hero.visualNote")} />
        </div>
      </Container>
    </section>
  );
};

/**
 * Frame for the main artwork (the cyberdeck). Until the final image arrives
 * it shows a stylised DAW screen; swap the inner screen for the <img>.
 */
const HeroDeck = ({ label, note }: { label: string; note: string }) => (
  <div className="relative md:col-span-5">
    <div aria-hidden className="absolute -inset-8 -z-10 bg-neon/15 blur-3xl" />

    <div className="relative glass-panel shadow-glow motion-safe:animate-float">
      <div className="flex items-center justify-between border-b border-neon/25 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-wire-ink-soft">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 bg-neon" />
          HISA_DECK.exe
        </span>
        <span aria-hidden className="flex gap-1">
          <span className="h-2 w-2 border border-wire-ink-soft/60" />
          <span className="h-2 w-2 border border-wire-ink-soft/60" />
          <span className="h-2 w-2 bg-wire-ink-soft/60" />
        </span>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden">
        <div aria-hidden className="absolute inset-0 portal-grid" />
        <div aria-hidden className="absolute inset-0 portal-scanlines" />

        {/* Mock DAW tracks */}
        <div aria-hidden className="absolute inset-x-4 top-5 space-y-3">
          {[22, 16, 28, 12].map((bars, index) => (
            <div key={index} className="group flex items-center gap-3">
              <span className="w-10 font-mono text-[9px] text-wire-ink-soft">
                TR_0{index + 1}
              </span>
              <div className="flex-1 border border-neon/20 bg-neon/5 px-2 py-1">
                <Waveform bars={bars} active={index === 0} className="h-5" />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-4 bottom-4 flex flex-col items-center gap-2 border border-dashed border-neon/40 bg-card px-4 py-6 text-center backdrop-blur-sm">
          <PixelIcon name="cd" className="h-6 text-neon" />
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
            {label}
          </p>
          <p className="font-mono text-[10px] text-wire-ink-soft">{note}</p>
        </div>

        <Crosshair className="left-2 top-2" />
        <Crosshair className="right-2 top-2" />
      </div>
    </div>

    <TechTag className="absolute -left-3 top-[38%] hidden lg:inline-flex">
      {"[.WAV / 24-BIT 96KHZ]"}
    </TechTag>
    <TechTag className="absolute -right-2 -top-4 hidden sm:inline-flex">
      {"SYS_TIME 00:26:01"}
    </TechTag>
    <PixelIcon
      name="heart"
      className="absolute -left-8 -top-6 h-6 text-neon motion-safe:animate-float"
    />
    <PixelIcon
      name="floppy"
      className="absolute -bottom-6 -right-4 h-7 text-foreground/80 motion-safe:animate-float [animation-delay:1.5s]"
    />
  </div>
);
