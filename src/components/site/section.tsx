import type { ReactNode } from "react";

import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  tone?: "default" | "surface";
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

export const Section = ({
  id,
  tone = "default",
  className,
  innerClassName,
  children,
}: SectionProps) => (
  <section
    id={id}
    className={cn(
      "border-b border-wire-rule",
      tone === "surface" && "bg-wire-surface",
      className,
    )}
  >
    <Container className={innerClassName}>{children}</Container>
  </section>
);
