import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

export type AdminStatusTone =
  | "published"
  | "unpublished"
  | "new"
  | "read"
  | "handled"
  | "owner"
  | "admin"
  | "active"
  | "inactive"
  | "planned"
  | "prototype"
  | "demo";

const styles: Record<AdminStatusTone, string> = {
  published: "border-wire-ink text-foreground",
  unpublished: "border-dashed border-wire-ink-soft text-wire-ink-soft",
  new: "border-primary bg-primary text-primary-foreground",
  read: "border-wire-ink text-foreground",
  handled: "border-wire-rule bg-wire-surface text-wire-ink-soft",
  owner: "border-primary bg-primary text-primary-foreground",
  admin: "border-wire-ink text-foreground",
  active: "border-wire-ink text-foreground",
  inactive: "border-dashed border-wire-ink-soft text-wire-ink-soft",
  planned: "border-dashed border-wire-ink-soft text-wire-ink-soft",
  prototype: "border-wire-rule bg-wire-surface text-wire-ink-soft",
  demo: "border-dashed border-wire-rule text-wire-ink-soft",
};

export const AdminStatusPill = ({ tone }: { tone: AdminStatusTone }) => {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-1 text-[8.5px] uppercase tracking-[0.16em]",
        styles[tone],
      )}
    >
      <span aria-hidden className="h-1 w-1 shrink-0 bg-current" />
      {t(`admin.status.${tone}`)}
    </span>
  );
};
