import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/site/container";
import { SectionLabel } from "@/components/site/section-label";
import { BiographySection } from "@/components/music/biography-section";
import { heroVideoUrl } from "@/data/music";

export const MusicHero = () => {
  const { t } = useTranslation();

  return (
    <section className="border-b border-media-line/20 bg-media-deep text-media-foreground">
      <Container className="py-12 md:py-16">
        <SectionLabel index="00" label={t("music.label")} tone="dark" />

        {/* Header artwork: video plays muted in loop behind the title. */}
        <div className="relative mt-6 overflow-hidden border border-media-line/20 bg-media">
          {heroVideoUrl ? (
            <video
              src={heroVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
          ) : (
            <div aria-hidden className="absolute inset-0">
              <span className="absolute inset-0 bg-linear-to-br from-media-foreground/[0.07] via-transparent to-media-foreground/[0.02]" />
              <span className="absolute left-4 top-4 h-5 w-5 border-l border-t border-media-line/25" />
              <span className="absolute right-4 top-4 h-5 w-5 border-r border-t border-media-line/25" />
              <span className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-media-line/25" />
              <span className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-media-line/25" />
            </div>
          )}

          <span className="absolute left-6 top-6 z-10 flex w-fit items-center gap-2 border border-media-line/25 bg-media/40 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-media-foreground/70">
            <Play aria-hidden className="h-3 w-3" strokeWidth={1.5} />
            {t("music.heroVideo")}
          </span>

          <div className="relative z-10 flex min-h-[320px] flex-col justify-end p-6 md:min-h-[380px] md:p-10">
            <h1 className="text-display font-medium uppercase">
              {t("music.title")}
            </h1>
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-media-foreground">
              {t("music.role")}
            </p>
          </div>
        </div>

        <BiographySection />
      </Container>
    </section>
  );
};
