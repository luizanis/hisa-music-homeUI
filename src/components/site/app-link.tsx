import { Link } from "@tanstack/react-router";
import { forwardRef, type AnchorHTMLAttributes } from "react";

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  /** In-site href such as "/pt/contact?area=show#briefing". */
  to: string;
};

/** Split an in-site href into the pieces the router navigates with. */
export const splitHref = (href: string) => {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : undefined;
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = beforeHash.indexOf("?");
  const pathname = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
  const search =
    queryIndex >= 0
      ? Object.fromEntries(new URLSearchParams(beforeHash.slice(queryIndex + 1)))
      : undefined;

  return { pathname: pathname || "/", search, hash };
};

/**
 * Router link for locale-built hrefs. Pages build paths with `useLocale().to()`,
 * so this keeps the string contract while still using client-side navigation.
 */
export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ to, target, ...props }, ref) => {
    const { pathname, search, hash } = splitHref(to);
    return (
      <Link
        ref={ref}
        to={pathname}
        search={search ?? {}}
        {...(hash ? { hash } : {})}
        {...(target ? { target } : {})}
        {...props}
      />
    );
  },
);
AppLink.displayName = "AppLink";
