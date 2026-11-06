import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AppLink as Link } from "@/components/site/app-link";
import { Container } from "@/components/site/container";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { mainNav } from "@/components/site/nav-items";
import { useLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  to: string;
  onClick?: () => void;
  className: (state: { isActive: boolean }) => string;
  children: ReactNode | ((state: { isActive: boolean }) => ReactNode);
};

/** Header link that knows whether its section is the current page. */
const NavLink = ({ to, onClick, className, children }: NavLinkProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || pathname.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={className({ isActive })}
    >
      {typeof children === "function" ? children({ isActive }) : children}
    </Link>
  );
};

export const SiteHeader = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-wire-rule bg-background/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Link
          to={to("")}
          onClick={() => setIsOpen(false)}
          aria-label={`HISA · ${t("nav.home")}`}
          className="group flex items-baseline gap-2"
        >
          <span className="text-[17px] font-semibold leading-none tracking-[0.34em] text-foreground">
            HISA
          </span>
        </Link>

        <nav aria-label={t("footer.navTitle")} className="hidden h-full md:block">
          <ul className="flex h-full items-stretch gap-7">
            {mainNav.map((item) => (
              <li key={item.path} className="flex">
                <NavLink
                  to={to(item.path)}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center whitespace-nowrap text-nav uppercase transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-wire-ink-soft hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t(item.key)}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-0 bottom-0 h-px bg-wire-ink transition-opacity",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? t("common.close") : t("common.menu")}
            className="flex h-8 w-8 items-center justify-center border border-wire-rule text-foreground transition-colors hover:bg-accent md:hidden"
          >
            {isOpen ? (
              <X aria-hidden className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Menu aria-hidden className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </Container>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-wire-rule bg-background md:hidden"
        >
          <Container className="py-2">
            <ul>
              {mainNav.map((item, index) => (
                <li key={item.path} className="border-b border-wire-rule">
                  <NavLink
                    to={to(item.path)}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between gap-4 py-4 text-[13px] uppercase tracking-[0.16em] transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-wire-ink-soft hover:text-foreground",
                      )
                    }
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] text-wire-ink-soft">
                        0{index + 1}
                      </span>
                      {t(item.key)}
                    </span>
                    <span aria-hidden className="text-[10px] text-wire-ink-soft">
                      /{locale}/{item.path}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <p className="py-4 text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
              {t("shared.phase")}
            </p>
          </Container>
        </div>
      ) : null}
    </header>
  );
};
