import { useTranslation } from "react-i18next";

import type { Album } from "@/data/music";
import { useLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type AlbumCoverProps = {
  album: Album;
  className?: string;
};

const layoutClasses: Record<Album["layout"], string> = {
  stacked: "items-start justify-start",
  centered: "items-center justify-center text-center",
  bottom: "items-start justify-end",
  split: "items-start justify-center",
};

const titleSize = (title: string) => {
  if (title.length > 18) return "text-[clamp(1.05rem,2vw,1.5rem)]";
  if (title.length > 11) return "text-[clamp(1.3rem,2.4vw,1.9rem)]";
  return "text-[clamp(1.7rem,3.2vw,2.4rem)]";
};

/**
 * Typographic album cover. Neutral by design: the final artwork simply
 * replaces this component's background when the visual phase is approved.
 */
export const AlbumCover = ({ album, className }: AlbumCoverProps) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const index = album.code.split("-")[1] ?? "01";

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden border border-media-line/20 bg-media text-media-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -right-1 select-none font-medium leading-none tracking-[-0.06em] text-media-foreground/[0.07] text-[10rem]"
      >
        {index}
      </span>

      <div className="relative flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 text-[8px] uppercase tracking-[0.24em] text-media-soft">
          <span>HISA</span>
          <span className="font-mono">{album.code}</span>
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col py-6",
            layoutClasses[album.layout],
          )}
        >
          <p
            className={cn(
              "max-w-[14ch] font-medium uppercase leading-[0.9] tracking-[-0.02em]",
              titleSize(album.title),
            )}
          >
            {album.title}
          </p>
          {album.layout === "split" ? (
            <span
              aria-hidden
              className="mt-3 block h-px w-10 bg-media-line/50"
            />
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-3 text-[8px] uppercase tracking-[0.2em] text-media-soft">
          <span className="font-mono">{album.year || "·"}</span>
          <span>
            {album.status === "soon"
              ? t("music.discography.soon")
              : album.type[locale === "en" ? "en" : "pt"]}
          </span>
        </div>
      </div>
    </div>
  );
};
