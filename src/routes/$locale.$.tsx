import { createFileRoute } from "@tanstack/react-router";

import { NotFoundPage } from "@/components/site/not-found-page";
import { translatedHead } from "@/lib/seo";

// Unknown paths inside a locale keep the site header and footer.
export const Route = createFileRoute("/$locale/$")({
  head: ({ params }) => ({
    meta: [...translatedHead(params.locale, "notFound.title").meta, { name: "robots", content: "noindex" }],
  }),
  component: NotFoundPage,
});
