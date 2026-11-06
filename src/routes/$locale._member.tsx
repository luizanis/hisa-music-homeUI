import { Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useCartDrawer } from "@/components/cart/cart-drawer";
import { memberNav, type MemberNavItem } from "@/components/member/member-nav";
import { AppLink as Link } from "@/components/site/app-link";
import { Container } from "@/components/site/container";
import { useLocale } from "@/i18n/routing";
import { supabase } from "@/integrations/supabase/client";
import { useCart, useProfile } from "@/lib/member-store";
import { displayName, initialsOf, requireSession } from "@/lib/session";
import { cn } from "@/lib/utils";

/**
 * Signed-in customer area: dashboard, courses, library, orders and account.
 * The session lives in browser storage, so these pages render client-side.
 */
export const Route = createFileRoute("/$locale/_member")({
  ssr: false,
  staticData: { appShell: true },
  beforeLoad: ({ params, location }) => requireSession(params.locale, location.href),
  component: MemberLayout,
});

const useIsActive = () => {
  const { pathname } = useLocation();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
};

function NavEntry({ item, compact = false }: { item: MemberNavItem; compact?: boolean }) {
  const { t } = useTranslation();
  const { to } = useLocale();
  const isActive = useIsActive();
  const cart = useCart();
  const { open } = useCartDrawer();

  const base = compact
    ? "flex h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-[10px] uppercase tracking-[0.14em] transition-colors"
    : "flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-[11px] uppercase tracking-[0.12em] transition-colors";
  const idle = "border-transparent text-wire-ink-soft hover:bg-wire-surface hover:text-foreground";
  const active = "border-wire-ink bg-wire-surface text-foreground";

  if (item.kind === "cart") {
    return (
      <button type="button" onClick={open} className={cn(base, idle)}>
        <item.icon aria-hidden className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
        <span className="flex-1 text-left">{t(item.key)}</span>
        {cart.items.length > 0 ? (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[9px] text-primary-foreground">
            {cart.items.length}
          </span>
        ) : null}
      </button>
    );
  }

  const href = to(item.path);
  const current = isActive(href);
  return (
    <Link to={href} aria-current={current ? "page" : undefined} className={cn(base, current ? active : idle)}>
      <item.icon aria-hidden className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
      <span className={compact ? undefined : "flex-1"}>{t(item.key)}</span>
    </Link>
  );
}

function MemberSidebar() {
  const { t } = useTranslation();
  const { to } = useLocale();
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const profile = useProfile();
  const name = displayName(user, profile);

  const signOut = async () => {
    await supabase.auth.signOut();
    void navigate({ href: to(""), replace: true });
  };

  return (
    <nav aria-label={t("member.navLabel")} className="space-y-6">
      <div className="flex items-center gap-3 border border-wire-rule p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-primary text-[12px] font-medium text-primary-foreground">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            initialsOf(name)
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[12px] uppercase tracking-[0.04em] text-foreground">{name}</span>
          <span className="block truncate text-[10px] text-wire-ink-soft">{user.email}</span>
        </span>
      </div>

      {memberNav.map((group) => (
        <div key={group.group}>
          <p className="px-3 pb-2 text-[9px] uppercase tracking-[0.2em] text-wire-ink-soft">{t(group.group)}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item.key}>
                <NavEntry item={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="space-y-1 border-t border-wire-rule pt-4">
        <Link
          to={to("")}
          className="flex items-center gap-3 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t("member.backToSite")}
        </Link>
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex w-full items-center gap-3 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-foreground"
        >
          <LogOut aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t("member.signOut")}
        </button>
      </div>
    </nav>
  );
}

function MobileMemberNav() {
  const { t } = useTranslation();
  const { to } = useLocale();
  const items = memberNav.flatMap((group) => group.items);

  return (
    <nav
      aria-label={t("member.navLabel")}
      className="sticky top-16 z-30 -mx-5 mb-6 border-b border-wire-rule bg-background/95 backdrop-blur-sm sm:-mx-8 sm:top-[72px] lg:hidden"
    >
      <ul className="flex overflow-x-auto px-3 sm:px-6">
        {items.map((item) => (
          <li key={item.key}>
            <NavEntry item={item} compact />
          </li>
        ))}
        <li>
          <Link
            to={to("")}
            className="flex h-11 shrink-0 items-center gap-2 border-b-2 border-transparent px-3 text-[10px] uppercase tracking-[0.14em] whitespace-nowrap text-wire-ink-soft hover:text-foreground"
          >
            <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t("member.backToSiteShort")}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function MemberLayout() {
  return (
    <Container className="pb-16 pt-0 lg:pt-10">
      <div className="lg:grid lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-[104px]">
            <MemberSidebar />
          </div>
        </aside>
        <div className="min-w-0">
          <MobileMemberNav />
          <Outlet />
        </div>
      </div>
    </Container>
  );
}
