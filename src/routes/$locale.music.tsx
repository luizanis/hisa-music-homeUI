import { createFileRoute } from "@tanstack/react-router";

import { DiscographySection } from "@/components/music/discography-section";
import { LatestReleaseSection } from "@/components/music/latest-release-section";
import { MusicHero } from "@/components/music/music-hero";
import { PressSection } from "@/components/music/press-section";
import { ShowsSection } from "@/components/music/shows-section";
import { VideographySection } from "@/components/music/videography-section";
import { translatedHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/music")({
  head: ({ params }) => translatedHead(params.locale, "nav.music", "music.role"),
  component: MusicPage,
});

function MusicPage() {
  return (
    <>
      <MusicHero />
      <LatestReleaseSection />
      <DiscographySection />
      <VideographySection />
      <ShowsSection />
      <PressSection />
    </>
  );
}
