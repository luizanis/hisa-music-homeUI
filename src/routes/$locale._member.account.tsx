import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { PageHeader, Panel, SummaryRow, formatDate } from "@/components/member/member-ui";
import { AppLink as Link } from "@/components/site/app-link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { languageOptions } from "@/i18n/config";
import { localePath, useLocale } from "@/i18n/routing";
import { supabase } from "@/integrations/supabase/client";
import {
  demoActions,
  notificationStore,
  profileStore,
  useDemoMode,
  useNotificationPrefs,
  useProfile,
  type NotificationPrefs,
} from "@/lib/member-store";
import { translatedHead } from "@/lib/seo";
import { displayName, initialsOf, signInProvider } from "@/lib/session";
import { cn } from "@/lib/utils";

const tabs = ["profile", "details", "security", "language", "notifications", "manage"] as const;
type Tab = (typeof tabs)[number];

export const Route = createFileRoute("/$locale/_member/account")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab | undefined } => ({
    tab: tabs.includes(search["tab"] as Tab) ? (search["tab"] as Tab) : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      ...translatedHead(params.locale, "member.nav.account", "account.lead").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const fieldLabel = "text-[10px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft";
const fieldInput =
  "h-11 rounded-[var(--radius)] border-wire-rule bg-background text-[13px] focus-visible:ring-1 focus-visible:ring-offset-0";

const Saved = ({ show, children }: { show: boolean; children: ReactNode }) =>
  show ? (
    <p role="status" className="text-[11px] text-foreground">
      {children}
    </p>
  ) : null;

/** Clears a "saved" flag a few seconds after it appears. */
const useFlash = () => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return;
    const timer = window.setTimeout(() => setOn(false), 3000);
    return () => window.clearTimeout(timer);
  }, [on]);
  return [on, () => setOn(true), () => setOn(false)] as const;
};

