import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { videos } from "@/data/music";
import { useLocale } from "@/i18n/routing";

export const VideographySection = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const activeLocale = locale === "en" ? "en" : "pt";
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeVideo = videos.find((video) => video.id === activeId) ?? null;

  const scrollBy = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  return (
    <>
      <Section tone="surface" innerClassName="py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index="03" label={t("music.videography.label")} />
            <h2 className="mt-5 text-display-sm font-medium uppercase text-foreground">
              {t("music.videography.title")}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden max-w-[34ch] text-[12px] leading-relaxed text-wire-ink-soft sm:block">
              {t("music.videography.lead")}
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
          {videos.map((video) => (
            <article
              key={video.id}
              className="w-[280px] shrink-0 snap-start sm:w-[340px]"
            >
              <button
                type="button"
                onClick={() => setActiveId(video.id)}
                aria-label={`${t("music.videography.watch")} · ${video.title[activeLocale]}`}
                className="group block w-full text-left"
              >
                <div className="relative aspect-video overflow-hidden border border-wire-rule bg-media">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 p-4 pr-14 text-[clamp(0.95rem,1.5vw,1.25rem)] font-medium uppercase leading-[0.95] tracking-[-0.01em] text-media-foreground"
                  >
                    {video.title[activeLocale].split("·")[0]}
                  </span>
                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-media-line/40 text-media-foreground transition-colors group-hover:bg-media-foreground group-hover:text-media">
                    <Play aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </span>
                </div>
              </button>

              <div className="mt-3 flex items-start justify-between gap-3 border-t border-wire-rule pt-3">
                <h3 className="text-[11px] uppercase leading-snug tracking-[0.1em] text-foreground">
                  {video.title[activeLocale]}
                </h3>
                <span className="font-mono text-[10px] text-wire-ink-soft">
                  {video.year}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Dialog
        open={Boolean(activeVideo)}
        onOpenChange={(open) => {
          if (!open) setActiveId(null);
        }}
      >
        <DialogContent className="max-w-4xl gap-0 overflow-hidden border-media-line/20 bg-media p-0 text-media-foreground sm:rounded-[var(--radius)] [&>button]:text-media-foreground">
          {activeVideo ? (
            <>
              <DialogTitle className="sr-only">
                {activeVideo.title[activeLocale]}
              </DialogTitle>

              {activeVideo.youtubeId ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                    title={activeVideo.title[activeLocale]}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-5 p-8 text-center">
                  <p className="max-w-[42ch] text-[12px] leading-relaxed text-media-soft">
                    {t("music.videography.pending")}
                  </p>
                  <a
                    href={activeVideo.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-media-line/30 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-media-foreground transition-colors hover:bg-media-foreground hover:text-media"
                  >
                    {t("music.videography.openExternal")}
                    <ArrowUpRight
                      aria-hidden
                      className="h-3 w-3"
                      strokeWidth={1.5}
                    />
                  </a>
                </div>
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};
