import { useTranslation } from "react-i18next";

import { formatDate } from "@/lib/account";

type CertificateSheetProps = {
  studentName: string;
  courseTitle: string;
  instructor: string;
  completionDate: string;
  verificationId: string;
  locale: string;
};

const Seal = ({ label }: { label: string }) => (
  <svg
    viewBox="0 0 120 120"
    aria-hidden
    className="h-14 w-14 text-wire-ink sm:h-[72px] sm:w-[72px]"
  >
    <defs>
      <path id="hisa-seal-top" d="M 17 60 A 43 43 0 0 1 103 60" fill="none" />
      <path
        id="hisa-seal-bottom"
        d="M 103 60 A 43 43 0 0 1 17 60"
        fill="none"
      />
    </defs>
    <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <circle
      cx="60"
      cy="60"
      r="46"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    />
    <text fill="currentColor" fontSize="6.5" letterSpacing="2.1">
      <textPath href="#hisa-seal-top" startOffset="50%" textAnchor="middle">
        HISA ACADEMY
      </textPath>
    </text>
    <text fill="currentColor" fontSize="5.2" letterSpacing="1.3">
      <textPath href="#hisa-seal-bottom" startOffset="50%" textAnchor="middle">
        {label.toUpperCase()}
      </textPath>
    </text>
    <circle
      cx="60"
      cy="60"
      r="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeDasharray="1 3"
    />
    <path
      d="M60 43 l4.2 9.8 10.8 0.9 -8.2 7.2 2.5 10.6 -9.3 -5.8 -9.3 5.8 2.5 -10.6 -8.2 -7.2 10.8 -0.9z"
      fill="currentColor"
      opacity="0.9"
    />
  </svg>
);

/**
 * Printable certificate. Deliberately monochrome and editorial: paper, double
 * rules, typographic hierarchy and a drawn seal, using the site tokens.
 */
export const CertificateSheet = ({
  studentName,
  courseTitle,
  instructor,
  completionDate,
  verificationId,
  locale,
}: CertificateSheetProps) => {
  const { t } = useTranslation();
  const year = new Date(completionDate).getFullYear();

  return (
    <article
      aria-label={t("certificate.title")}
      className="certificate-sheet relative mx-auto w-full max-w-[720px] overflow-hidden border border-wire-rule bg-background text-foreground shadow-[0_18px_50px_-32px_hsl(var(--foreground)/0.5)]"
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      <div className="p-2.5 sm:p-3.5">
        <div className="certificate-frame relative overflow-hidden border border-wire-ink/70 px-5 py-7 sm:px-10 sm:py-11">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-5 top-5 bottom-5 border border-wire-rule/80"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 bg-wire-ink"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-1.5 w-1.5 bg-wire-ink"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-1.5 bg-wire-ink"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 h-1.5 w-1.5 bg-wire-ink"
          />

          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[11rem] font-medium uppercase leading-none tracking-[-0.09em] text-wire-ink/[0.035] sm:text-[16rem]"
          >
            HISA
          </span>

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[15px] font-semibold leading-none tracking-[0.34em] text-foreground">
                  HISA
                </p>
                <p className="mt-1.5 text-[6.5px] uppercase tracking-[0.3em] text-wire-ink-soft">
                  Academy
                </p>
              </div>
              <div className="text-right">
                <p className="text-[6.5px] uppercase tracking-[0.24em] text-wire-ink-soft">
                  {t("certificate.kicker")}
                </p>
                <p className="mt-1 font-mono text-[8px] tracking-[0.12em] text-foreground">
                  {year}
                </p>
              </div>
            </div>

            <div className="mt-9 text-center sm:mt-12">
              <p className="text-[7px] uppercase tracking-[0.34em] text-wire-ink-soft">
                {t("certificate.title")}
              </p>
              <p className="mt-5 text-[7.5px] uppercase tracking-[0.24em] text-wire-ink-soft">
                {t("certificate.presentedTo")}
              </p>
              <p className="mx-auto mt-3 max-w-[18ch] text-[clamp(26px,5vw,46px)] font-medium uppercase leading-[0.95] tracking-[-0.03em] text-foreground">
                {studentName}
              </p>
              <span
                aria-hidden
                className="mx-auto mt-5 block h-px w-14 bg-wire-ink"
              />
              <p className="mt-5 text-[7.5px] uppercase tracking-[0.24em] text-wire-ink-soft">
                {t("certificate.completedCourse")}
              </p>
              <p className="mx-auto mt-3 max-w-[26ch] text-[clamp(14px,2.2vw,21px)] font-medium uppercase leading-[1.2] tracking-[0.015em] text-foreground">
                {courseTitle}
              </p>

            </div>

            <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-end gap-3 sm:mt-14">
              <div>
                <p className="text-[6px] uppercase tracking-[0.2em] text-wire-ink-soft">
                  {t("certificate.completedOn")}
                </p>
                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.06em] text-foreground sm:text-[9px]">
                  {formatDate(completionDate, locale)}
                </p>
                <span aria-hidden className="mt-2 block h-px w-full bg-wire-rule" />
              </div>

              <Seal label={t("certificate.seal")} />

              <div className="text-right">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
                  {instructor}
                </p>
                <p className="mt-1 text-[6px] uppercase tracking-[0.2em] text-wire-ink-soft">
                  {t("certificate.instructor")}
                </p>
                <span aria-hidden className="mt-2 block h-px w-full bg-wire-rule" />
              </div>
            </div>

            <div className="relative mt-8 flex flex-col items-start justify-between gap-2 border-t border-wire-rule pt-3 text-[6px] uppercase tracking-[0.18em] text-wire-ink-soft sm:flex-row sm:items-center">
              <span>{t("certificate.issuedBy")}</span>
              <span className="font-mono normal-case tracking-[0.08em]">
                {t("certificate.verification")}: {verificationId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
