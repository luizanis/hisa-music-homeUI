import { ArrowRight, Award, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { CourseCover } from "@/components/internal/course-cover";
import { EmptyState } from "@/components/internal/empty-state";
import { PageHeader } from "@/components/internal/page-header";
import { ProgressBar } from "@/components/internal/progress-bar";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/account";
import { useLocale } from "@/i18n/routing";
import {
  courseCode,
  courseLessonCount,
  coursePercent,
  courseStatus,
  formatDate,
} from "@/lib/account";
import { pickLocale } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useAccount } from "@/store/account-store";

type Filter = "all" | "inProgress" | "completed" | "notStarted";

const filters: Filter[] = ["all", "inProgress", "completed", "notStarted"];

const statusStyles: Record<string, string> = {
  completed: "border-wire-ink text-foreground",
  inProgress: "border-wire-ink-soft text-wire-ink-soft",
  notStarted: "border-wire-rule text-wire-ink-soft",
};

const MyCoursesPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { completedCount } = useAccount();
  const [filter, setFilter] = useState<Filter>("all");
  const key = pickLocale(locale);

  const entries = courses.map((course) => {
    const done = completedCount(course);
    const total = courseLessonCount(course);
    return {
      course,
      done,
      total,
      percent: coursePercent(course, done),
      status: courseStatus(course, done),
    };
  });

  const visible = entries.filter(
    (entry) => filter === "all" || entry.status === filter,
  );

  return (
    <>
      <PageHeader
        label={t("courses.label")}
        title={t("courses.title")}
        description={t("courses.lead")}
        actions={
          <Button asChild variant="outline">
            <Link to={to("academy")}>
              {t("courses.browse")}
              <ArrowRight aria-hidden strokeWidth={1.5} />
            </Link>
          </Button>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {filters.map((item) => {
          const count =
            item === "all"
              ? entries.length
              : entries.filter((entry) => entry.status === item).length;
          const active = filter === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-2 border px-3 py-2 text-[9px] uppercase tracking-[0.16em] transition-colors",
                active
                  ? "border-wire-ink bg-primary text-primary-foreground"
                  : "border-wire-rule text-wire-ink-soft hover:border-wire-ink-soft hover:text-foreground",
              )}
            >
              {t(`courses.tabs.${item}`)}
              <span
                className={cn(
                  "font-mono text-[9px]",
                  active ? "text-primary-foreground/70" : "text-wire-ink-soft",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={GraduationCap}
            title={t("courses.empty.title")}
            text={t("courses.empty.text")}
          >
            <Button asChild>
              <Link to={to("academy")}>
                {t("courses.empty.cta")}
                <ArrowRight aria-hidden strokeWidth={1.5} />
              </Link>
            </Button>
            {filter !== "all" ? (
              <Button variant="outline" onClick={() => setFilter("all")}>
                {t("courses.tabs.all")}
              </Button>
            ) : null}
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {visible.map(({ course, done, total, percent, status }) => (
            <li key={course.slug}>
              <article className="flex flex-col gap-4 border border-wire-rule bg-background p-4 transition-colors hover:border-wire-ink-soft/60 sm:flex-row sm:p-5">
                <Link
                  to={`${to("courses")}/${course.slug}/learn`}
                  className="block w-full shrink-0 sm:w-[190px]"
                  aria-label={course.title[key]}
                >
                  <CourseCover
                    title={course.title[key]}
                    code={courseCode(course)}
                    variant={course.variant}
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-[0.16em] text-wire-ink-soft">
                        {t("courses.instructor")}: {course.instructor} ·{" "}
                        {course.level[key]}
                      </p>
                      <h2 className="mt-2 text-[14px] font-medium uppercase leading-snug tracking-[0.04em] text-foreground">
                        <Link
                          to={`${to("courses")}/${course.slug}/learn`}
                          className="hover:underline hover:underline-offset-4"
                        >
                          {course.title[key]}
                        </Link>
                      </h2>
                      <p className="mt-2 max-w-[62ch] text-[12px] leading-relaxed text-wire-ink-soft">
                        {course.description[key]}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "shrink-0 border px-2 py-1 text-[9px] uppercase tracking-[0.16em]",
                        statusStyles[status],
                      )}
                    >
                      {t(`courses.status.${status}`)}
                    </span>
                  </div>

                  <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <div>
                      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
                        <span>{t("courses.lessons", { done, total })}</span>
                        <span className="font-mono">{percent}%</span>
                      </div>
                      <ProgressBar value={percent} className="mt-2" />
                      <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
                        {t("courses.lastAccessed")}:{" "}
                        {formatDate(course.lastAccessed, locale)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {status === "completed" ? (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          <Link to={`${to("certificate")}/${course.slug}`}>
                            <Award aria-hidden strokeWidth={1.5} />
                            {t("courses.certificate")}
                          </Link>
                        </Button>
                      ) : null}
                      <Button asChild size="sm" className="w-full sm:w-auto">
                        <Link to={`${to("courses")}/${course.slug}/learn`}>
                          {t(`courses.action.${status}`)}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MyCoursesPage;
