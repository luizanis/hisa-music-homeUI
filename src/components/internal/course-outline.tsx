import { Check, ChevronDown, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ProgressBar } from "@/components/internal/progress-bar";
import type { MockCourse } from "@/data/account";
import { courseLessonCount, coursePercent } from "@/lib/account";
import { pickLocale } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useAccount } from "@/store/account-store";

type CourseOutlineProps = {
  course: MockCourse;
  currentLessonId: string;
  onSelect: (lessonId: string) => void;
};

/** Modules, lesson states and the current lesson, shared by desktop and mobile. */
export const CourseOutline = ({
  course,
  currentLessonId,
  onSelect,
}: CourseOutlineProps) => {
  const { t, i18n } = useTranslation();
  const { lessonProgress } = useAccount();
  const key = pickLocale(i18n.language);

  const lessons = useMemo(
    () =>
      course.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({ ...lesson, moduleId: module.id })),
      ),
    [course],
  );

  const doneIds = useMemo(
    () => new Set(lessonProgress[course.slug] ?? []),
    [course.slug, lessonProgress],
  );

  const total = courseLessonCount(course);
  const done = lessons.filter((lesson) => doneIds.has(lesson.id)).length;
  const percent = coursePercent(course, done);
  const currentIndex = lessons.findIndex(
    (lesson) => lesson.id === currentLessonId,
  );

  const [openModules, setOpenModules] = useState<string[]>(() => {
    const current = lessons[currentIndex];
    return current ? [current.moduleId] : course.modules.map((m) => m.id);
  });

  useEffect(() => {
    const current = lessons.find((lesson) => lesson.id === currentLessonId);
    if (!current) return;
    setOpenModules((open) =>
      open.includes(current.moduleId) ? open : [...open, current.moduleId],
    );
  }, [currentLessonId, lessons]);

  const toggleModule = (moduleId: string) => {
    setOpenModules((open) =>
      open.includes(moduleId)
        ? open.filter((id) => id !== moduleId)
        : [...open, moduleId],
    );
  };

  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-wire-ink-soft">
        {t("player.courseContent")}
      </p>
      <h2 className="mt-2 text-[13px] font-medium uppercase leading-snug tracking-[0.06em] text-foreground">
        {course.title[key]}
      </h2>

      <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
        <span>{t("player.completion", { percent })}</span>
        <span className="font-mono">
          {done}/{total}
        </span>
      </div>
      <ProgressBar value={percent} className="mt-2" />

      <div className="mt-4 border-t border-wire-rule">
        {course.modules.map((module, moduleIndex) => {
          const isOpen = openModules.includes(module.id);
          const moduleDone = module.lessons.filter((lesson) =>
            doneIds.has(lesson.id),
          ).length;

          return (
            <div key={module.id} className="border-b border-wire-rule">
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-2 py-3 text-left"
              >
                <span className="font-mono text-[9px] text-wire-ink-soft">
                  0{moduleIndex + 1}
                </span>
                <span className="flex-1 text-[10px] uppercase tracking-[0.12em] text-foreground">
                  {module.title[key]}
                </span>
                <span className="font-mono text-[9px] text-wire-ink-soft">
                  {moduleDone}/{module.lessons.length}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "h-3.5 w-3.5 text-wire-ink-soft transition-transform",
                    isOpen && "rotate-180",
                  )}
                  strokeWidth={1.5}
                />
              </button>

              {isOpen ? (
                <ul className="pb-2">
                  {module.lessons.map((lesson) => {
                    const index = lessons.findIndex(
                      (entry) => entry.id === lesson.id,
                    );
                    const isCurrent = lesson.id === currentLessonId;
                    const isDone = doneIds.has(lesson.id);

                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(lesson.id)}
                          aria-current={isCurrent ? "true" : undefined}
                          className={cn(
                            "flex w-full items-start gap-2 border-l-2 py-2 pl-2 pr-1 text-left transition-colors",
                            isCurrent
                              ? "border-wire-ink bg-wire-surface"
                              : "border-transparent hover:bg-wire-surface/70",
                          )}
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-wire-rule bg-background">
                            {isDone ? (
                              <Check
                                aria-hidden
                                className="h-2.5 w-2.5"
                                strokeWidth={2.5}
                              />
                            ) : isCurrent ? (
                              <Play
                                aria-hidden
                                className="h-2 w-2 fill-current"
                                strokeWidth={1.5}
                              />
                            ) : null}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block text-[11px] leading-snug",
                                isCurrent
                                  ? "text-foreground"
                                  : "text-wire-ink-soft",
                              )}
                            >
                              <span className="mr-1 font-mono text-[9px] text-wire-ink-soft">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              {lesson.title[key]}
                            </span>
                            <span className="mt-0.5 block font-mono text-[9px] text-wire-ink-soft">
                              {lesson.duration}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
        {t("player.lessonCount", { count: total })}
      </p>
    </div>
  );
};
