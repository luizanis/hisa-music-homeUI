import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  LibraryBig,
  ReceiptText,
  UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { CourseCover } from "@/components/internal/course-cover";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { ProgressBar } from "@/components/internal/progress-bar";
import { StatusBadge } from "@/components/internal/status-badge";
import { Button } from "@/components/ui/button";
import { courses, libraryItems, recommendations } from "@/data/account";
import { useLocale } from "@/i18n/routing";
import {
  courseCode,
  courseLessonCount,
  coursePercent,
  formatDate,
  orderTotal,
} from "@/lib/account";
import { formatPrice, pickLocale } from "@/lib/catalog";
import { useAccount } from "@/store/account-store";

const DashboardPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { profile, orders, completedCount, cartCount } = useAccount();
  const key = pickLocale(locale);

  const firstName = profile.name.split(" ")[0];
  const activeCourses = [...courses]
    .filter((course) => completedCount(course) < courseLessonCount(course))
    .sort(
      (a, b) =>
        new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime(),
    );
  const course = activeCourses[0] ?? courses[0];
  const done = completedCount(course);
  const percent = coursePercent(course, done);
  const recentOrders = orders.slice(0, 3);

  const shortcuts = [
    {
      path: "my-courses",
      key: "nav.myCourses",
      icon: GraduationCap,
      meta: t("dashboard.profile.courses"),
    },
    {
      path: "my-library",
      key: "nav.myLibrary",
      icon: LibraryBig,
      meta: t("dashboard.profile.library"),
    },
    {
      path: "my-orders",
      key: "nav.myOrders",
      icon: ReceiptText,
      meta: t("dashboard.recent"),
    },
    {
      path: "account",
      key: "nav.account",
      icon: UserRound,
      meta: t("dashboard.profile.title"),
    },
  ];

  return (
    <>
      <PageHeader
        label={t("dashboard.label")}
        title={t("dashboard.hello", { name: firstName })}
        description={t("dashboard.lead")}
        actions={
          <Button asChild variant="outline">
            <Link to={to("account")}>{t("nav.account")}</Link>
          </Button>
        }
      />

      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <Panel
            label={t("dashboard.continue")}
            action={
              <Link
                to={to("my-courses")}
                className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft transition-colors hover:text-foreground"
              >
                {t("dashboard.continue.all")}
                <ArrowRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            }
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to={`${to("courses")}/${course.slug}/learn`}
                className="block w-full shrink-0 sm:w-[180px]"
                aria-label={course.title[key]}
              >
                <CourseCover
                  title={course.title[key]}
                  code={courseCode(course)}
                  variant={course.variant}
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                  {course.instructor} · {course.level[key]}
                </p>
                <h2 className="mt-2 text-[14px] font-medium uppercase leading-snug tracking-[0.04em] text-foreground">
                  <Link
                    to={`${to("courses")}/${course.slug}/learn`}
                    className="hover:underline hover:underline-offset-4"
                  >
                    {course.title[key]}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-wire-ink-soft">
                  {course.description[key]}
                </p>

                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
                    <span>
                      {t("courses.lessons", {
                        done,
                        total: courseLessonCount(course),
                      })}
                    </span>
                    <span className="font-mono">{percent}%</span>
                  </div>
                  <ProgressBar value={percent} className="mt-2" />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button asChild size="sm">
                      <Link to={`${to("courses")}/${course.slug}/learn`}>
                        {t("courses.continue")}
                      </Link>
                    </Button>
                    <span className="text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
                      {t("courses.lastAccessed")}:{" "}
                      {formatDate(course.lastAccessed, locale)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            label={t("dashboard.recent")}
            action={
              <Link
                to={to("my-orders")}
                className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft transition-colors hover:text-foreground"
              >
                {t("dashboard.recent.all")}
                <ArrowRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            }
            bodyClassName="p-0"
          >
            <ul>
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-wire-rule px-4 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-foreground">
                      {order.id}
                    </p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-wire-ink-soft">
                      {formatDate(order.createdAt, locale)} ·{" "}
                      {t(`orders.method.${order.method}`)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-foreground">
                      {formatPrice(orderTotal(order))}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            label={t("dashboard.recommended")}
            action={
              <div className="flex items-center gap-3">
                <Link
                  to={to("academy")}
                  className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft hover:text-foreground"
                >
                  {t("dashboard.recommended.browseAcademy")}
                </Link>
                <Link
                  to={to("sounds")}
                  className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft hover:text-foreground"
                >
                  {t("dashboard.recommended.browseSounds")}
                </Link>
              </div>
            }
            bodyClassName="p-0"
          >
            <ul className="grid sm:grid-cols-3">
              {recommendations.map((item) => (
                <li
                  key={item.slug}
                  className="border-b border-wire-rule last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <Link
                    to={`${to("product")}/${item.slug}`}
                    className="flex h-full flex-col p-4 transition-colors hover:bg-wire-surface"
                  >
                    <p className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                      {item.meta[key]}
                    </p>
                    <p className="mt-2 text-[11px] font-medium uppercase leading-snug tracking-[0.04em] text-foreground">
                      {item.title[key]}
                    </p>
                    <p className="mt-3 font-mono text-[11px] text-foreground">
                      {formatPrice(item.price_cents)}
                    </p>
                    <span className="mt-auto flex items-center gap-1 pt-3 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
                      {t("dashboard.recommended.view")}
                      <ArrowUpRight
                        aria-hidden
                        className="h-3 w-3"
                        strokeWidth={1.5}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <Panel label={t("dashboard.profile.title")}>
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-wire-ink bg-wire-surface text-[13px] font-medium uppercase text-foreground"
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] text-foreground">
                  {profile.name}
                </p>
                <p className="truncate text-[11px] text-wire-ink-soft">
                  {profile.email}
                </p>
              </div>
            </div>

            <dl className="mt-4 space-y-2 border-t border-wire-rule pt-4 text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="uppercase tracking-[0.12em] text-wire-ink-soft">
                  {t("dashboard.profile.member")}
                </dt>
                <dd className="font-mono text-foreground">
                  {formatDate(profile.memberSince, locale)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="uppercase tracking-[0.12em] text-wire-ink-soft">
                  {t("dashboard.profile.courses")}
                </dt>
                <dd className="font-mono text-foreground">{courses.length}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="uppercase tracking-[0.12em] text-wire-ink-soft">
                  {t("dashboard.profile.library")}
                </dt>
                <dd className="font-mono text-foreground">
                  {libraryItems.length}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="uppercase tracking-[0.12em] text-wire-ink-soft">
                  {t("nav.cart")}
                </dt>
                <dd className="font-mono text-foreground">{cartCount}</dd>
              </div>
            </dl>
          </Panel>

          <Panel label={t("dashboard.quick")} bodyClassName="p-0">
            <ul className="grid grid-cols-2">
              {shortcuts.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.path}
                    className={
                      index % 2 === 0
                        ? "border-b border-r border-wire-rule"
                        : "border-b border-wire-rule"
                    }
                  >
                    <Link
                      to={to(item.path)}
                      className="flex h-full flex-col gap-2 p-4 transition-colors hover:bg-wire-surface"
                    >
                      <Icon
                        aria-hidden
                        className="h-4 w-4 text-wire-ink-soft"
                        strokeWidth={1.5}
                      />
                      <span className="text-[10px] uppercase tracking-[0.12em] text-foreground">
                        {t(item.key)}
                      </span>
                      <span className="text-[9px] leading-relaxed text-wire-ink-soft">
                        {item.meta}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel label={t("dashboard.shortcuts")} bodyClassName="p-0">
            <ul>
              {[
                { path: "academy", key: "nav.academy" },
                { path: "sounds", key: "nav.sounds" },
                { path: "contact", key: "nav.contact" },
              ].map((item) => (
                <li key={item.path} className="border-b border-wire-rule last:border-b-0">
                  <Link
                    to={to(item.path)}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft transition-colors hover:bg-wire-surface hover:text-foreground"
                  >
                    {t(item.key)}
                    <ArrowUpRight aria-hidden className="h-3 w-3" strokeWidth={1.5} />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
