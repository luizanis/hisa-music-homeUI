import type { MockCourse, MockModule, MockOrder } from "@/data/account";
import { totalLessons } from "@/data/account";

/** Formatted date, e.g. "30 out 2026" / "Oct 30, 2026". */
export const formatDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  })
    .format(new Date(iso))
    .replace(".", "");

export const formatDateTime = (iso: string, locale: string) => {
  const time = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
  return `${formatDate(iso, locale)} · ${time}`;
};

export const orderTotal = (order: MockOrder) =>
  order.items.reduce((total, item) => total + item.price_cents, 0) -
  order.discount_cents;

export const orderSubtotal = (order: MockOrder) =>
  order.items.reduce((total, item) => total + item.price_cents, 0);

export const courseLessonCount = (course: MockCourse) =>
  totalLessons(course.modules);

/** Human readable duration used by certificates and course summaries. */
export const formatDuration = (seconds: number) => {
  const minutes = Math.max(0, Math.round(seconds / 60));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest} min`;
  return rest > 0 ? `${hours}h ${rest}min` : `${hours}h`;
};

export const moduleDurationSeconds = (module: MockModule) =>
  module.lessons.reduce((total, lesson) => {
    const [minutes, seconds] = lesson.duration.split(":").map(Number);
    return total + (minutes || 0) * 60 + (seconds || 0);
  }, 0);

export const courseDurationSeconds = (course: MockCourse) =>
  course.modules.reduce(
    (total, module) => total + moduleDurationSeconds(module),
    0,
  );

export const coursePercent = (course: MockCourse, done: number) => {
  const total = courseLessonCount(course);
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
};

export const courseStatus = (
  course: MockCourse,
  done: number,
): "notStarted" | "inProgress" | "completed" => {
  if (done === 0) return "notStarted";
  if (done >= courseLessonCount(course)) return "completed";
  return "inProgress";
};

/** Stable short code used on the abstract course covers. */
export const courseCode = (course: MockCourse) =>
  `AC-${course.slug.slice(0, 3).toUpperCase()}`;

/**
 * Stable mock verification code for a certificate. Real issuance would come
 * from the backend, this keeps the same code for the same student and course.
 */
export const certificateId = (course: MockCourse, studentName: string) => {
  const source = `${course.slug}:${studentName.trim().toLowerCase()}`;
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) % 0xfffffff;
  }
  const suffix = hash
    .toString(36)
    .toUpperCase()
    .padStart(5, "0")
    .slice(0, 5);
  return `HISA-CERT-${course.slug.slice(0, 3).toUpperCase()}-${suffix}`;
};

export const categoryLabelKey = (
  catalog: "academy" | "sounds",
  category: string,
) => `catalog.${catalog}.filters.${category}`;
