/**
 * Thin bridge that gives the pages imported from the Enter project the small
 * navigation API they were written against (Link / NavLink / useNavigate /
 * useParams / useLocation / useSearchParams / Navigate), implemented on top of
 * TanStack Router. Every link still goes through AppLink, so locale-built hrefs
 * such as "/pt/my-orders?order=HISA-1#items" navigate client-side.
 */
import {
  Navigate as RouterNavigate,
  Outlet,
  useLocation as useRouterLocation,
  useNavigate as useRouterNavigate,
  useParams as useRouterParams,
} from "@tanstack/react-router";
import {
  forwardRef,
  useCallback,
  useMemo,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

import { AppLink } from "@/components/site/app-link";

export { Outlet };

type NavigateOptions = { replace?: boolean | undefined };

/** Same-site navigation by href string, or history steps when given a number. */
export const useNavigate = () => {
  const navigate = useRouterNavigate();
  return useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        window.history.go(to);
        return;
      }
      void navigate({ href: to, replace: options?.replace ?? false });
    },
    [navigate],
  );
};

export const useParams = <
  T extends Record<string, string | undefined> = Record<string, string | undefined>,
>(): Partial<T> => useRouterParams({ strict: false }) as Partial<T>;

/** Location with string search ("?a=1") and hash ("#x"), like the original API. */
export const useLocation = () => {
  const location = useRouterLocation();
  return {
    pathname: location.pathname,
    search: location.searchStr,
    hash: location.hash ? `#${location.hash}` : "",
  };
};

type SearchInit = URLSearchParams | Record<string, string> | string;

export const useSearchParams = () => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setParams = useCallback(
    (
      next: SearchInit | ((current: URLSearchParams) => SearchInit),
      options?: NavigateOptions,
    ) => {
      const value = typeof next === "function" ? next(new URLSearchParams(search)) : next;
      const query = new URLSearchParams(value).toString();
      navigate(`${pathname}${query ? `?${query}` : ""}${hash}`, {
        replace: options?.replace,
      });
    },
    [hash, navigate, pathname, search],
  );

  return [params, setParams] as const;
};

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <AppLink ref={ref} {...props} />
));
Link.displayName = "Link";

type NavState = { isActive: boolean };

type NavLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
> & {
  to: string;
  /** Only highlight on an exact match, not on child paths. */
  end?: boolean | undefined;
  className?: string | ((state: NavState) => string | undefined) | undefined;
  children?: ReactNode | ((state: NavState) => ReactNode);
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, end, className, children, ...props }, ref) => {
    const { pathname } = useLocation();
    const base = to.split(/[?#]/)[0] ?? to;
    const isActive = end
      ? pathname === base
      : pathname === base || pathname.startsWith(`${base}/`);
    const state = { isActive };

    return (
      <AppLink
        ref={ref}
        to={to}
        aria-current={isActive ? "page" : undefined}
        className={typeof className === "function" ? className(state) : className}
        {...props}
      >
        {typeof children === "function" ? children(state) : children}
      </AppLink>
    );
  },
);
NavLink.displayName = "NavLink";

export const Navigate = ({ to, replace }: { to: string; replace?: boolean }) => (
  <RouterNavigate href={to} replace={replace ?? false} />
);
