import { cn } from "@/lib/utils";

type SectionLabelProps = {
  index?: string;
  label: string;
  tone?: "default" | "dark";
  className?: string;
};

export const SectionLabel = ({
  index,
  label,
  tone = "default",
  className,
}: SectionLabelProps) => (
  <p
    className={cn(
      "flex items-center gap-3 text-label uppercase",
      tone === "dark" ? "text-media-soft" : "text-wire-ink-soft",
      className,
    )}
  >
    <span
      aria-hidden
      className={cn(
        "h-1.5 w-1.5 shrink-0",
        tone === "dark" ? "bg-media-foreground" : "bg-wire-ink",
      )}
    />
    {index ? (
      <>
        <span
          className={cn(
            "font-medium",
            tone === "dark" ? "text-media-foreground" : "text-wire-ink",
          )}
        >
          {index}
        </span>
        <span
          aria-hidden
          className={tone === "dark" ? "text-media-soft/60" : "text-wire-ink-soft/60"}
        >
          /
        </span>
      </>
    ) : null}
    <span>{label}</span>
  </p>
);
