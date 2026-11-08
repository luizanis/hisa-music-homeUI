import {
  ArrowLeft,
  Award,
  Download,
  Printer,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "@/lib/router-compat";

import { CertificateBack } from "@/components/internal/certificate-back";
import { CertificateSheet } from "@/components/internal/certificate-sheet";
import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { ProgressBar } from "@/components/internal/progress-bar";
import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/account";
import { useLocale } from "@/i18n/routing";
import {
  certificateId,
  courseDurationSeconds,
  courseLessonCount,
  formatDate,
  formatDuration,
  moduleDurationSeconds,
} from "@/lib/account";
import { pickLocale } from "@/lib/catalog";
import { useAccount } from "@/store/account-store";

const CertificatePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const { profile, completedCount, completionDates } = useAccount();
  const [downloaded, setDownloaded] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const key = pickLocale(locale);
  const course = courses.find((entry) => entry.slug === courseId);

  if (!course) {
    return (
      <Section innerClassName="py-16">
        <div className="mx-auto max-w-[520px]">
          <p className="text-[13px] text-wire-ink-soft">
            {t("certificate.notFound")}
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link to={to("my-courses")}>{t("certificate.backToCourses")}</Link>
          </Button>
        </div>
      </Section>
    );
  }

  const total = courseLessonCount(course);
  const done = completedCount(course);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const eligible = total > 0 && done >= total;

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    const payload = {
      title: t("certificate.title"),
      text: `${profile.name} · ${course.title[key]} · ${certificateId(
        course,
        profile.name,
      )}`,
      url,
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(payload);
        return;
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
    } catch {
      setShareStatus("error");
    }
  };

  if (!eligible) {
    return (
      <Section innerClassName="py-10 md:py-14">
        <div className="mx-auto max-w-[760px]">
          <Link
            to={to("my-courses")}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t("certificate.backToCourses")}
          </Link>

          <div className="mt-6">
            <PageHeader
              label={t("certificate.label")}
              title={t("certificate.pageTitle")}
              description={t("certificate.pageLead")}
            />
          </div>

          <Panel label={t("certificate.notEligible.label")} className="mt-6">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-wire-rule bg-wire-surface text-wire-ink-soft"
              >
                <Award className="h-4 w-4" strokeWidth={1.25} />
              </span>
              <div>
                <p className="text-[12px] uppercase tracking-[0.12em] text-foreground">
                  {t("certificate.notEligible.title")}
                </p>
                <p className="mt-2 max-w-[54ch] text-[12px] leading-relaxed text-wire-ink-soft">
                  {t("certificate.notEligible.text")}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-wire-rule pt-4">
              <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.14em] text-wire-ink-soft">
                <span>{t("courses.lessons", { done, total })}</span>
                <span className="font-mono">{percent}%</span>
              </div>
              <ProgressBar value={percent} className="mt-2" />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button asChild>
                <Link to={`${to("courses")}/${course.slug}/learn`}>
                  {t("certificate.notEligible.cta")}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={to("my-courses")}>
                  {t("certificate.backToCourses")}
                </Link>
              </Button>
            </div>
          </Panel>
        </div>
      </Section>
    );
  }

  const completionDate = completionDates[course.slug] ?? course.lastAccessed;
  const verificationId = certificateId(course, profile.name);
  const duration = formatDuration(courseDurationSeconds(course));
  const backModules = course.modules.map((module) => ({
    id: module.id,
    title: module.title[key],
    duration: formatDuration(moduleDurationSeconds(module)),
    lessonCount: module.lessons.length,
  }));

  return (
    <Section
      className="print:border-0"
      innerClassName="py-10 md:py-14 print:py-0"
    >
      <div className="mx-auto max-w-[1060px]">
        <Link
          to={to("my-courses")}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft transition-colors hover:text-foreground print:hidden"
        >
          <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t("certificate.backToCourses")}
        </Link>

        <div className="mt-5 print:hidden">
          <PageHeader
            label={t("certificate.label")}
            title={t("certificate.pageTitle")}
            description={t("certificate.pageLead")}
            actions={
              <span className="inline-flex items-center gap-2 border border-wire-ink px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-foreground">
                <Award aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
                {t("certificate.eligible")}
              </span>
            }
          />
        </div>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_286px]">
          <div className="min-w-0">
            <CertificateSheet
              studentName={profile.name}
              courseTitle={course.title[key]}
              instructor={course.instructor}
              completionDate={completionDate}
              verificationId={verificationId}
              locale={locale}
            />

            <div className="mt-6 flex items-center gap-3 print:hidden">
              <span aria-hidden className="h-px flex-1 bg-wire-rule" />
              <span className="shrink-0 text-[9px] uppercase tracking-[0.18em] text-wire-ink-soft">
                {t("certificate.back")}
              </span>
              <span aria-hidden className="h-px flex-1 bg-wire-rule" />
            </div>

            <div className="mt-6 print:mt-0">
              <CertificateBack
                studentName={profile.name}
                courseTitle={course.title[key]}
                duration={duration}
                lessonCount={total}
                modules={backModules}
                verificationId={verificationId}
              />
            </div>
          </div>

          <aside className="flex flex-col gap-4 print:hidden">
            <Panel label={t("certificate.actions")}>
              <div className="flex flex-col gap-2">
                <Button onClick={() => setDownloaded(true)}>
                  <Download aria-hidden strokeWidth={1.5} />
                  {t("certificate.download")}
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer aria-hidden strokeWidth={1.5} />
                  {t("certificate.print")}
                </Button>
                <Button variant="outline" onClick={() => void share()}>
                  <Share2 aria-hidden strokeWidth={1.5} />
                  {t("certificate.share")}
                </Button>
              </div>

              {downloaded ? (
                <p
                  role="status"
                  className="mt-3 border border-wire-rule bg-wire-surface px-3 py-2 text-[10px] leading-relaxed text-wire-ink-soft"
                >
                  {t("certificate.downloaded")}
                </p>
              ) : null}

              {shareStatus === "copied" ? (
                <p role="status" className="mt-3 text-[10px] leading-relaxed text-wire-ink-soft">
                  {t("certificate.shareCopied")}
                </p>
              ) : null}
              {shareStatus === "error" ? (
                <p role="alert" className="mt-3 text-[10px] leading-relaxed text-destructive">
                  {t("certificate.shareError")}
                </p>
              ) : null}

              <p className="mt-3 border-t border-wire-rule pt-3 text-[9px] leading-relaxed text-wire-ink-soft">
                {t("certificate.printNote")}
              </p>
            </Panel>

            <Panel label={t("certificate.verification")}>
              <p className="break-all font-mono text-[11px] leading-relaxed text-foreground">
                {verificationId}
              </p>
              <p className="mt-2 text-[10px] leading-relaxed text-wire-ink-soft">
                {t("certificate.verifyNote")}
              </p>
            </Panel>

            <Panel label={t("certificate.details")} bodyClassName="p-0">
              <dl>
                {[
                  { label: t("certificate.student"), value: profile.name },
                  { label: t("certificate.course"), value: course.title[key] },
                  { label: t("certificate.instructor"), value: course.instructor },
                  {
                    label: t("certificate.completedOn"),
                    value: formatDate(completionDate, locale),
                  },
                  { label: t("certificate.duration"), value: duration },
                  {
                    label: t("certificate.progress"),
                    value: `${done}/${total} · ${percent}%`,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-wire-rule px-4 py-3 last:border-b-0"
                  >
                    <dt className="text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
                      {row.label}
                    </dt>
                    <dd className="max-w-[62%] text-right text-[10px] leading-relaxed text-foreground">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </aside>
        </div>

        <p className="mt-5 border-t border-wire-rule pt-4 text-[10px] leading-relaxed text-wire-ink-soft print:hidden">
          {t("certificate.simulated")}
        </p>
      </div>
    </Section>
  );
};

export default CertificatePage;
