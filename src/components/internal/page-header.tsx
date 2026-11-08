import type { ReactNode } from "react";

import { SectionLabel } from "@/components/site/section-label";

type PageHeaderProps = {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export const PageHeader = ({
  label,
  title,
  description,
  actions,
}: PageHeaderProps) => (
  <header className="border-b border-wire-rule pb-6">
    <SectionLabel label={label} />
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <h1 className="text-display-sm font-medium uppercase text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-[62ch] text-[13px] leading-relaxed text-wire-ink-soft">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  </header>
);
