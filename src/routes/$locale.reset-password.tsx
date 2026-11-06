import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { AppLink as Link } from "@/components/site/app-link";
import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { localePath, safeNextPath } from "@/i18n/routing";
import { supabase } from "@/integrations/supabase/client";
import { translatedHead } from "@/lib/seo";

type LinkState = "checking" | "ready" | "invalid";

/**
 * Landing page for the email link sent from "Forgot your password or first
 * time here?". The link signs the visitor in for recovery; here they choose
 * a new password. Accounts moved from the previous site use this same step.
 */
export const Route = createFileRoute("/$locale/reset-password")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { next?: string | undefined } => ({
    next: safeNextPath(search["next"]),
  }),
  head: ({ params }) => ({
    meta: [
      ...translatedHead(params.locale, "auth.resetTitle", "auth.resetLead").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { t } = useTranslation();
  const { locale } = Route.useParams();
  const { next } = Route.useSearch();
  const navigate = useNavigate();

  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");

  useEffect(() => {
    let settled = false;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) {
        settled = true;
        setLinkState("ready");
      }
    });
    void supabase.auth.getSession().then(({ data: current }) => {
      if (current.session) {
        settled = true;
        setLinkState("ready");
      }
    });
    // The recovery token in the link is exchanged right after load.
    const timer = window.setTimeout(() => {
      if (!settled) setLinkState("invalid");
    }, 4000);

    return () => {
      window.clearTimeout(timer);
      data.subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    const { error } = await supabase.auth.updateUser({ password });
    setStatus(error ? "error" : "done");
  };

  return (
    <Section innerClassName="py-16 md:py-24">
      <div className="mx-auto max-w-[520px]">
        <SectionLabel label={t("auth.resetTitle")} />
        <h1 className="mt-5 text-display-sm font-medium uppercase text-foreground">
          {t("auth.resetTitle")}
        </h1>

        {linkState === "checking" ? (
          <p className="mt-6 text-[13px] text-wire-ink-soft">{t("auth.resetChecking")}</p>
        ) : null}

        {linkState === "invalid" ? (
          <div className="mt-6">
            <p className="max-w-[46ch] text-[13px] leading-relaxed text-wire-ink-soft">
              {t("auth.resetInvalid")}
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to={localePath(locale, "signin")}>{t("auth.backToLogin")}</Link>
            </Button>
          </div>
        ) : null}

        {linkState === "ready" && status === "done" ? (
          <div className="mt-6">
            <p role="status" className="text-[13px] text-foreground">
              {t("auth.resetDone")}
            </p>
            <Button
              size="lg"
              className="mt-6"
              onClick={() => void navigate({ href: next ?? localePath(locale), replace: true })}
            >
              {t("auth.continue")}
            </Button>
          </div>
        ) : null}

        {linkState === "ready" && status !== "done" ? (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="text-[10px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
              >
                {t("auth.newPassword")}
              </Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-[var(--radius)] border-wire-rule bg-background text-[13px] focus-visible:ring-1 focus-visible:ring-offset-0"
              />
              <p className="text-[10px] text-wire-ink-soft">{t("auth.note")}</p>
            </div>
            {status === "error" ? (
              <p role="alert" className="text-[11px] text-destructive">
                {t("auth.error")}
              </p>
            ) : null}
            <Button type="submit" size="lg" className="w-full" disabled={status === "saving"}>
              {t("auth.resetSave")}
            </Button>
          </form>
        ) : null}
      </div>
    </Section>
  );
}
