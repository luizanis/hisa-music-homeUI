import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Library, LifeBuoy, Receipt, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ProductBox } from "@/components/catalog/product-box";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import {
  CourseStatusBadge,
  EmptyState,
  OrderStatusBadge,
  PageHeader,
  Panel,
  ProgressBar,
  formatDate,
} from "@/components/member/member-ui";
import { AppLink as Link } from "@/components/site/app-link";
import { Button } from "@/components/ui/button";
import { catalogSnapshots } from "@/data/member-mock";
import { useLocale } from "@/i18n/routing";
import { productCode, snapshotTitle } from "@/lib/cart";
import { formatPrice, hasInstantAccess, pickLocale } from "@/lib/catalog";
import { useLibrary, useProfile } from "@/lib/member-store";
import { translatedHead } from "@/lib/seo";
import { displayName, initialsOf } from "@/lib/session";

export const Route = createFileRoute("/$locale/_member/dashboard")({
  head: ({ params }) => ({
    meta: [
      ...translatedHead(params.locale, "dashboard.title", "dashboard.metaDescription").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { user } = Route.useRouteContext();
  const profile = useProfile();
  const { orders, owned, courses, downloads } = useLibrary();
  const name = displayName(user, profile);
  const lang = pickLocale(locale);

  const continueCourse =
    [...courses]
      .filter((course) => course.summary.status !== "completed")
      .sort((a, b) => (b.progress?.lastAccessed ?? "").localeCompare(a.progress?.lastAccessed ?? ""))[0] ??
    courses[0];

  const inProgress = courses.filter((course) => course.summary.status === "inProgress").length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const ownedSlugs = new Set(owned.map((entry) => entry.item.slug));
  const recommended = catalogSnapshots
    .filter((item) => !ownedSlugs.has(item.slug))
    .sort((a, b) => Number(hasInstantAccess(b.category)) - Number(hasInstantAccess(a.category)))
    .slice(0, 3);

  const memberSince = user.created_at ? formatDate(user.created_at, locale) : "—";

  return (
    <div className="space-y-8">
      <PageHeader
        label={t("dashboard.title")}
        title={t("dashboard.welcome", { name: name.split(" ")[0] ?? name })}
        lead={t("dashboard.lead")}
        actions={
          <Button asChild variant="outline">
            <Link to={to("my-courses")}>{t("member.nav.courses")}</Link>
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title={t("dashboard.continue")} className="xl:col-span-2">
          {continueCourse ? (
            <div className="grid gap-5 p-4 sm:grid-cols-[200px_1fr] sm:p-5">
              <ProductBox
                title={snapshotTitle(continueCourse.item, locale)}
                kicker={t(`catalog.academy.filters.${continueCourse.item.category}`)}
                code={productCode("academy", continueCourse.item.category)}
                variant={1}
              />
              <div className="flex flex-col">
                <CourseStatusBadge status={continueCourse.summary.status} />
                <h2 className="mt-3 text-[15px] font-medium uppercase leading-snug tracking-[0.04em] text-foreground">
                  {snapshotTitle(continueCourse.item, locale)}
                </h2>
                {continueCourse.summary.nextLesson ? (
                  <p className="mt-2 text-[12px] text-wire-ink-soft">
                    {t("dashboard.nextLesson")}: {continueCourse.summary.nextLesson.title[lang]}
                  </p>
                ) : null}
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
                    <span>
                      {t("courses.lessonsCount", {
                        done: continueCourse.summary.done,
                        total: continueCourse.summary.total,
                      })}
                    </span>
                    <span className="font-mono text-foreground">{continueCourse.summary.percent}%</span>
                  </div>
                  <ProgressBar value={continueCourse.summary.percent} label={t("courses.progress")} />
                </div>
                <div className="mt-auto pt-5">
                  <Button asChild>
                    <Link
                      to={`${to("courses")}/${continueCourse.item.slug}/learn${
                        continueCourse.summary.nextLesson ? `?lesson=${continueCourse.summary.nextLesson.id}` : ""
                      }`}
                    >
                      {continueCourse.summary.status === "notStarted" ? t("courses.start") : t("courses.continue")}
                      <ArrowRight aria-hidden strokeWidth={1.5} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <EmptyState title={t("courses.emptyTitle")} text={t("courses.emptyText")}>
                <Button asChild size="sm">
                  <Link to={to("academy")}>{t("courses.browseAcademy")}</Link>
                </Button>
              </EmptyState>
            </div>
          )}
        </Panel>

        <Panel title={t("dashboard.profile")}>
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-primary text-[13px] font-medium text-primary-foreground">
                {profile.avatar ? <img src={profile.avatar} alt="" className="h-full w-full object-cover" /> : initialsOf(name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] uppercase tracking-[0.04em] text-foreground">{name}</span>
                <span className="block truncate text-[11px] text-wire-ink-soft">{user.email}</span>
              </span>
            </div>
            <dl className="mt-5 grid grid-cols-3 border-y border-wire-rule py-3 text-center">
              {[
                [t("member.nav.courses"), courses.length],
                [t("member.nav.library"), downloads.length],
                [t("member.nav.orders"), orders.length],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <dd className="font-mono text-[18px] text-foreground">{value}</dd>
                  <dt className="mt-1 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">{label}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
              {t("dashboard.memberSince", { date: memberSince })}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to={to("account")}>{t("dashboard.editProfile")}</Link>
            </Button>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            path: "my-courses",
            icon: BookOpen,
            title: t("member.nav.courses"),
            detail: t("dashboard.coursesDetail", { count: courses.length, active: inProgress }),
          },
          {
            path: "my-library",
            icon: Library,
            title: t("member.nav.library"),
            detail: t("dashboard.libraryDetail", { count: downloads.length }),
          },
          {
            path: "my-orders",
            icon: Receipt,
            title: t("member.nav.orders"),
            detail: t("dashboard.ordersDetail", { count: orders.length, pending: pendingOrders }),
          },
        ].map((card) => (
          <Link
            key={card.path}
            to={to(card.path)}
            className="group flex items-start justify-between gap-3 border border-wire-rule p-4 transition-colors hover:border-wire-ink"
          >
            <span>
              <card.icon aria-hidden className="h-4 w-4 text-foreground" strokeWidth={1.5} />
              <span className="mt-3 block text-[12px] uppercase tracking-[0.12em] text-foreground">{card.title}</span>
              <span className="mt-1 block text-[11px] text-wire-ink-soft">{card.detail}</span>
            </span>
            <ArrowRight aria-hidden className="h-4 w-4 text-wire-ink-soft transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          title={t("dashboard.progress")}
          className="xl:col-span-2"
          action={
            <Link to={to("my-courses")} className="text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 hover:text-foreground">
              {t("dashboard.seeAll")}
            </Link>
          }
        >
          {courses.length === 0 ? (
            <p className="p-4 text-[12px] text-wire-ink-soft">{t("courses.emptyText")}</p>
          ) : (
            <ul>
              {courses.map((course) => (
                <li key={course.item.slug} className="grid gap-2 border-b border-wire-rule px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_160px] sm:items-center sm:gap-6">
                  <Link
                    to={`${to("courses")}/${course.item.slug}/learn`}
                    className="text-[12px] uppercase tracking-[0.04em] text-foreground hover:underline"
                  >
                    {snapshotTitle(course.item, locale)}
                  </Link>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={course.summary.percent} label={snapshotTitle(course.item, locale)} />
                    <span className="w-9 text-right font-mono text-[11px] text-foreground">{course.summary.percent}%</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title={t("dashboard.recentOrders")}
          action={
            <Link to={to("my-orders")} className="text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 hover:text-foreground">
              {t("dashboard.seeAll")}
            </Link>
          }
        >
          {orders.length === 0 ? (
            <p className="p-4 text-[12px] text-wire-ink-soft">{t("orders.emptyTitle")}</p>
          ) : (
            <ul>
              {orders.slice(0, 3).map((order) => (
                <li key={order.id} className="border-b border-wire-rule last:border-b-0">
                  <Link to={`${to("my-orders")}/${order.id}`} className="block px-4 py-3 transition-colors hover:bg-wire-surface">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] text-foreground">{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </span>
                    <span className="mt-1 flex justify-between gap-3 text-[11px] text-wire-ink-soft">
                      <span>{formatDate(order.createdAt, locale)}</span>
                      <span className="font-mono">{formatPrice(order.total_cents)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {recommended.length > 0 ? (
        <section aria-labelledby="dashboard-recommended">
          <h2 id="dashboard-recommended" className="text-[10px] uppercase tracking-[0.18em] text-foreground">
            {t("dashboard.recommended")}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommended.map((item, index) => (
              <li key={item.slug} className="flex flex-col border border-wire-rule">
                <ProductBox
                  title={snapshotTitle(item, locale)}
                  kicker={t(`catalog.${item.catalog}.filters.${item.category}`)}
                  code={productCode(item.catalog, item.category)}
                  variant={index + 2}
                />
                <div className="flex flex-1 flex-col border-t border-wire-rule p-4">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                    {t(`catalog.${item.catalog}.label`)}
                  </p>
                  <h3 className="mt-1 text-[12px] uppercase leading-snug tracking-[0.04em] text-foreground">
                    {snapshotTitle(item, locale)}
                  </h3>
                  <p className="mt-2 font-mono text-[13px] text-foreground">{formatPrice(item.price_cents)}</p>
                  <div className="mt-auto grid gap-2 pt-4">
                    <Button asChild size="sm">
                      <Link to={`${to("product")}/${item.slug}`}>{t("dashboard.viewProduct")}</Link>
                    </Button>
                    <AddToCartButton product={item} size="sm" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="dashboard-shortcuts" className="border-t border-wire-rule pt-6">
        <h2 id="dashboard-shortcuts" className="text-[10px] uppercase tracking-[0.18em] text-foreground">
          {t("dashboard.shortcuts")}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={to("account")}>
              <Settings aria-hidden strokeWidth={1.5} />
              {t("dashboard.accountSettings")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={to("contact")}>
              <LifeBuoy aria-hidden strokeWidth={1.5} />
              {t("dashboard.support")}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
