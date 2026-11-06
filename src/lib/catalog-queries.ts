import { queryOptions } from "@tanstack/react-query";

import type { CatalogKey } from "@/lib/catalog";
import { getCatalogProduct, listCatalogProducts } from "@/lib/catalog.functions";

const FIVE_MINUTES = 5 * 60 * 1000;

export const catalogProductsQuery = (catalog: CatalogKey) =>
  queryOptions({
    queryKey: ["catalog-products", catalog],
    queryFn: () => listCatalogProducts({ data: { catalog } }),
    staleTime: FIVE_MINUTES,
  });

export const catalogProductQuery = (slug: string) =>
  queryOptions({
    queryKey: ["catalog-product", slug],
    queryFn: () => getCatalogProduct({ data: { slug } }),
    staleTime: FIVE_MINUTES,
  });
