import { useTranslation } from "react-i18next";

type BackModule = {
  id: string;
  title: string;
  duration: string;
  lessonCount: number;
};

type CertificateBackProps = {
  studentName: string;
  courseTitle: string;
  duration: string;
  lessonCount: number;
  modules: BackModule[];
  verificationId: string;
};

/**
 * Back of the certificate: workload and a discreet module list, on the same
 * paper frame as the front so the two sides print as a single document.
 */
export const CertificateBack = ({
  studentName,
  courseTitle,
  duration,
  lessonCount,
  modules,
  verificationId,
}: CertificateBackProps) => {
  const { t } = useTranslation();

  return (
    <article
      aria-label={t("certificate.back")}
      className="certificate-sheet certificate-back relative mx-auto flex min-h-[520px] w-full max-w-[720px] flex-col overflow-hidden border border-wire-rule bg-background text-foreground shadow-[0_18px_50px_-32px_hsl(var(--foreground)/0.35)] sm:min-h-[680px]"
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
        <div className="certificate-frame relative flex flex-1 flex-col border border-wire-ink/70 px-5 py-7 sm:px-10 sm:py-11">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[15px] font-semibold leading-none tracking-[0.34em] text-foreground">
                HISA
              </p>
              <p className="mt-1.5 text-[6.5px] uppercase tracking-[0.3em] text-wire-ink-soft">
                Academy
              </p>
            </div>
            <p className="text-right text-[6.5px] uppercase tracking-[0.24em] text-wire-ink-soft">
              {t("certificate.back")}
            </p>
          </div>

          <div className="mt-9">
            <p className="text-[6.5px] uppercase tracking-[0.3em] text-wire-ink-soft">
              {t("certificate.contentSummary")}
            </p>
            <h2 className="mt-2 text-[clamp(13px,2vw,17px)] font-medium uppercase leading-snug tracking-[0.04em] text-foreground">
              {courseTitle}
            </h2>
            <p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-wire-ink-soft">
              {studentName}
            </p>
          </div>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-y border-wire-rule py-3">
            <div className="flex items-baseline gap-2">
              <dt className="text-[6px] uppercase tracking-[0.18em] text-wire-ink-soft">
                {t("certificate.duration")}
              </dt>
              <dd className="font-mono text-[9px] text-foreground">{duration}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-[6px] uppercase tracking-[0.18em] text-wire-ink-soft">
                {t("certificate.modules")}
              </dt>
              <dd className="font-mono text-[9px] text-foreground">
                {modules.length}
              </dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-[6px] uppercase tracking-[0.18em] text-wire-ink-soft">
                {t("certificate.lessons")}
              </dt>
              <dd className="font-mono text-[9px] text-foreground">
                {lessonCount}
              </dd>
            </div>
          </dl>

          <p className="mt-5 text-[6px] uppercase tracking-[0.24em] text-wire-ink-soft">
            {t("certificate.content")}
          </p>

          <ol className="mt-2">
            {modules.map((module, index) => (
              <li
                key={module.id}
                className="flex items-baseline gap-3 border-b border-wire-rule py-2 last:border-b-0"
              >
                <span className="w-5 shrink-0 font-mono text-[8px] text-wire-ink-soft">
                  0{index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] uppercase leading-snug tracking-[0.08em] text-foreground">
                    {module.title}
                  </p>
                  <p className="mt-0.5 text-[7px] uppercase tracking-[0.12em] text-wire-ink-soft">
                    {t("certificate.lessonCount", {
                      count: module.lessonCount,
                    })}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[8px] text-wire-ink-soft">
                  {module.duration}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-auto flex flex-col gap-1 border-t border-wire-rule pt-3 text-[6px] uppercase tracking-[0.18em] text-wire-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <span>{t("certificate.issuedBy")}</span>
            <span className="font-mono normal-case tracking-[0.08em]">
              {t("certificate.verification")}: {verificationId}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
