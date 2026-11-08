import {
  ArrowLeft,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  ReceiptText,
  ShoppingBag,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "@/lib/router-compat";

import { Container } from "@/components/site/container";
import { useLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useAccount } from "@/store/account-store";

type NavItem = {
  path: string;
  key: string;
  icon: LucideIcon;
  /** Extra prefix that should keep this item highlighted (course player). */
  alias?: string;
  cart?: boolean;
};

type NavGroup = { key: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    key: "internal.group.main",
    items: [{ path: "dashboard", key: "nav.dashboard", icon: LayoutDashboard }],
  },
  {
    key: "internal.group.learning",
    items: [
      {
        path: "my-courses",
        key: "nav.myCourses",
        icon: GraduationCap,
        alias: "courses",
      },
      { path: "my-library", key: "nav.myLibrary", icon: LibraryBig },
    ],
  },
  {
    key: "internal.group.purchases",
    items: [
      { path: "my-orders", key: "nav.myOrders", icon: ReceiptText },
      { path: "cart", key: "nav.cart", icon: ShoppingBag, cart: true },
    ],
  },
  {
    key: "internal.group.account",
    items: [{ path: "account", key: "nav.account", icon: UserRound }],
  },
];

const InternalLayout = () => {
  const { t } = useTranslation();
  const { to } = useLocale();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDemo, isSignedIn, cartCount, signOut } = useAccount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hrefFor = (path: string) => to(path);

  const isActive = (item: NavItem) => {
    const base = hrefFor(item.path);
    if (pathname === base) return true;
    if (pathname.startsWith(`${base}/`)) return true;
    if (item.alias && pathname.startsWith(`${to(item.alias)}/`)) return true;
    return false;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(to("signin"), { replace: true });
  };

  const renderLinks = (onNavigate?: () => void) => (
    <nav aria-label={t("internal.area")} className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.key}>
          <p className="text-[9px] uppercase tracking-[0.22em] text-wire-ink-soft/80">
            {t(group.key)}
          </p>
          <ul className="mt-2 border-t border-wire-rule">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <li key={item.path} className="border-b border-wire-rule">
                  <NavLink
                    to={hrefFor(item.path)}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 py-3 text-[11px] uppercase tracking-[0.12em] transition-colors",
                      active
                        ? "text-foreground"
                        : "text-wire-ink-soft hover:text-foreground",
                    )}
                  >
                    <Icon
                      aria-hidden
                      className="h-4 w-4 shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="flex-1">{t(item.key)}</span>
                    {item.cart && cartCount > 0 ? (
                      <span className="flex h-4 min-w-4 items-center justify-center bg-primary px-1 font-mono text-[9px] text-primary-foreground">
                        {cartCount}
                      </span>
                    ) : active ? (
                      <span
                        aria-hidden
                        className="h-1 w-1 shrink-0 bg-wire-ink"
                      />
                    ) : null}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="border-b border-wire-rule bg-background">
      <Container>
        <div className="lg:grid lg:grid-cols-[224px_minmax(0,1fr)] lg:gap-10">
          <aside className="hidden border-r border-wire-rule lg:block">
            <div className="sticky top-[72px] flex max-h-[calc(100vh-72px)] flex-col overflow-y-auto py-8 pr-6">
              <p className="text-[9px] uppercase tracking-[0.24em] text-foreground">
                {t("internal.area")}
              </p>
              <div className="mt-5">{renderLinks()}</div>

              <div className="mt-8 space-y-3 border-t border-wire-rule pt-5">
                <Link
                  to={to("")}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-foreground"
                >
                  <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t("internal.backToSite")}
                </Link>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:text-foreground"
                >
                  <LogOut aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t("internal.signOut")}
                </button>
              </div>
            </div>
          </aside>

          <div className="min-w-0 py-8 lg:py-10">
            <div className="mb-6 lg:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-expanded={isMenuOpen}
                aria-controls="account-navigation"
                className="flex w-full items-center justify-between gap-3 border border-wire-rule bg-background px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-foreground"
              >
                <span>{t("internal.menu")}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isMenuOpen && "rotate-180",
                  )}
                  strokeWidth={1.5}
                />
              </button>

              {isMenuOpen ? (
                <div
                  id="account-navigation"
                  className="border border-t-0 border-wire-rule bg-background p-4"
                >
                  {renderLinks(() => setIsMenuOpen(false))}
                  <div className="mt-6 flex flex-col gap-3 border-t border-wire-rule pt-4">
                    <Link
                      to={to("")}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft"
                    >
                      <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {t("internal.backToSite")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleSignOut()}
                      className="flex items-center gap-2 text-left text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft"
                    >
                      <LogOut aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {t("internal.signOut")}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {isDemo ? (
              <div className="mb-7 flex flex-col gap-1 border border-wire-rule bg-wire-surface px-4 py-3 sm:flex-row sm:items-baseline sm:gap-3">
                <span className="shrink-0 text-[9px] uppercase tracking-[0.18em] text-foreground">
                  {t("internal.demo.title")}
                </span>
                <span className="text-[11px] leading-relaxed text-wire-ink-soft">
                  {t("internal.demo.text")}
                </span>
              </div>
            ) : !isSignedIn ? (
              <div className="mb-7 flex flex-col gap-2 border border-dashed border-wire-rule px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] text-foreground">
                    {t("internal.guest.title")}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-wire-ink-soft">
                    {t("internal.guest.text")}
                  </p>
                </div>
                <Link
                  to={`${to("signin")}?next=${encodeURIComponent(pathname)}`}
                  className="shrink-0 text-[9px] uppercase tracking-[0.14em] text-foreground underline decoration-wire-rule underline-offset-4"
                >
                  {t("internal.guest.cta")}
                </Link>
              </div>
            ) : null}

            <Outlet />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default InternalLayout;
