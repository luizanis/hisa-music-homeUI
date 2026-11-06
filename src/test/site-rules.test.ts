import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { formatPrice, hasInstantAccess } from "@/lib/catalog";
import { localePath, safeNextPath } from "@/i18n/routing";
import { routeTree } from "@/routeTree.gen";

describe("catalog prices", () => {
  it("quotes prices in Brazilian reais with the Brazilian format", () => {
    expect(formatPrice(39900).replace(/\s/g, " ")).toBe("R$ 399,00");
    expect(formatPrice(5990).replace(/\s/g, " ")).toBe("R$ 59,90");
  });

  it("gives instant access only to courses, lessons and analyses", () => {
    expect(hasInstantAccess("courses")).toBe(true);
    expect(hasInstantAccess("analyses")).toBe(true);
    expect(hasInstantAccess("workshops")).toBe(false);
    expect(hasInstantAccess("mentorship")).toBe(false);
  });
});

describe("locale URLs", () => {
  it("prefixes every page with its language", () => {
    expect(localePath("pt", "music")).toBe("/pt/music");
    expect(localePath("en")).toBe("/en");
  });

  it("matches localized pages", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/en/academy").at(-1)?.routeId).toBe("/$locale/academy");
    expect(router.matchRoutes("/pt/product/neon-textures").at(-1)?.routeId).toBe(
      "/$locale/product/$slug",
    );
  });
});

describe("sign-in return path", () => {
  it("only accepts same-site paths after sign-in", () => {
    expect(safeNextPath("/pt/checkout/neon-textures")).toBe("/pt/checkout/neon-textures");
    expect(safeNextPath("//evil.example")).toBeUndefined();
    expect(safeNextPath("https://evil.example")).toBeUndefined();
  });
});
