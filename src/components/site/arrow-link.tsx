import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { AppLink as Link } from "@/components/site/app-link";

import { cn } from "@/lib/utils";

type ArrowLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
};

export const ArrowLink = ({ to, children, className }: ArrowLinkProps) => (
  <Link
    to={to}
    className={cn(
      "group inline-flex items-baseline gap-2 border-b border-wire-ink pb-1 text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-wire-ink-soft hover:text-wire-ink-soft",
      className,
    )}
  >
    <span>{children}</span>
    <ArrowUpRight
      aria-hidden
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      strokeWidth={1.5}
    />
  </Link>
);
