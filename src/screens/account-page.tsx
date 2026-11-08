import { Camera, LogOut, ShieldCheck, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/lib/router-compat";

import { PageHeader } from "@/components/internal/page-header";
import { Panel } from "@/components/internal/panel";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { demoProfile } from "@/data/account";
import { useLocale } from "@/i18n/routing";
import { formatDateTime } from "@/lib/account";
import { pickLocale } from "@/lib/catalog";
import { fileToAvatarDataUrl } from "@/lib/image";
import { useAccount } from "@/store/account-store";

const notificationKeys = ["orders", "courses", "launches", "marketing"] as const;

const fieldClass =
  "h-10 border-wire-rule bg-background text-[13px] focus-visible:ring-1 focus-visible:ring-offset-0";

const AccountPage = () => {
  const { t } = useTranslation();
  const { locale, to } = useLocale();
  const navigate = useNavigate();
  const { profile, updateProfile, signOut, user } = useAccount();
  const key = pickLocale(locale);

  const [draft, setDraft] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    birthdate: profile.birthdate,
  });
  const [profileStatus, setProfileStatus] = useState<"idle" | "saved">("idle");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<
    "idle" | "saved" | "mismatch" | "short"
  >("idle");
  const [photoStatus, setPhotoStatus] = useState<
    "idle" | "loading" | "saved" | "error" | "tooLarge" | "wrongType"
  >("idle");
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    orders: true,
    courses: true,
    launches: false,
    marketing: false,
  });

  const saveProfile = (event: FormEvent) => {
    event.preventDefault();
    updateProfile(draft);
    setProfileStatus("saved");
    setSavedAt(new Date().toISOString());
  };

  const cancelProfile = () => {
    setDraft({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      city: profile.city,
      birthdate: profile.birthdate,
    });
    setProfileStatus("idle");
  };

  const savePassword = (event: FormEvent) => {
    event.preventDefault();
    if (passwords.next.length < 6) {
      setPasswordStatus("short");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordStatus("mismatch");
      return;
    }
    setPasswordStatus("saved");
    setSavedAt(new Date().toISOString());
    setPasswords({ current: "", next: "", confirm: "" });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(to("signin"), { replace: true });
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoStatus("wrongType");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoStatus("tooLarge");
      return;
    }

    setPhotoStatus("loading");
    try {
      const avatar = await fileToAvatarDataUrl(file);
      updateProfile({ avatarUrl: avatar });
      setPhotoStatus("saved");
    } catch {
      setPhotoStatus("error");
    }
  };

  const removePhoto = () => {
    updateProfile({ avatarUrl: null });
    setPhotoStatus("idle");
  };

  const avatarUrl = profile.avatarUrl ?? null;
  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const detailRows = [
    { label: t("account.details.userId"), value: demoProfile.userId },
    {
      label: t("account.details.plan"),
      value: demoProfile.plan[key],
    },
    {
      label: t("account.details.memberSince"),
      value: demoProfile.memberSince.slice(0, 4),
    },
    {
      label: t("account.details.lastLogin"),
      value: formatDateTime(demoProfile.lastLogin, locale),
    },
    { label: t("account.details.devices"), value: t("account.details.devicesValue") },
  ];

  return (
    <>
      <PageHeader
        label={t("account.label")}
        title={t("account.title")}
        description={t("account.lead")}
        actions={
          <span className="border border-wire-rule px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
            {user?.isDemo ? t("account.demo") : (user?.email ?? profile.email)}
          </span>
        }
      />

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-5">
          <Panel
            label={t("account.section.profile")}
            action={
              <span className="text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
                {t("account.section.profileHint")}
              </span>
            }
          >
            <form onSubmit={saveProfile}>
              <div className="mb-5 flex flex-wrap items-start gap-4 border-b border-wire-rule pb-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-wire-ink bg-wire-surface text-[15px] font-medium uppercase text-foreground">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={t("account.photo")}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
                    {t("account.photo")}
                  </p>
                  <p className="mt-1 max-w-[48ch] text-[10px] leading-relaxed text-wire-ink-soft">
                    {t("account.photoHint")}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={photoStatus === "loading"}
                    >
                      <Camera aria-hidden strokeWidth={1.5} />
                      {avatarUrl
                        ? t("account.photoChange")
                        : t("account.photoAdd")}
                    </Button>

                    {avatarUrl ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={removePhoto}
                      >
                        <Trash2 aria-hidden strokeWidth={1.5} />
                        {t("account.photoRemove")}
                      </Button>
                    ) : null}
                  </div>

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => void handlePhotoChange(event)}
                    className="hidden"
                    aria-label={t("account.photo")}
                  />

                  {photoStatus === "loading" ? (
                    <p role="status" className="mt-2 text-[10px] leading-relaxed text-wire-ink-soft">
                      {t("account.photoLoading")}
                    </p>
                  ) : null}
                  {photoStatus === "saved" ? (
                    <p role="status" className="mt-2 text-[10px] leading-relaxed text-wire-ink-soft">
                      {t("account.photoSaved")}
                    </p>
                  ) : null}
                  {photoStatus === "error" ? (
                    <p role="alert" className="mt-2 text-[10px] leading-relaxed text-destructive">
                      {t("account.photoError")}
                    </p>
                  ) : null}
                  {photoStatus === "tooLarge" ? (
                    <p role="alert" className="mt-2 text-[10px] leading-relaxed text-destructive">
                      {t("account.photoTooLarge")}
                    </p>
                  ) : null}
                  {photoStatus === "wrongType" ? (
                    <p role="alert" className="mt-2 text-[10px] leading-relaxed text-destructive">
                      {t("account.photoWrongType")}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="account-name"
                    className="text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
                  >
                    {t("account.name")}
                  </Label>
                  <Input
                    id="account-name"
                    value={draft.name}
                    onChange={(event) =>
                      setDraft({ ...draft, name: event.target.value })
                    }
                    autoComplete="name"
                    required
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="account-email"
                    className="text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
                  >
                    {t("account.email")}
                  </Label>
                  <Input
                    id="account-email"
                    type="email"
                    value={draft.email}
                    onChange={(event) =>
                      setDraft({ ...draft, email: event.target.value })
                    }
                    autoComplete="email"
                    required
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="account-phone"
                    className="text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
                  >
                    {t("account.phone")}
                  </Label>
                  <Input
                    id="account-phone"
                    value={draft.phone}
                    onChange={(event) =>
                      setDraft({ ...draft, phone: event.target.value })
                    }
                    autoComplete="tel"
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="account-city"
                    className="text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
                  >
                    {t("account.city")}
                  </Label>
                  <Input
                    id="account-city"
                    value={draft.city}
                    onChange={(event) =>
                      setDraft({ ...draft, city: event.target.value })
                    }
                    autoComplete="address-level2"
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="account-birthdate"
                    className="text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
                  >
                    {t("account.birthdate")}
                  </Label>
                  <Input
                    id="account-birthdate"
                    type="date"
                    value={draft.birthdate}
                    onChange={(event) =>
                      setDraft({ ...draft, birthdate: event.target.value })
                    }
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="account-country"
                    className="text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
                  >
                    {t("account.country")}
                  </Label>
                  <Input
                    id="account-country"
                    value={profile.country[key]}
                    readOnly
                    aria-readonly="true"
                    className={`${fieldClass} text-wire-ink-soft`}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-wire-rule pt-4">
                <Button type="submit">{t("account.save")}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelProfile}
                  disabled={profileStatus === "idle"}
                >
                  {t("account.cancel")}
                </Button>
                {profileStatus === "saved" ? (
                  <p
                    role="status"
                    className="text-[10px] leading-relaxed text-wire-ink-soft"
                  >
                    {t("account.saved")}
                    {savedAt
                      ? ` · ${t("account.updatedAt", {
                          date: formatDateTime(savedAt, locale),
                        })}`
                      : ""}
                  </p>
                ) : null}
              </div>
            </form>
          </Panel>

          <Panel label={t("account.section.security")}>
            <form onSubmit={savePassword}>
              <div className="grid gap-4 sm:grid-cols-3">
                {(
                  [
                    ["current", "account.security.current", "current-password"],
                    ["next", "account.security.new", "new-password"],
                    ["confirm", "account.security.confirm", "new-password"],
                  ] as const
                ).map(([field, labelKey, autoComplete]) => (
                  <div key={field} className="space-y-2">
                    <Label
                      htmlFor={`account-password-${field}`}
                      className="text-[9px] font-normal uppercase tracking-[0.16em] text-wire-ink-soft"
                    >
                      {t(labelKey)}
                    </Label>
                    <Input
                      id={`account-password-${field}`}
                      type="password"
                      value={passwords[field]}
                      onChange={(event) => {
                        setPasswords({
                          ...passwords,
                          [field]: event.target.value,
                        });
                        setPasswordStatus("idle");
                      }}
                      autoComplete={autoComplete}
                      className={fieldClass}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button type="submit" variant="outline">
                  {t("account.security.update")}
                </Button>
                <ShieldCheck
                  aria-hidden
                  className="h-4 w-4 text-wire-ink-soft"
                  strokeWidth={1.5}
                />
              </div>

              {passwordStatus === "saved" ? (
                <p role="status" className="mt-3 text-[10px] text-wire-ink-soft">
                  {t("account.security.saved")}
                </p>
              ) : null}
              {passwordStatus === "mismatch" ? (
                <p role="alert" className="mt-3 text-[10px] text-destructive">
                  {t("account.security.mismatch")}
                </p>
              ) : null}
              {passwordStatus === "short" ? (
                <p role="alert" className="mt-3 text-[10px] text-destructive">
                  {t("account.security.short")}
                </p>
              ) : null}

              <p className="mt-3 border-t border-wire-rule pt-3 text-[10px] leading-relaxed text-wire-ink-soft">
                {t("account.security.note")}
              </p>
            </form>
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel label={t("account.section.details")} bodyClassName="p-0">
            <dl>
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-wire-rule px-4 py-3 last:border-b-0"
                >
                  <dt className="text-[9px] uppercase tracking-[0.14em] text-wire-ink-soft">
                    {row.label}
                  </dt>
                  <dd className="max-w-[60%] break-words text-right font-mono text-[10px] text-foreground">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel label={t("account.section.language")}>
            <LocaleSwitcher size="md" className="w-fit" />
            <p className="mt-3 text-[10px] leading-relaxed text-wire-ink-soft">
              {t("account.language.note")}
            </p>
          </Panel>

          <Panel label={t("account.section.notifications")} bodyClassName="p-0">
            <ul>
              {notificationKeys.map((notification) => (
                <li
                  key={notification}
                  className="flex items-center justify-between gap-4 border-b border-wire-rule px-4 py-3 last:border-b-0"
                >
                  <label
                    htmlFor={`notification-${notification}`}
                    className="text-[11px] leading-relaxed text-wire-ink-soft"
                  >
                    {t(`account.notifications.${notification}`)}
                  </label>
                  <Switch
                    id={`notification-${notification}`}
                    checked={notifications[notification] ?? false}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        [notification]: checked,
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel label={t("account.section.management")}>
            <div className="space-y-4">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => void handleSignOut()}
                >
                  <LogOut aria-hidden strokeWidth={1.5} />
                  {t("account.management.signout")}
                </Button>
                <p className="mt-2 text-[10px] leading-relaxed text-wire-ink-soft">
                  {t("account.management.signoutText")}
                </p>
              </div>

              <div className="border-t border-wire-rule pt-4">
                <Button type="button" variant="outline" className="w-full" disabled>
                  <Trash2 aria-hidden strokeWidth={1.5} />
                  {t("account.management.delete")}
                </Button>
                <p className="mt-2 text-[10px] leading-relaxed text-wire-ink-soft">
                  {t("account.management.deleteText")}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-wire-ink-soft">
                  {t("account.management.deleteNote")}
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
