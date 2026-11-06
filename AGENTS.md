<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Every page lives under a `/$locale` prefix (`pt`, `en`); `/` redirects to the default locale. Why: the URL is the language contract carried over from the original site.
- Translations are bundled from `src/i18n/locales/*.json`, one fixed i18next instance per locale provided by the `$locale` layout; never call `changeLanguage` on a shared instance. Why: SSR stays correct when both languages render concurrently.
- Build in-site links with `useLocale().to()` and render them through `AppLink`. Why: keeps the locale prefix and parses `?search`/`#hash` for the router.
- Catalog reads go through `src/lib/catalog.functions.ts` (public publishable-key server functions) with `catalog-queries.ts` query options in route loaders. Why: product pages render with data and per-product metadata on first load.
- Checkout requires a signed-in session via a client-only `beforeLoad` that redirects to `/$locale/signin?next=`; imported accounts set their password through the reset-password page. Why: sessions live in browser storage.
