import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AlbumCover } from "@/components/music/album-cover";
import { Container } from "@/components/site/container";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { latestRelease } from "@/data/music";
import { useLocale } from "@/i18n/routing";

export const LatestReleaseSection = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const activeLocale = locale === "en" ? "en" : "pt";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden border-b border-wire-rule bg-media text-media-foreground">
        <Container className="relative py-14 md:py-20">
          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
              <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-media-soft">
                <span aria-hidden className="h-1.5 w-1.5 bg-media-foreground" />
                01 / {t("music.latest.label")}
              </p>

              <h2 className="mt-6 max-w-[16ch] text-display font-medium uppercase">
                {latestRelease.title}
              </h2>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-media-soft">
                {latestRelease.year} · {latestRelease.type[activeLocale]}
              </p>

              <p className="mt-6 max-w-[46ch] text-[13px] leading-relaxed text-media-soft">
                {latestRelease.description[activeLocale]}
              </p>

              <div className="mt-8 border-t border-media-line/15 pt-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-media-soft">
                  {t("music.latest.listen")}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {latestRelease.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border border-media-line/25 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-media-foreground transition-colors hover:bg-media-foreground hover:text-media"
                      >
                        {link.label}
                        <ArrowUpRight
                          aria-hidden
                          className="h-3 w-3"
                          strokeWidth={1.5}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label={`${t("music.discography.listen")} · ${latestRelease.title}`}
                className="group w-full max-w-[420px] text-left"
              >
                <AlbumCover
                  album={latestRelease}
                  className="aspect-square w-full transition-opacity group-hover:opacity-90"
                />
                <span className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-media-soft transition-colors group-hover:text-media-foreground">
                  {t("music.discography.listen")}
                  <ArrowUpRight
                    aria-hidden
                    className="h-3.5 w-3.5"
                    strokeWidth={1.5}
                  />
                </span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg gap-0 border-media-line/20 bg-media p-6 text-media-foreground sm:rounded-[var(--radius)] [&>button]:text-media-foreground">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-media-soft">
            {latestRelease.year} · {latestRelease.type[activeLocale]}
          </p>
          <DialogTitle className="mt-3 text-[20px] font-medium uppercase leading-tight">
            {latestRelease.title}
          </DialogTitle>
          <p className="mt-3 text-[12px] leading-relaxed text-media-soft">
            {latestRelease.description[activeLocale]}
          </p>

          <div className="mt-5 border-t border-media-line/15 pt-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-media-soft">
              {t("music.latest.listen")}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {latestRelease.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-media-line/25 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-media-foreground transition-colors hover:bg-media-foreground hover:text-media"
                  >
                    {link.label}
                    <ArrowUpRight
                      aria-hidden
                      className="h-3 w-3"
                      strokeWidth={1.5}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
