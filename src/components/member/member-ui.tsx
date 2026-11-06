import { AlertCircle, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { SectionLabel } from "@/components/site/section-label";
import type { CatalogKey } from "@/lib/catalog";
import { productCode, type OrderStatus } from "@/lib/cart";
import type { CourseStatus } from "@/lib/member-store";
import { cn } from "@/lib/utils";

export const formatDate = (iso: string, locale: string, withTime = false) =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));

/** Title block shared by every member page. */
export const PageHeader = ({
  label,
  title,
  lead,
  actions,
}: {
  label: string;
  title: string;
  lead?: string | undefined;
  actions?: ReactNode;
}) => (
  <div className="flex flex-col gap-5 border-b border-wire-rule pb-6 md:flex-row md:items-end md:justify-between">
    <div>
      <SectionLabel label={label} />
      <h1 className="mt-4 text-[26px] font-medium uppercase leading-none tracking-[-0.01em] text-foreground md:text-[34px]">
        {title}
      </h1>
      {lead ? (
        <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-wire-ink-soft">{lead}</p>
      ) : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
  </div>
);

/** Bordered block with an optional heading row. */
export const Panel = ({
  title,
  action,
  className,
  children,
}: {
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) => (
  <section className={cn("border border-wire-rule bg-background", className)}>
    {title ? (
      <div className="flex items-center justify-between gap-3 border-b border-wire-rule px-4 py-3">
        <h2 className="text-[10px] font-normal uppercase tracking-[0.18em] text-foreground">{title}</h2>
        {action}
      </div>
    ) : null}
    {children}
  </section>
);

export const ProgressBar = ({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className?: string;
}) => (
  <div
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={value}
    aria-label={label}
    className={cn("h-1.5 w-full bg-wire-placeholder", className)}
  >
    <div className="h-full bg-wire-ink transition-[width]" style={{ width: `${value}%` }} />
  </div>
);

const orderStatusStyle: Record<OrderStatus, string> = {
  paid: "border-wire-ink bg-primary text-primary-foreground",
  pending: "border-dashed border-wire-ink text-foreground",
  failed: "border-destructive text-destructive",
  refunded: "border-wire-rule bg-wire-surface text-wire-ink-soft",
};

const orderStatusIcon: Record<OrderStatus, typeof CheckCircle2> = {
  paid: CheckCircle2,
  pending: Clock,
  failed: AlertCircle,
  refunded: RotateCcw,
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation();
  const Icon = orderStatusIcon[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 border px-2 py-1 text-[9px] uppercase tracking-[0.14em]",
        orderStatusStyle[status],
      )}
    >
      <Icon aria-hidden className="h-3 w-3" strokeWidth={1.75} />
      {t(`status.${status}`)}
    </span>
  );
};

const courseStatusStyle: Record<CourseStatus, string> = {
  completed: "border-wire-ink bg-primary text-primary-foreground",
  inProgress: "border-wire-ink text-foreground",
  notStarted: "border-wire-rule text-wire-ink-soft",
};

export const CourseStatusBadge = ({ status }: { status: CourseStatus }) => {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center border px-2 py-1 text-[9px] uppercase tracking-[0.14em]",
        courseStatusStyle[status],
      )}
    >
      {t(`courseStatus.${status}`)}
    </span>
  );
};

export const EmptyState = ({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children?: ReactNode;
}) => (
  <div className="flex flex-col items-center border border-dashed border-wire-rule bg-wire-surface px-6 py-12 text-center">
    <p className="text-[12px] uppercase tracking-[0.14em] text-foreground">{title}</p>
    {text ? (
      <p className="mt-3 max-w-[44ch] text-[13px] leading-relaxed text-wire-ink-soft">{text}</p>
    ) : null}
    {children ? <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div> : null}
  </div>
);

/** Compact dark tile standing in for a product cover in lists. */
export const ProductThumb = ({
  catalog,
  category,
  className,
}: {
  catalog: CatalogKey;
  category: string;
  className?: string;
}) => (
  <span
    aria-hidden
    className={cn(
      "relative flex h-14 w-14 shrink-0 flex-col justify-between overflow-hidden bg-media p-1.5 text-media-foreground",
      className,
    )}
  >
    <span className="text-[6px] uppercase tracking-[0.22em] text-media-soft">HISA</span>
    <span className="font-mono text-[8px] leading-none">{productCode(catalog, category)}</span>
    <span className="pointer-events-none absolute -bottom-3 -right-3 h-8 w-8 border border-media-foreground/15" />
  </span>
);

/** Toggle chips used for filters across member pages (same as the catalog). */
export const FilterChips = <T extends string>({
  options,
  value,
  onChange,
  label,
  renderLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  label: string;
  renderLabel: (option: T) => string;
}) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-2">
    {options.map((option) => {
      const isActive = option === value;
      return (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={isActive}
          className={cn(
            "h-9 border px-3 text-[10px] uppercase tracking-[0.14em] transition-colors",
            isActive
              ? "border-primary bg-primary text-primary-foreground"
              : "border-wire-rule bg-background text-wire-ink-soft hover:border-wire-ink hover:text-foreground",
          )}
        >
          {renderLabel(option)}
        </button>
      );
    })}
  </div>
);

export const SummaryRow = ({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: ReactNode;
  strong?: boolean;
}) => (
  <div className="flex items-center justify-between gap-4 py-1.5">
    <span className="text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">{label}</span>
    <span className={cn("font-mono text-foreground", strong ? "text-[15px]" : "text-[12px]")}>
      {value}
    </span>
  </div>
);
