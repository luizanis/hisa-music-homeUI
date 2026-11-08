import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "@/lib/router-compat";

import { adminNavItems } from "@/admin/admin-nav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useLocale } from "@/i18n/routing";

type Crumb = { label: string; href?: string };

export const AdminBreadcrumbs = () => {
  const { t } = useTranslation();
  const { to } = useLocale();
  const { pathname } = useLocation();

  const base = to("admin");
  const segments = pathname.split("/").filter(Boolean);
  const restPath = segments.slice(2).join("/");
  const navItem = adminNavItems
    .filter((item) => item.path && (restPath === item.path || restPath.startsWith(`${item.path}/`)))
    .sort((a, b) => b.path.length - a.path.length)[0];

  const crumbs: Crumb[] = [{ label: t("admin.breadcrumb.admin"), href: base }];

  if (!restPath) {
    crumbs.push({ label: t("admin.nav.overview") });
  } else if (navItem) {
    const remainder = restPath.slice(navItem.path.length).replace(/^\//, "");
    crumbs.push({
      label: t(navItem.labelKey),
      href: remainder ? to(`admin/${navItem.path}`) : undefined,
    });

    if (remainder) {
      const leaf = remainder.split("/").filter(Boolean).pop() ?? "";
      const leafLabel =
        leaf === "new"
          ? t("admin.breadcrumb.new")
          : leaf === "edit"
            ? t("admin.breadcrumb.edit")
            : `#${leaf}`;
      crumbs.push({ label: leafLabel });
    }
  } else {
    crumbs.push({ label: segments[segments.length - 1] ?? t("admin.nav.overview") });
  }

  return (
    <Breadcrumb aria-label={t("admin.breadcrumb.label")}>
      <BreadcrumbList className="gap-1.5 text-[8.5px] uppercase tracking-[0.16em] text-wire-ink-soft sm:gap-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <BreadcrumbItem key={`${crumb.label}-${index}`} className="gap-1.5">
              {index > 0 ? (
                <span aria-hidden className="flex items-center text-wire-ink-soft/60">
                  <ChevronRight className="h-2.5 w-2.5" strokeWidth={1.5} />
                </span>
              ) : null}
              {isLast || !crumb.href ? (
                <BreadcrumbPage className="text-[8.5px] uppercase tracking-[0.16em] text-foreground">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  className="text-[8.5px] uppercase tracking-[0.16em] text-wire-ink-soft hover:text-foreground"
                >
                  <Link to={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
