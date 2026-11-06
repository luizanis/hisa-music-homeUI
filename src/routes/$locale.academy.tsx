import { createFileRoute } from "@tanstack/react-router";

import { CatalogBrowser, CatalogError } from "@/components/catalog/catalog-browser";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import { catalogProductsQuery } from "@/lib/catalog-queries";
import { translatedHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/academy")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogProductsQuery("academy")),
  head: ({ params }) =>
    translatedHead(params.locale, "catalog.academy.title", "catalog.academy.lead"),
  errorComponent: CatalogError,
  component: AcademyPage,
});

function AcademyPage() {
  return (
    <>
      <CatalogHeader catalog="academy" index="02" />
      <CatalogBrowser catalog="academy" />
    </>
  );
}
