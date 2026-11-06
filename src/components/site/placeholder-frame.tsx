import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type PlaceholderFrameProps = {
  label: string;
  note?: string;
  className?: string;
};

const CORNERS = [
  "left-2 top-2 border-l border-t",
  "right-2 top-2 border-r border-t",
  "left-2 bottom-2 border-l border-b",
  "right-2 bottom-2 border-r border-b",
];

export const PlaceholderFrame = ({
  label,
  note,
  className,
}: PlaceholderFrameProps) => (
  <div
    className={cn(
      "relative flex items-center justify-center overflow-hidden border border-dashed border-wire-rule bg-wire-placeholder wire-hatch",
      className,
    )}
  >
    {CORNERS.map((corner) => (
      <span
        key={corner}
        aria-hidden
        className={cn(
          "absolute h-2 w-2 border-wire-placeholder-foreground/50",
          corner,
        )}
      />
    ))}

    <div className="relative z-10 flex max-w-[80%] flex-col items-center gap-2 text-center">
      <ImageIcon
        aria-hidden
        className="h-5 w-5 text-wire-placeholder-foreground"
        strokeWidth={1.25}
      />
      <p className="text-[10px] uppercase leading-relaxed tracking-[0.18em] text-wire-placeholder-foreground">
        {label}
      </p>
      {note ? (
        <p className="font-mono text-[10px] text-wire-placeholder-foreground/70">
          {note}
        </p>
      ) : null}
    </div>
  </div>
);
