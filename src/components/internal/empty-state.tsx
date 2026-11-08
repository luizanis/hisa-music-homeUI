import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  children?: ReactNode;
};

export const EmptyState = ({
  icon: Icon,
  title,
  text,
  children,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center border border-dashed border-wire-rule bg-wire-surface/40 px-6 py-12 text-center">
    <span
      aria-hidden
      className="flex h-11 w-11 items-center justify-center border border-wire-rule bg-background text-wire-ink-soft"
    >
      <Icon className="h-5 w-5" strokeWidth={1.25} />
    </span>
    <h2 className="mt-4 text-[13px] uppercase tracking-[0.12em] text-foreground">
      {title}
    </h2>
    <p className="mt-2 max-w-[46ch] text-[12px] leading-relaxed text-wire-ink-soft">
      {text}
    </p>
    {children ? (
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {children}
      </div>
    ) : null}
  </div>
);
