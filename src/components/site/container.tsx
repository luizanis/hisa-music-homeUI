import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  className?: string | undefined;
  children: ReactNode;
};

export const Container = ({ className, children }: ContainerProps) => (
  <div className={cn("mx-auto w-full max-w-[1280px] px-5 sm:px-8", className)}>
    {children}
  </div>
);
