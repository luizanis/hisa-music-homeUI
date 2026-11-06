import { createFileRoute } from "@tanstack/react-router";

import { EcosystemSection } from "@/components/home/ecosystem-section";
import { HeroSection } from "@/components/home/hero-section";
import { ManifestoSection } from "@/components/home/manifesto-section";
import { ServicesSection } from "@/components/home/services-section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => pageHead(params.locale),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <HeroSection />
      <ManifestoSection />
      <EcosystemSection />
      <ServicesSection />
    </>
  );
}
