import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ProductBox } from "@/components/catalog/product-box";
import {
  CourseStatusBadge,
  EmptyState,
  FilterChips,
  PageHeader,
  ProgressBar,
  formatDate,
} from "@/components/member/member-ui";
import { AppLink as Link } from "@/components/site/app-link";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/routing";
import { productCode, snapshotTitle } from "@/lib/cart";
import { pickLocale } from "@/lib/catalog";
import { useLibrary, type CourseStatus } from "@/lib/member-store";
import { translatedHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/_member/my-courses")({
  head: ({ params }) => ({
    meta: [
      ...translatedHead(params.locale, "member.nav.courses", "courses.lead").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyCoursesPage,
});

const filters = ["all", "inProgress", "notStarted", "completed"] as const;
type Filter = (typeof filters)[number];

function MyCoursesPage() {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { courses } = useLibrary();
  const [filter, setFilter] = useState<Filter>("all");
  const lang = pickLocale(locale);

  const visible = filter === "all" ? courses : courses.filter((course) => course.summary.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        label={t("member.group.learning")}
        title={t("member.nav.courses")}
        lead={t("courses.lead")}
        actions={
          <Button asChild variant="outline">
            <Link to={to("academy")}>{t("courses.browseAcademy")}</Link>
          </Button>
        }
      />

      {courses.length === 0 ? (
        <EmptyState title={t("courses.emptyTitle")} text={t("courses.emptyText")}>
          <Button asChild>
            <Link to={to("academy")}>{t("courses.browseAcademy")}</Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FilterChips
              options={filters}
              value={filter}
              onChange={setFilter}
              label={t("courses.filterLabel")}
              renderLabel={(option) => (option === "all" ? t("courses.all") : t(`courseStatus.${option as CourseStatus}`))}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-wire-ink-soft">
              {visible.length} / {courses.length}
            </span>
          </div>

          {visible.length === 0 ? (
            <EmptyState title={t("courses.noMatch")} />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {visible.map((course, index) => {
                const title = snapshotTitle(course.item, locale);
                const { summary } = course;
                const learnHref = `${to("courses")}/${course.item.slug}/learn${
                  summary.nextLesson ? `?lesson=${summary.nextLesson.id}` : ""
                }`;
                return (
                  <li key={course.item.slug} className="flex flex-col border border-wire-rule">
                    <ProductBox
                      title={title}
                      kicker={t(`catalog.academy.filters.${course.item.category}`)}
                      code={productCode("academy", course.item.category)}
                      variant={index}
                    />
                    <div className="flex flex-1 flex-col border-t border-wire-rule p-4 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <CourseStatusBadge status={summary.status} />
                        <span className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                          {t(`catalog.academy.filters.${course.item.category}`)} · {t(`courses.level.${course.curriculum.level}`)}
                        </span>
                      </div>
                      <h2 className="mt-3 text-[14px] font-medium uppercase leading-snug tracking-[0.04em] text-foreground">
                        {title}
                      </h2>
                      <p className="mt-2 text-[12px] leading-relaxed text-wire-ink-soft">
                        {t("courses.description", {
                          modules: course.curriculum.modules.length,
                          lessons: summary.total,
                        })}
                      </p>
                      <p className="mt-3 flex items-center gap-2 text-[11px] text-foreground">
                        <span aria-hidden className="flex h-6 w-6 items-center justify-center bg-primary text-[9px] text-primary-foreground">H</span>
                        {t("courses.instructor")}
                      </p>

                      <div className="mt-4">
                        <div className="mb-2 flex justify-between text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
                          <span>{t("courses.lessonsCount", { done: summary.done, total: summary.total })}</span>
                          <span className="font-mono text-foreground">{summary.percent}%</span>
                        </div>
                        <ProgressBar value={summary.percent} label={`${t("courses.progress")}: ${title}`} />
                      </div>

                      <p className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-wire-ink-soft">
                        <Clock aria-hidden className="h-3 w-3" strokeWidth={1.5} />
                        {course.progress?.lastAccessed
                          ? t("courses.lastAccessed", { date: formatDate(course.progress.lastAccessed, locale) })
                          : t("courses.neverOpened")}
                      </p>
                      {summary.nextLesson && summary.status !== "completed" ? (
                        <p className="mt-1 text-[11px] text-wire-ink-soft">
                          {t("dashboard.nextLesson")}: {summary.nextLesson.title[lang]}
                        </p>
                      ) : null}

                      <div className="mt-auto pt-5">
                        <Button asChild className="w-full" variant={summary.status === "completed" ? "outline" : "default"}>
                          <Link to={learnHref}>
                            {summary.status === "notStarted"
                              ? t("courses.start")
                              : summary.status === "completed"
                                ? t("courses.review")
                                : t("courses.continue")}
                            <ArrowRight aria-hidden strokeWidth={1.5} />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
