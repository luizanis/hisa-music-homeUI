import { cn } from "@/lib/utils";

type CourseCoverProps = {
  title: string;
  code: string;
  variant: number;
  className?: string;
};

/**
 * Abstract course cover, in the same neutral language as the product boxes:
 * dark surface, oversized index and a small technical caption.
 */
export const CourseCover = ({
  title,
  code,
  variant,
  className,
}: CourseCoverProps) => (
  <div
    className={cn(
      "relative flex aspect-[4/3] items-end overflow-hidden bg-media p-3 text-media-foreground",
      className,
    )}
  >
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 wire-hatch opacity-[0.08]"
    />
    <span
      aria-hidden
      className="pointer-events-none absolute -right-1 -top-7 select-none font-medium leading-none tracking-[-0.06em] text-media-foreground/[0.08] text-[6rem]"
    >
      0{(variant % 9) + 1}
    </span>
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-px bg-media-line/20"
    />
    <div className="relative w-full">
      <div className="flex items-center justify-between gap-2 text-[7px] uppercase tracking-[0.22em] text-media-soft">
        <span>HISA Academy</span>
        <span className="font-mono">{code}</span>
      </div>
      <p className="mt-2 line-clamp-3 text-[12px] font-medium uppercase leading-[1.1] tracking-[-0.01em]">
        {title}
      </p>
    </div>
  </div>
);
