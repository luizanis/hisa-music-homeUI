import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";

import type { Database } from "@/integrations/supabase/types";
import type { CatalogKey, CatalogProduct } from "@/lib/catalog";

const PRODUCT_COLUMNS =
  "id, catalog, category, slug, title_pt, title_en, meta_pt, meta_en, price_cents, starts_at, content";

/** Read-only public client: published catalog rows are open to everyone. */
const createPublicClient = () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Catalog backend is not configured.");

  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        // Opaque sb_ keys are not JWTs; send them only as apikey.
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
};

export const listCatalogProducts = createServerFn({ method: "GET" })
  .validator((input: { catalog: CatalogKey }) => {
    if (input.catalog !== "academy" && input.catalog !== "sounds") {
      throw new Error("Unknown catalog");
    }
    return { catalog: input.catalog };
  })
  .handler(async ({ data }): Promise<CatalogProduct[]> => {
    const { data: rows, error } = await createPublicClient()
      .from("catalog_products")
      .select(PRODUCT_COLUMNS)
      .eq("catalog", data.catalog)
      .eq("is_published", true)
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);
    return (rows ?? []) as unknown as CatalogProduct[];
  });

export const getCatalogProduct = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => {
    const slug = String(input.slug ?? "").slice(0, 120);
    return { slug };
  })
  .handler(async ({ data }): Promise<CatalogProduct | null> => {
    if (!data.slug) return null;
    const { data: row, error } = await createPublicClient()
      .from("catalog_products")
      .select(PRODUCT_COLUMNS)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (row ?? null) as unknown as CatalogProduct | null;
  });
