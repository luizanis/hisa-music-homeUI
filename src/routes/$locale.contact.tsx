import { createFileRoute } from "@tanstack/react-router";

import { ContactIntro } from "@/components/contact/contact-intro";
import { CustomServicesSection } from "@/components/contact/custom-services-section";
import { InquiryFormSection } from "@/components/contact/inquiry-form-section";
import { ServicesCta } from "@/components/contact/services-cta";
import { SocialSection } from "@/components/contact/social-section";
import { translatedHead } from "@/lib/seo";

type ContactSearch = { area?: string | undefined; product?: string | undefined };

export const Route = createFileRoute("/$locale/contact")({
  // Catalog cards and the shows section pre-fill the brief through these params.
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    area: typeof search["area"] === "string" ? search["area"] : undefined,
    product: typeof search["product"] === "string" ? search["product"] : undefined,
  }),
  head: ({ params }) => translatedHead(params.locale, "contact.title", "contact.lead"),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <ContactIntro />
      <CustomServicesSection />
      <ServicesCta />
      <InquiryFormSection />
      <SocialSection />
    </>
  );
}
