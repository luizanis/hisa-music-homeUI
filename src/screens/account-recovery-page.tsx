import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "@/lib/router-compat";

import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/i18n/routing";

const AccountRecoveryPage = () => {
  const { t } = useTranslation();
  const { to } = useLocale();
  const location = useLocation();

  const next = new URLSearchParams(location.search).get("next");
  const signinHref = next
    ? `${to("signin")}?next=${encodeURIComponent(next)}`
    : to("signin");

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(true);
      return;
    }
    // Wireframe stage: no email is sent, the screen only simulates the flow.
    setError(false);
    setSent(true);
  };

  return (
    <Section innerClassName="py-16 md:py-24">
      <div className="mx-auto max-w-[520px]">
        <SectionLabel label={t("recovery.label")} />

        {sent ? (
          <>
            <span
              aria-hidden
              className="mt-6 flex h-12 w-12 items-center justify-center border border-wire-ink bg-wire-surface text-foreground"
            >
              <MailCheck className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <h1 className="mt-5 text-display-sm font-medium uppercase text-foreground">
              {t("recovery.sent.title")}
            </h1>
            <p className="mt-4 text-[13px] leading-relaxed text-wire-ink-soft">
              {t("recovery.sent.text", { email: email.trim() })}
            </p>

            <div className="mt-5 border border-wire-rule bg-wire-surface px-4 py-3 text-[11px] leading-relaxed text-wire-ink-soft">
              {t("recovery.demoNote")}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to={signinHref}>
                  <ArrowLeft aria-hidden strokeWidth={1.5} />
                  {t("recovery.back")}
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                {t("recovery.changeEmail")}
              </Button>
            </div>
          </>
        ) : (
          <>
            <span
              aria-hidden
              className="mt-6 flex h-12 w-12 items-center justify-center border border-wire-ink bg-wire-surface text-foreground"
            >
              <KeyRound className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <h1 className="mt-5 text-display-sm font-medium uppercase text-foreground">
              {t("recovery.title")}
            </h1>
            <p className="mt-4 text-[13px] leading-relaxed text-wire-ink-soft">
              {t("recovery.lead")}
            </p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="recovery-email"
                  className="text-[10px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
                >
                  {t("recovery.email")}
                </Label>
                <Input
                  id="recovery-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(false);
                  }}
                  className="h-11 border-wire-rule bg-background text-[13px] focus-visible:ring-1 focus-visible:ring-offset-0"
                />
                {error ? (
                  <p role="alert" className="text-[11px] text-destructive">
                    {t("recovery.invalid")}
                  </p>
                ) : null}
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto">
                {t("recovery.submit")}
              </Button>
            </form>

            <div className="mt-4 border border-wire-rule bg-wire-surface px-4 py-3 text-[11px] leading-relaxed text-wire-ink-soft">
              {t("recovery.demoNote")}
            </div>

            <Link
              to={signinHref}
              className="mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
              {t("recovery.back")}
            </Link>
          </>
        )}
      </div>
    </Section>
  );
};

export default AccountRecoveryPage;
