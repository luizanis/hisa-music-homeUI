import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { epkHref, pressPhotos } from "@/data/music";

export const PressSection = () => {
  const { t } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: direction * 380, behavior: "smooth" });
  };

  return (
    <Section tone="surface" innerClassName="py-14 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel index="05" label={t("music.press.label")} />
          <h2 className="mt-5 text-display font-medium uppercase text-foreground">
            {t("music.press.title")}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <p className="hidden max-w-[38ch] text-[12px] leading-relaxed text-wire-ink-soft sm:block">
            {t("music.press.lead")}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label={t("music.videography.prev")}
              className="flex h-9 w-9 items-center justify-center border border-wire-rule bg-background text-foreground transition-colors hover:border-wire-ink hover:bg-accent"
            >
              <ChevronLeft aria-hidden className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label={t("music.videography.next")}
              className="flex h-9 w-9 items-center justify-center border border-wire-rule bg-background text-foreground transition-colors hover:border-wire-ink hover:bg-accent"
            >
              <ChevronRight aria-hidden className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pressPhotos.map((photo) => (
          <figure
            key={photo.id}
            className="w-[300px] shrink-0 snap-start border border-wire-rule bg-background sm:w-[380px]"
          >
            <img
              src={photo.src}
              alt={`${t("music.press.alt")} ${photo.id}`}
              width={2222}
              height={1482}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
            />
            <figcaption className="flex items-center justify-between gap-3 border-t border-wire-rule px-3 py-2">
              <span className="text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
                {photo.label}
              </span>
              <a
                href={photo.src}
                download={photo.filename}
                aria-label={t("music.press.download")}
                title={t("music.press.download")}
                className="flex h-7 w-7 items-center justify-center border border-wire-rule text-wire-ink-soft transition-colors hover:border-wire-ink hover:text-foreground"
              >
                <Download aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 border border-wire-rule bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-foreground">
            {t("music.press.epkTitle")}
          </p>
          <p className="mt-1 max-w-[46ch] text-[11px] leading-relaxed text-wire-ink-soft">
            {t("music.press.epkNote")}
          </p>
        </div>
        <Button asChild size="lg" variant="outline">
          <a href={epkHref} download>
            {t("music.press.epk")}
            <Download aria-hidden strokeWidth={1.5} />
          </a>
        </Button>
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
        {t("music.press.note")}
      </p>
    </Section>
  );
};