function ProfileSection() {
  const { t } = useTranslation();
  const { user } = Route.useRouteContext();
  const profile = useProfile();
  const name = displayName(user, profile);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftAvatar, setDraftAvatar] = useState<string | null>(profile.avatar);
  const [saved, flashSaved] = useFlash();
  const [error, setError] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDraftName(name);
    setDraftAvatar(profile.avatar);
    setEditing(true);
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setError(true);
      return;
    }
    setError(false);
    const reader = new FileReader();
    reader.onload = () => setDraftAvatar(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!draftName.trim()) return;
    profileStore.set({ name: draftName.trim(), avatar: draftAvatar });
    setEditing(false);
    flashSaved();
  };

  const avatar = editing ? draftAvatar : profile.avatar;

  return (
    <Panel title={t("account.tab.profile")}>
      <form onSubmit={save} className="space-y-5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-primary text-[16px] font-medium text-primary-foreground">
            {avatar ? <img src={avatar} alt={t("account.avatarAlt")} className="h-full w-full object-cover" /> : initialsOf(editing ? draftName : name)}
          </span>
          {editing ? (
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="sr-only"
                id="avatar-upload"
                onChange={(event) => onFile(event.target.files?.[0])}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
                {t("account.uploadPhoto")}
              </Button>
              {draftAvatar ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => setDraftAvatar(null)}>
                  {t("account.removePhoto")}
                </Button>
              ) : null}
              <p className={cn("w-full text-[10px]", error ? "text-destructive" : "text-wire-ink-soft")} role={error ? "alert" : undefined}>
                {error ? t("account.photoError") : t("account.photoHint")}
              </p>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="account-name" className={fieldLabel}>{t("account.name")}</Label>
            {editing ? (
              <Input id="account-name" required maxLength={80} value={draftName} onChange={(event) => setDraftName(event.target.value)} className={fieldInput} autoComplete="name" />
            ) : (
              <p id="account-name" className="flex h-11 items-center text-[13px] text-foreground">{name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-email" className={fieldLabel}>{t("auth.email")}</Label>
            <p id="account-email" className="flex h-11 items-center text-[13px] text-foreground">{user.email}</p>
            <p className="text-[10px] text-wire-ink-soft">{t("account.emailNote")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-wire-rule pt-4">
          {editing ? (
            <>
              <Button type="submit" disabled={!draftName.trim()}>{t("account.save")}</Button>
              <Button type="button" variant="outline" onClick={() => { setEditing(false); setError(false); }}>
                {t("account.cancel")}
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" onClick={startEdit}>{t("account.edit")}</Button>
          )}
          <Saved show={saved}>{t("account.saved")}</Saved>
        </div>
      </form>
    </Panel>
  );
}

function DetailsSection() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { user } = Route.useRouteContext();
  return (
    <Panel title={t("account.tab.details")}>
      <div className="px-4 py-3 sm:px-5">
        <SummaryRow label={t("account.memberSince")} value={user.created_at ? formatDate(user.created_at, locale) : "—"} />
        <SummaryRow label={t("account.accountId")} value={user.id.slice(0, 8).toUpperCase()} />
        <SummaryRow label={t("account.signInMethod")} value={t(`account.provider.${signInProvider(user)}`)} />
        <SummaryRow label={t("account.lastSignIn")} value={user.last_sign_in_at ? formatDate(user.last_sign_in_at, locale, true) : "—"} />
      </div>
    </Panel>
  );
}

function SecuritySection() {
  const { t } = useTranslation();
  const { to } = useLocale();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "mismatch" | "done">("idle");
  const [othersOut, flashOthersOut] = useFlash();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (next !== confirm) {
      setStatus("mismatch");
      return;
    }
    setStatus("saving");
    window.setTimeout(() => {
      setStatus("done");
      setCurrent("");
      setNext("");
      setConfirm("");
    }, 700);
  };

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setStatus("idle");
  };

  return (
    <div className="space-y-4">
      <Panel title={t("account.changePassword")}>
        <form onSubmit={submit} className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["current-password", t("account.currentPassword"), current, setCurrent, "current-password"],
              ["new-password", t("auth.newPassword"), next, setNext, "new-password"],
              ["confirm-password", t("account.confirmPassword"), confirm, setConfirm, "new-password"],
            ].map(([id, label, value, setter, autoComplete]) => (
              <div key={id as string} className="space-y-2">
                <Label htmlFor={id as string} className={fieldLabel}>{label as string}</Label>
                <Input
                  id={id as string}
                  type="password"
                  required
                  minLength={6}
                  autoComplete={autoComplete as string}
                  value={value as string}
                  onChange={(event) => {
                    (setter as (v: string) => void)(event.target.value);
                    if (status !== "saving") setStatus("idle");
                  }}
                  className={fieldInput}
                />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-wire-ink-soft">{t("auth.note")}</p>
          {status === "mismatch" ? <p role="alert" className="text-[11px] text-destructive">{t("account.passwordMismatch")}</p> : null}
          <Saved show={status === "done"}>{t("account.passwordSaved")}</Saved>
          <div className="flex flex-wrap items-center gap-3 border-t border-wire-rule pt-4">
            <Button type="submit" disabled={status === "saving"}>{t("account.updatePassword")}</Button>
            <Button type="button" variant="outline" onClick={reset}>{t("account.cancel")}</Button>
            <Link to={to("forgot-password")} className="text-[11px] text-wire-ink-soft underline decoration-wire-rule underline-offset-4 hover:text-foreground">
              {t("forgot.link")}
            </Link>
          </div>
        </form>
      </Panel>

      <Panel title={t("account.sessions")}>
        <div className="space-y-3 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 border border-wire-rule px-3 py-2.5">
            <span className="text-[12px] text-foreground">{t("account.thisDevice")}</span>
            <span className="text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">{t("account.active")}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={flashOthersOut}>{t("account.signOutOthers")}</Button>
            <Saved show={othersOut}>{t("account.signedOutOthers")}</Saved>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function LanguageSection() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [choice, setChoice] = useState(locale);

  const save = (event: FormEvent) => {
    event.preventDefault();
    void navigate({ href: `${localePath(choice, "account")}?tab=language`, replace: true });
  };

  return (
    <Panel title={t("account.tab.language")}>
      <form onSubmit={save} className="space-y-4 p-4 sm:p-5">
        <fieldset>
          <legend className={fieldLabel}>{t("account.languageLead")}</legend>
          <div className="mt-3 grid gap-2 sm:max-w-sm">
            {languageOptions.map((language) => (
              <label
                key={language.value}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 border px-4 py-3 text-[12px] uppercase tracking-[0.12em] transition-colors focus-within:ring-2 focus-within:ring-ring",
                  choice === language.value ? "border-wire-ink bg-wire-surface text-foreground" : "border-wire-rule text-wire-ink-soft hover:border-wire-ink-soft",
                )}
              >
                <span lang={language.value}>{language.label}</span>
                <input type="radio" name="language" value={language.value} checked={choice === language.value} onChange={() => setChoice(language.value)} className="sr-only" />
                <span aria-hidden className={cn("h-3 w-3 rounded-full border", choice === language.value ? "border-wire-ink bg-wire-ink" : "border-wire-rule")} />
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap gap-3 border-t border-wire-rule pt-4">
          <Button type="submit" disabled={choice === locale}>{t("account.save")}</Button>
          <Button type="button" variant="outline" disabled={choice === locale} onClick={() => setChoice(locale)}>{t("account.cancel")}</Button>
        </div>
      </form>
    </Panel>
  );
}

const notificationKeys: (keyof NotificationPrefs)[] = ["orders", "courses", "releases", "newsletter"];

function NotificationsSection() {
  const { t } = useTranslation();
  const prefs = useNotificationPrefs();
  const [draft, setDraft] = useState(prefs);
  const [saved, flashSaved] = useFlash();
  useEffect(() => setDraft(prefs), [prefs]);
  const dirty = notificationKeys.some((key) => draft[key] !== prefs[key]);

  return (
    <Panel title={t("account.tab.notifications")}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          notificationStore.set(draft);
          flashSaved();
        }}
        className="p-4 sm:p-5"
      >
        <ul>
          {notificationKeys.map((key) => (
            <li key={key} className="flex items-start justify-between gap-4 border-b border-wire-rule py-3 first:pt-0">
              <span>
                <Label htmlFor={`notify-${key}`} className="text-[12px] font-normal uppercase tracking-[0.06em] text-foreground">
                  {t(`account.notify.${key}.title`)}
                </Label>
                <span className="mt-1 block text-[11px] text-wire-ink-soft">{t(`account.notify.${key}.text`)}</span>
              </span>
              <Switch
                id={`notify-${key}`}
                checked={draft[key]}
                onCheckedChange={(checked) => setDraft((current) => ({ ...current, [key]: checked }))}
                className="shadow-none"
              />
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button type="submit" disabled={!dirty}>{t("account.save")}</Button>
          <Button type="button" variant="outline" disabled={!dirty} onClick={() => setDraft(prefs)}>{t("account.cancel")}</Button>
          <Saved show={saved}>{t("account.saved")}</Saved>
        </div>
      </form>
    </Panel>
  );
}

function ManageSection() {
  const { t } = useTranslation();
  const { to } = useLocale();
  const navigate = useNavigate();
  const mode = useDemoMode();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    void navigate({ href: to(""), replace: true });
  };

  return (
    <div className="space-y-4">
      <Panel title={t("account.demoTitle")}>
        <div className="space-y-3 p-4 sm:p-5">
          <p className="text-[12px] leading-relaxed text-wire-ink-soft">{t("account.demoText")}</p>
          <p className="text-[10px] uppercase tracking-[0.14em] text-foreground">
            {t("account.demoCurrent")}: {t(`account.demoMode.${mode}`)}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={demoActions.reset}>{t("account.demoReset")}</Button>
            <Button type="button" variant="outline" size="sm" onClick={demoActions.empty}>{t("account.demoEmpty")}</Button>
          </div>
        </div>
      </Panel>

      <Panel title={t("account.tab.manage")}>
        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[12px] text-foreground">{t("account.signOutText")}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void signOut()}>{t("member.signOut")}</Button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-wire-rule pt-4">
            <span>
              <span className="block text-[12px] text-foreground">{t("account.deleteTitle")}</span>
              <span className="block text-[11px] text-wire-ink-soft">{t("account.deleteText")}</span>
            </span>
            <Button type="button" variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/5" onClick={() => setConfirmDelete(true)} disabled={deleteRequested}>
              {t("account.deleteAction")}
            </Button>
          </div>
          <Saved show={deleteRequested}>{t("account.deleteRequested")}</Saved>
        </div>
      </Panel>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="rounded-[var(--radius)] border-wire-rule shadow-none sm:rounded-[var(--radius)]">
          <AlertDialogTitle className="text-[15px] uppercase tracking-[0.1em]">{t("account.deleteConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription className="text-[12px] leading-relaxed text-wire-ink-soft">{t("account.deleteConfirmText")}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[var(--radius)] text-[11px] uppercase tracking-[0.16em]">{t("account.cancel")}</AlertDialogCancel>
            <AlertDialogAction className="rounded-[var(--radius)] bg-destructive text-[11px] uppercase tracking-[0.16em] text-destructive-foreground hover:bg-destructive/90" onClick={() => setDeleteRequested(true)}>
              {t("account.deleteAction")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const sections: Record<Tab, () => ReactNode> = {
  profile: () => <ProfileSection />,
  details: () => <DetailsSection />,
  security: () => <SecuritySection />,
  language: () => <LanguageSection />,
  notifications: () => <NotificationsSection />,
  manage: () => <ManageSection />,
};

function AccountPage() {
  const { t } = useTranslation();
  const { to } = useLocale();
  const { tab = "profile" } = Route.useSearch();

  return (
    <div className="space-y-6">
      <PageHeader label={t("member.group.account")} title={t("member.nav.account")} lead={t("account.lead")} />

      <div className="md:grid md:grid-cols-[180px_minmax(0,1fr)] md:gap-8">
        <nav aria-label={t("account.sectionsLabel")} className="-mx-5 mb-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 md:m-0 md:p-0">
          <ul className="flex gap-2 md:flex-col md:gap-0">
            {tabs.map((item) => {
              const isActive = item === tab;
              return (
                <li key={item}>
                  <Link
                    to={`${to("account")}?tab=${item}`}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex h-9 items-center whitespace-nowrap border px-3 text-[10px] uppercase tracking-[0.14em] transition-colors md:h-auto md:border-0 md:border-l-2 md:py-2.5",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground md:border-wire-ink md:bg-wire-surface md:text-foreground"
                        : "border-wire-rule text-wire-ink-soft hover:text-foreground md:border-transparent",
                    )}
                  >
                    {t(`account.tab.${item}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="min-w-0">{sections[tab]()}</div>
      </div>
    </div>
  );
}
