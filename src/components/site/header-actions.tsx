import { useNavigate } from "@tanstack/react-router";
import { LogOut, ShoppingCart, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useCartDrawer } from "@/components/cart/cart-drawer";
import { memberNav } from "@/components/member/member-nav";
import { AppLink as Link } from "@/components/site/app-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/i18n/routing";
import { supabase } from "@/integrations/supabase/client";
import { useCart, useProfile } from "@/lib/member-store";
import { displayName, initialsOf, signinHref, useAuthUser } from "@/lib/session";
import { cn } from "@/lib/utils";

const iconButton =
  "relative flex h-8 w-8 items-center justify-center border border-wire-rule text-foreground transition-colors hover:bg-accent";

/** Cart icon with item count; opens the shared cart drawer. */
export const CartButton = () => {
  const { t } = useTranslation();
  const { open } = useCartDrawer();
  const cart = useCart();
  const count = cart.items.length;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? t("header.cartWithCount", { count }) : t("header.cart")}
      className={iconButton}
    >
      <ShoppingCart aria-hidden className="h-4 w-4" strokeWidth={1.5} />
      {count > 0 ? (
        <span
          aria-hidden
          className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[9px] leading-none text-primary-foreground"
        >
          {count}
        </span>
      ) : null}
    </button>
  );
};

/** Profile icon: sign-in when signed out, account menu when signed in. */
export const UserMenu = () => {
  const { t } = useTranslation();
  const { to } = useLocale();
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const profile = useProfile();

  if (!user) {
    return (
      <Link to={signinHref(to(""), to("dashboard")).replace(/^\/[a-z]{2}\/?/, `${to("")}/`)} aria-label={t("header.signin")} className={iconButton}>
        <UserRound aria-hidden className="h-4 w-4" strokeWidth={1.5} />
      </Link>
    );
  }

  const name = displayName(user, profile);
  const links = memberNav.flatMap((group) => group.items).filter((item) => item.kind === "link");

  const signOut = async () => {
    await supabase.auth.signOut();
    void navigate({ href: to(""), replace: true });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={t("header.accountMenu", { name })}
        className={cn(iconButton, "border-wire-ink bg-primary text-primary-foreground hover:bg-primary/85")}
      >
        {profile.avatar ? (
          <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-[10px] font-medium tracking-[0.06em]">{initialsOf(name)}</span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-[var(--radius)] border-wire-rule p-0 shadow-none"
      >
        <DropdownMenuLabel className="border-b border-wire-rule px-3 py-3 font-normal">
          <span className="block truncate text-[12px] uppercase tracking-[0.06em] text-foreground">{name}</span>
          <span className="block truncate text-[11px] text-wire-ink-soft">{user.email}</span>
        </DropdownMenuLabel>
        <div className="p-1">
          {links.map((item) =>
            item.kind === "link" ? (
              <DropdownMenuItem key={item.path} asChild className="rounded-[var(--radius)] px-2 py-2 text-[11px] uppercase tracking-[0.12em]">
                <Link to={to(item.path)}>
                  <item.icon aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t(item.key)}
                </Link>
              </DropdownMenuItem>
            ) : null,
          )}
        </div>
        <DropdownMenuSeparator className="m-0 bg-wire-rule" />
        <div className="p-1">
          <DropdownMenuItem
            onSelect={() => void signOut()}
            className="rounded-[var(--radius)] px-2 py-2 text-[11px] uppercase tracking-[0.12em]"
          >
            <LogOut aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t("member.signOut")}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
