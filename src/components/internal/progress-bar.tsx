import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  label?: string;
  className?: string;
  tone?: "ink" | "media";
};

export const ProgressBar = ({
  value,
  label,
  className,
  tone = "ink",
}: ProgressBarProps) => {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={className}>
      {label ? (
        <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-wire-ink-soft">
          {label}
        </p>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "h-1 w-full overflow-hidden",
          tone === "media" ? "bg-media-line/20" : "bg-wire-rule",
        )}
      >
        <div
          className={cn(
            "h-full transition-[width] duration-300",
            tone === "media" ? "bg-media-foreground" : "bg-wire-ink",
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
