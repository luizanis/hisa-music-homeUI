import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { AppLink as Link } from "@/components/site/app-link";
import { Section } from "@/components/site/section";
import { SectionLabel } from "@/components/site/section-label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { localePath, safeNextPath } from "@/i18n/routing";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { translatedHead } from "@/lib/seo";

type Mode = "login" | "signup" | "reset";
type Status = "idle" | "loading" | "error" | "confirm" | "sent";

/** Remembers where to go after the Google round-trip returns to this page. */
const NEXT_STORAGE_KEY = "hisa:auth-next";

export const Route = createFileRoute("/$locale/signin")({
  validateSearch: (search: Record<string, unknown>): { next?: string | undefined } => ({
    next: safeNextPath(search["next"]),
  }),
  head: ({ params }) => ({
    meta: [
      ...translatedHead(params.locale, "auth.login", "auth.lead").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SigninPage,
});

const fieldLabel =
  "text-[10px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft";
const fieldInput =
  "h-11 rounded-[var(--radius)] border-wire-rule bg-background text-[13px] focus-visible:ring-1 focus-visible:ring-offset-0";

function SigninPage() {
  const { t } = useTranslation();
  const { locale } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const nextPath = search.next ?? localePath(locale);

  const [mode, setMode] = useState<Mode | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const goNext = (target: string) => {
    window.sessionStorage.removeItem(NEXT_STORAGE_KEY);
    void navigate({ href: target, replace: true });
  };

  // Returning from Google (or already signed in): continue to the saved destination.
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      const stored = safeNextPath(window.sessionStorage.getItem(NEXT_STORAGE_KEY));
      goNext(search.next ?? stored ?? nextPath);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = (nextMode: Mode) => {
    setMode(nextMode);
    setStatus("idle");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!mode) return;

    setStatus("loading");

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}${localePath(locale, "reset-password")}?next=${encodeURIComponent(nextPath)}`,
      });
      setStatus(error ? "error" : "sent");
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setStatus("error");
        return;
      }
      goNext(nextPath);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}${nextPath}` },
    });

    if (error) {
      setStatus("error");
      return;
    }
    if (!data.session) {
      setStatus("confirm");
      return;
    }
    goNext(nextPath);
  };

  const google = async () => {
    window.sessionStorage.setItem(NEXT_STORAGE_KEY, nextPath);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${localePath(locale, "signin")}`,
    });
    if (result.error) {
      setStatus("error");
      return;
    }
    if (result.redirected) return;
    goNext(nextPath);
  };

  const dialogTitle =
    mode === "signup"
      ? t("auth.signup")
      : mode === "reset"
        ? t("auth.resetTitle")
        : t("auth.login");

  return (
    <Section innerClassName="py-16 md:py-24">
      <div className="mx-auto max-w-[520px]">
        <SectionLabel label={t("auth.login")} />
        <h1 className="mt-5 text-display-sm font-medium uppercase text-foreground">
          {t("auth.title")}
        </h1>
        <p className="mt-5 max-w-[46ch] text-[14px] leading-relaxed text-wire-ink-soft">
          {t("auth.lead")}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => open("login")}>
            {t("auth.login")}
          </Button>
          <Button size="lg" variant="outline" onClick={() => open("signup")}>
            {t("auth.signup")}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => open("reset")}
          className="mt-5 block text-[11px] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("auth.forgot")}
        </button>

        <Link
          to={localePath(locale, "academy")}
          className="mt-8 inline-block text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("auth.back")}
        </Link>
      </div>

      <Dialog
        open={mode !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setMode(null);
        }}
      >
        <DialogContent className="max-w-md gap-0 border-wire-rule bg-background p-6 sm:rounded-[var(--radius)]">
          <DialogTitle className="pr-6 text-[15px] uppercase tracking-[0.1em] text-foreground">
            {dialogTitle}
          </DialogTitle>
          <p className="mt-2 text-[12px] leading-relaxed text-wire-ink-soft">
            {mode === "reset" ? t("auth.resetLead") : t("auth.dialogLead")}
          </p>

          {mode !== "reset" ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="mt-6 w-full"
                onClick={() => void google()}
              >
                {t("auth.google")}
              </Button>

              <div className="my-5 flex items-center gap-3">
                <span aria-hidden className="h-px flex-1 bg-wire-rule" />
                <span className="text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
                  {t("auth.or")}
                </span>
                <span aria-hidden className="h-px flex-1 bg-wire-rule" />
              </div>
            </>
          ) : (
            <div className="mt-6" />
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-email" className={fieldLabel}>
                {t("auth.email")}
              </Label>
              <Input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={fieldInput}
              />
            </div>

            {mode !== "reset" ? (
              <div className="space-y-2">
                <Label htmlFor="auth-password" className={fieldLabel}>
                  {t("auth.password")}
                </Label>
                <Input
                  id="auth-password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={fieldInput}
                />
                <p className="text-[10px] text-wire-ink-soft">{t("auth.note")}</p>
              </div>
            ) : null}

            {status === "error" ? (
              <p role="alert" className="text-[11px] text-destructive">
                {t("auth.error")}
              </p>
            ) : null}
            {status === "confirm" ? (
              <p className="text-[11px] text-wire-ink-soft">{t("auth.checkEmail")}</p>
            ) : null}
            {status === "sent" ? (
              <p role="status" className="text-[11px] text-wire-ink-soft">
                {t("auth.resetSent")}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={status === "loading"}
            >
              {mode === "signup"
                ? t("auth.signup")
                : mode === "reset"
                  ? t("auth.resetSend")
                  : t("auth.login")}
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() => open(mode === "login" ? "signup" : "login")}
              className="text-[11px] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 transition-colors hover:text-foreground"
            >
              {mode === "login" ? t("auth.signup") : t("auth.backToLogin")}
            </button>
            {mode === "login" ? (
              <button
                type="button"
                onClick={() => open("reset")}
                className="text-[11px] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 transition-colors hover:text-foreground"
              >
                {t("auth.forgot")}
              </button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </Section>
  );
}
