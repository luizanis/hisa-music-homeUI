import { LockKeyhole, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminMetricCardProps = {
  label: string;
  value: ReactNode;
  note?: string;
  icon?: LucideIcon;
  pending?: boolean;
  className?: string;
};

export const AdminMetricCard = ({
  label,
  value,
  note,
  icon: Icon,
  pending = false,
  className,
}: AdminMetricCardProps) => (
  <div
    className={cn(
      "flex min-h-[132px] flex-col justify-between border p-4",
      pending
        ? "border-dashed border-wire-rule bg-wire-surface/40"
        : "border-wire-rule bg-background",
      className,
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <p className="text-[9px] uppercase tracking-[0.18em] text-wire-ink-soft">
        {label}
      </p>
      {pending ? (
        <LockKeyhole
          aria-hidden
          className="h-3.5 w-3.5 text-wire-ink-soft"
          strokeWidth={1.5}
        />
      ) : Icon ? (
        <Icon
          aria-hidden
          className="h-3.5 w-3.5 text-wire-ink-soft"
          strokeWidth={1.5}
        />
      ) : null}
    </div>

    <div>
      <p
        className={cn(
          "font-mono text-[26px] leading-none",
          pending ? "text-wire-ink-soft" : "text-foreground",
        )}
      >
        {value}
      </p>
      {note ? (
        <p className="mt-2 max-w-[30ch] text-[10px] leading-relaxed text-wire-ink-soft">
          {note}
        </p>
      ) : null}
    </div>
  </div>
);
