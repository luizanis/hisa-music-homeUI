import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/* Decorative pieces for the home page "portal" look. All aria-hidden. */

const PIXEL_ICONS = {
  heart: [
    ".XX...XX.",
    "XXXX.XXXX",
    "XXXXXXXXX",
    "XXXXXXXXX",
    ".XXXXXXX.",
    "..XXXXX..",
    "...XXX...",
    "....X....",
  ],
  floppy: [
    "XXXXXXX.",
    "X.X..X.X",
    "X.XXXX.X",
    "X......X",
    "X.XXXX.X",
    "X.X..X.X",
    "X.XXXX.X",
    "XXXXXXXX",
  ],
  folder: [
    "XXXX......",
    "X..XXXXXXX",
    "X........X",
    "XXXXXXXXXX",
    "X........X",
    "X........X",
    "X........X",
    "XXXXXXXXXX",
  ],
  cd: [
    "..XXXXX..",
    ".X.....X.",
    "X..XXX..X",
    "X.X...X.X",
    "X.X.X.X.X",
    "X.X...X.X",
    "X..XXX..X",
    ".X.....X.",
    "..XXXXX..",
  ],
  cassette: [
    "XXXXXXXXXX",
    "X........X",
    "X.XX..XX.X",
    "X.XX..XX.X",
    "X........X",
    "X.XXXXXX.X",
    "XXXXXXXXXX",
  ],
} as const;

export type PixelIconName = keyof typeof PIXEL_ICONS;

export const PixelIcon = ({
  name,
  className,
}: {
  name: PixelIconName;
  className?: string;
}) => {
  const rows = PIXEL_ICONS[name];
  const width = rows[0]?.length ?? 0;
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      className={cn("h-5 w-auto fill-current", className)}
    >
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null,
        ),
      )}
    </svg>
  );
};

const BARS = [
  0.35, 0.6, 0.9, 0.5, 0.75, 1, 0.65, 0.4, 0.8, 0.55, 0.95, 0.7, 0.45, 0.85, 0.6,
  0.3, 0.7, 0.9, 0.5, 0.65, 0.4, 0.8, 1, 0.55, 0.35, 0.75, 0.6, 0.9, 0.45, 0.7,
];

/** Audio waveform bars; animate while `active` (or when a parent `group` is hovered). */
export const Waveform = ({
  bars = 24,
  active = false,
  className,
}: {
  bars?: number;
  active?: boolean;
  className?: string;
}) => (
  <div aria-hidden className={cn("flex h-8 items-center gap-[3px]", className)}>
    {BARS.slice(0, bars).map((height, index) => (
      <span
        key={index}
        className={cn(
          "w-[3px] origin-center bg-neon/80",
          active
            ? "motion-safe:animate-wave"
            : "motion-safe:group-hover:animate-wave motion-safe:group-focus-within:animate-wave",
        )}
        style={{ height: `${height * 100}%`, animationDelay: `${(index % 7) * 0.12}s` }}
      />
    ))}
  </div>
);

/** A thin "+" registration mark. */
export const Crosshair = ({ className }: { className?: string }) => (
  <span aria-hidden className={cn("pointer-events-none absolute h-3 w-3 text-neon/70", className)}>
    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
  </span>
);

/** Small monospaced technical tag, e.g. [SYS_STATUS: ONLINE]. */
export const TechTag = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <span
    aria-hidden
    className={cn(
      "inline-flex items-center gap-1.5 whitespace-nowrap border border-neon/30 bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-neon-soft backdrop-blur-sm",
      className,
    )}
  >
    {children}
  </span>
);
