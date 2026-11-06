import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AlbumCover } from "@/components/music/album-cover";
import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { albums } from "@/data/music";
import { useLocale } from "@/i18n/routing";

export const DiscographySection = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const activeLocale = locale === "en" ? "en" : "pt";
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = albums.find((album) => album.id === activeId) ?? null;

  return (
    <>
      <Section innerClassName="py-14 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="02" label={t("music.discography.label")} />
            <h2 className="mt-5 text-display-sm font-medium uppercase text-foreground">
              {t("music.discography.title")}
            </h2>
          </div>
          <p className="max-w-[42ch] text-[13px] leading-relaxed text-wire-ink-soft">
            {t("music.discography.lead")}
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {albums.map((album) => (
            <li key={album.id}>
              <button
                type="button"
                onClick={() => setActiveId(album.id)}
                className="group block w-full text-left"
              >
                <AlbumCover
                  album={album}
                  className="aspect-square w-full transition-opacity group-hover:opacity-90"
                />
                <div className="mt-4 flex items-start justify-between gap-3 border-t border-wire-rule pt-3">
                  <div>
                    <h3 className="min-h-[2.4em] text-[11px] uppercase leading-snug tracking-[0.12em] text-foreground">
                      {album.title}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-wire-ink-soft">
                      {album.year ||
                        t("music.discography.soon")}
                      {album.status === "soon" && album.year
                        ? ` · ${t("music.discography.soon")}`
                        : ""}
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-wire-ink-soft transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Dialog
        open={Boolean(active)}
        onOpenChange={(open) => {
          if (!open) setActiveId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl gap-0 overflow-y-auto border-wire-rule bg-background p-0 sm:rounded-[var(--radius)]">
          {active ? (
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <AlbumCover
                album={active}
                className="min-h-[240px] w-full md:h-full"
              />

              <div className="p-6 pt-10 md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
                  {active.year || t("music.discography.soon")} ·{" "}
                  {active.type[activeLocale]} · {active.code}
                </p>

                <DialogTitle className="mt-3 text-[22px] font-medium uppercase leading-tight text-foreground">
                  {active.title}
                </DialogTitle>

                <DialogDescription className="mt-4 text-[13px] leading-relaxed text-wire-ink-soft">
                  {active.description[activeLocale]}
                </DialogDescription>

                <div className="mt-6 border-t border-wire-rule pt-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
                    {t("music.discography.listen")}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {active.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 border border-wire-rule px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-wire-ink hover:bg-accent"
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
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};
