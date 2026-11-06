import { createFileRoute, redirect } from "@tanstack/react-router";

import { defaultLocale } from "@/i18n/routing";
import { pageHead } from "@/lib/seo";

// "/" has no content of its own: every page lives under a locale prefix.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/$locale", params: { locale: defaultLocale }, replace: true });
  },
  head: () => pageHead(defaultLocale),
});
