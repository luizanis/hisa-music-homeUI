import { ArrowDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

/**
 * Biography as an internal scroll box: the section keeps a compact height and
 * shows only the opening lines, while the full story stays in the DOM (and
 * scrollable) inside the container. Once the inner scroll reaches the end the
 * wheel continues on the page, so the next sections keep moving.
 */
export const BiographySection = () => {
  const { t } = useTranslation();
  const [atEnd, setAtEnd] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const reachedEnd =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 8;
    setAtEnd(reachedEnd);
  };

  return (
    <div className="mt-10 border-t border-media-line/15 pt-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-media-foreground/60">
          {t("music.bioLabel")}
        </p>
        <p
          aria-hidden
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-media-foreground/50"
        >
          <ArrowDown
            aria-hidden
            className={cn(
              "h-3 w-3 transition-transform duration-300",
              atEnd ? "rotate-180" : "rotate-0",
            )}
            strokeWidth={1.5}
          />
          {t("music.bioHint")}
        </p>
      </div>

      <div className="relative mt-4">
        <div
          role="region"
          aria-label={t("music.bioLabel")}
          tabIndex={0}
          onScroll={handleScroll}
          className="overflow-y-auto border-y border-media-line/15 py-4 pr-4 text-[14px] leading-[1.75] text-media-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-media-foreground/40 [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:bg-media-soft/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1"
          style={{ maxHeight: 300 }}
        >
          <p>{t("music.bio1")}</p>
          <p className="mt-5">{t("music.bio2")}</p>
          <p className="mt-5 pb-6">{t("music.bio3")}</p>
        </div>

        {/* Fade signalling more text below; hides once the text is fully read. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-media-deep to-transparent transition-opacity duration-300",
            atEnd ? "opacity-0" : "opacity-100",
          )}
        />
      </div>
    </div>
  );
};
