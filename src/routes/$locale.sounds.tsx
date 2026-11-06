import { createFileRoute } from "@tanstack/react-router";

import { CatalogBrowser, CatalogError } from "@/components/catalog/catalog-browser";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import { catalogProductsQuery } from "@/lib/catalog-queries";
import { translatedHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/sounds")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogProductsQuery("sounds")),
  head: ({ params }) =>
    translatedHead(params.locale, "catalog.sounds.title", "catalog.sounds.lead"),
  errorComponent: CatalogError,
  component: SoundsPage,
});

function SoundsPage() {
  return (
    <>
      <CatalogHeader catalog="sounds" index="03" />
      <CatalogBrowser catalog="sounds" />
    </>
  );
}
