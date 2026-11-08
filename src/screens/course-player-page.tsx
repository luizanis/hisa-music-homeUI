import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  Download,
  Play,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "@/lib/router-compat";

import { CourseOutline } from "@/components/internal/course-outline";
import { LessonDiscussion } from "@/components/internal/lesson-discussion";
import { Panel } from "@/components/internal/panel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { courses } from "@/data/account";
import { useLocale } from "@/i18n/routing";
import { courseCode, courseLessonCount } from "@/lib/account";
import { pickLocale } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useAccount } from "@/store/account-store";

const materials = [
  { key: "slides", size: "PDF · 4 MB" },
  { key: "project", size: "ZIP · 38 MB" },
];

const CoursePlayerPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lessonProgress, toggleLesson } = useAccount();
  const [isListOpen, setIsListOpen] = useState(false);
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const key = pickLocale(locale);

  const course = courses.find((entry) => entry.slug === courseId);

  const lessons = useMemo(
    () =>
      course
        ? course.modules.flatMap((module) =>
            module.lessons.map((lesson) => ({
              ...lesson,
              moduleTitle: module.title,
            })),
          )
        : [],
    [course],
  );

  const doneIds = useMemo(
    () => new Set(course ? lessonProgress[course.slug] ?? [] : []),
    [course, lessonProgress],
  );

  const requestedId = searchParams.get("lesson");
  const current =
    lessons.find((lesson) => lesson.id === requestedId) ??
    lessons.find((lesson) => !doneIds.has(lesson.id)) ??
    lessons[0];

  if (!course || !current) {
    return (
      <div className="py-4">
        <p className="text-[13px] text-wire-ink-soft">{t("player.notFound")}</p>
        <Button asChild variant="outline" className="mt-5">
          <Link to={to("my-courses")}>{t("player.back")}</Link>
        </Button>
      </div>
    );
  }

  const currentIndex = lessons.findIndex((lesson) => lesson.id === current.id);
  const previous = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const isDone = doneIds.has(current.id);
  const totalLessons = courseLessonCount(course);
  const doneCount = lessons.filter((lesson) => doneIds.has(lesson.id)).length;
  const isCourseCompleted = totalLessons > 0 && doneCount >= totalLessons;

  const handleToggleLesson = () => {
    const completesCourse = !isDone && doneCount + 1 >= totalLessons;
    toggleLesson(course.slug, current.id);
    if (completesCourse) setIsCelebrationOpen(true);
  };

  const selectLesson = (lessonId: string) => {
    setSearchParams({ lesson: lessonId });
    setIsListOpen(false);
  };

  return (
    <>
      <Link
        to={to("my-courses")}
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
        {t("player.back")}
      </Link>

      {isCourseCompleted ? (
        <div className="mt-5 flex flex-col gap-3 border border-wire-ink bg-wire-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Award
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0"
              strokeWidth={1.5}
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-foreground">
                {t("player.courseCompleted")}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-wire-ink-soft">
                {t("player.courseCompletedText")}
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link to={`${to("certificate")}/${course.slug}`}>
              <Download aria-hidden strokeWidth={1.5} />
              {t("player.downloadCertificate")}
            </Link>
          </Button>
        </div>
      ) : null}

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="order-1 min-w-0 lg:order-2">
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsListOpen((open) => !open)}
              aria-expanded={isListOpen}
              aria-controls="mobile-course-outline"
              className="flex w-full items-center justify-between gap-3 border border-wire-rule bg-background px-4 py-3 text-[9px] uppercase tracking-[0.16em] text-foreground"
            >
              <span>{t("player.lessonList")}</span>
              <span className="flex items-center gap-2 font-mono text-[9px] text-wire-ink-soft">
                {courseLessonCount(course)}
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isListOpen && "rotate-180",
                  )}
                  strokeWidth={1.5}
                />
              </span>
            </button>
            {isListOpen ? (
              <div
                id="mobile-course-outline"
                className="border border-t-0 border-wire-rule bg-background p-4"
              >
                <CourseOutline
                  course={course}
                  currentLessonId={current.id}
                  onSelect={selectLesson}
                />
              </div>
            ) : null}
          </div>

          <div className="sticky top-[88px] hidden lg:block">
            <Panel label={t("player.lessonList")}>
              <CourseOutline
                course={course}
                currentLessonId={current.id}
                onSelect={selectLesson}
              />
            </Panel>
          </div>
        </div>

        <div className="order-2 min-w-0 lg:order-1">
          <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
            <span className="border border-wire-rule px-2 py-1">
              {current.moduleTitle[key]}
            </span>
            <span className="border border-wire-rule px-2 py-1">
              {t("player.lessonNumber", { index: currentIndex + 1 })}
            </span>
            <span className="font-mono">{current.duration}</span>
            {isDone ? (
              <span className="border border-wire-ink px-2 py-1 text-foreground">
                {t("player.completed")}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-[22px] font-medium uppercase leading-tight tracking-[-0.01em] text-foreground sm:text-[26px]">
            {current.title[key]}
          </h1>

          <div
            role="img"
            aria-label={t("player.videoNote")}
            className="relative mt-5 flex aspect-video items-center justify-center overflow-hidden border border-media-line/20 bg-media"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 wire-hatch opacity-[0.06]"
            />
            <div className="relative flex flex-col items-center gap-3 px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center border border-media-line/40 text-media-foreground">
                <Play
                  aria-hidden
                  className="h-4 w-4 fill-current"
                  strokeWidth={1.5}
                />
              </span>
              <p className="max-w-[38ch] text-[10px] uppercase leading-relaxed tracking-[0.16em] text-media-soft">
                {t("player.videoNote")}
              </p>
            </div>
            <span className="absolute bottom-3 left-4 font-mono text-[9px] text-media-soft">
              {courseCode(course)} · {current.duration}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant={isDone ? "outline" : "default"}
              onClick={handleToggleLesson}
            >
              <Check aria-hidden strokeWidth={2} />
              {isDone ? t("player.undoComplete") : t("player.markComplete")}
            </Button>

            <div className="ml-auto flex items-center gap-2">
              {previous ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    to={`${to("courses")}/${course.slug}/learn?lesson=${previous.id}`}
                  >
                    <ArrowLeft aria-hidden strokeWidth={1.5} />
                    {t("player.prev")}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ArrowLeft aria-hidden strokeWidth={1.5} />
                  {t("player.prev")}
                </Button>
              )}

              {next ? (
                <Button asChild size="sm">
                  <Link
                    to={`${to("courses")}/${course.slug}/learn?lesson=${next.id}`}
                  >
                    {t("player.next")}
                    <ArrowRight aria-hidden strokeWidth={1.5} />
                  </Link>
                </Button>
              ) : (
                <Button size="sm" disabled>
                  {t("player.next")}
                  <ArrowRight aria-hidden strokeWidth={1.5} />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <Panel label={t("player.about")}>
              <p className="text-[12px] leading-relaxed text-wire-ink-soft">
                {current.description[key]}
              </p>
              <p className="mt-3 border-t border-wire-rule pt-3 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
                {t("player.instructorLine", { instructor: course.instructor })}
              </p>
            </Panel>

            <Panel label={t("player.materials")} bodyClassName="p-0">
              <ul>
                {materials.map((material) => (
                  <li
                    key={material.key}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-wire-rule px-4 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.06em] text-foreground">
                        {t(`player.material.${material.key}`)}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] text-wire-ink-soft">
                        {material.size}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDownloaded(material.key)}
                    >
                      <Download aria-hidden strokeWidth={1.5} />
                      {t("player.download")}
                    </Button>
                  </li>
                ))}
              </ul>
              <p className="border-t border-wire-rule px-4 py-3 text-[9px] leading-relaxed text-wire-ink-soft">
                {downloaded
                  ? t("library.downloaded")
                  : t("player.materialsNote")}
              </p>
            </Panel>

            <LessonDiscussion lessonId={current.id} />

            <p className="mt-4 px-1 text-[10px] leading-relaxed text-wire-ink-soft">
              <Trans
                i18nKey="discussion.support"
                components={{
                  email: (
                    <a
                      href="mailto:duvidas@hisamusic.com"
                      className="text-foreground underline decoration-wire-rule underline-offset-4 transition-colors hover:decoration-foreground"
                    />
                  ),
                }}
              />
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isCelebrationOpen} onOpenChange={setIsCelebrationOpen}>
        <DialogContent className="max-w-md gap-0 border-wire-rule bg-background p-6 sm:rounded-[var(--radius)]">
          <span
            aria-hidden
            className="flex h-11 w-11 items-center justify-center border border-wire-ink bg-wire-surface text-foreground"
          >
            <Award className="h-5 w-5" strokeWidth={1.25} />
          </span>
          <DialogTitle className="mt-4 pr-6 text-[16px] font-medium uppercase leading-snug tracking-[0.08em] text-foreground">
            {t("player.completedTitle")}
          </DialogTitle>
          <p className="mt-2 text-[12px] leading-relaxed text-wire-ink-soft">
            {t("player.completedText")}
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <Link
                to={`${to("certificate")}/${course.slug}`}
                onClick={() => setIsCelebrationOpen(false)}
              >
                <Download aria-hidden strokeWidth={1.5} />
                {t("player.downloadCertificate")}
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCelebrationOpen(false)}
            >
              {t("player.completedClose")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoursePlayerPage;
