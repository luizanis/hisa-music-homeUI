import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PanelProps = {
  id?: string;
  label?: ReactNode;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

/** Bordered block used for every card in the customer area. */
export const Panel = ({
  id,
  label,
  action,
  className,
  bodyClassName,
  children,
}: PanelProps) => (
  <section id={id} className={cn("border border-wire-rule bg-background", className)}>
    {label || action ? (
      <header className="flex min-h-[44px] flex-wrap items-center justify-between gap-2 border-b border-wire-rule px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-wire-ink-soft">
          {label}
        </p>
        {action}
      </header>
    ) : null}
    <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
  </section>
);
