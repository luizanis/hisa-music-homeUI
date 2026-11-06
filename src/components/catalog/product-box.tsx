import { cn } from "@/lib/utils";

type ProductBoxProps = {
  title: string;
  kicker: string;
  code: string;
  variant: number;
  size?: "default" | "large";
};

/** Abstract packaging motif, varied per product. */
const Motif = ({ variant }: { variant: number }) => {
  if (variant % 4 === 1) {
    return (
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-6 h-28 w-28 rounded-full border border-media-foreground/10"
      />
    );
  }

  if (variant % 4 === 2) {
    return (
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-4 flex flex-col gap-2 opacity-70"
      >
        {[0, 1, 2].map((row) => (
          <span key={row} className="block h-px w-full bg-media-foreground/10" />
        ))}
      </span>
    );
  }

  if (variant % 4 === 3) {
    return (
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rotate-45 border border-media-foreground/10"
      />
    );
  }

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 border border-media-foreground/10"
    />
  );
};

const Barcode = () => (
  <span aria-hidden className="flex h-3.5 items-end gap-[2px]">
    {[3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1].map((width, index) => (
      <span
        key={index}
        className="block h-full bg-media-foreground/60"
        style={{ width: `${width}px` }}
      />
    ))}
  </span>
);

/**
 * Illustration of a physical software-style box (early 2000s retail packaging).
 * Three faces are drawn as vector planes — front, top and right — so the box
 * reads as 3D at any size. Replaced by the final render when artwork arrives.
 */
export const ProductBox = ({
  title,
  kicker,
  code,
  variant,
  size = "default",
}: ProductBoxProps) => {
  const titleSize =
    title.length > 30
      ? "text-[10px]"
      : title.length > 20
        ? "text-[12px]"
        : "text-[14px]";

  return (
    <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-wire-surface px-8 py-6">
      <div
        className={cn(
          "relative w-full",
          size === "large" ? "max-w-[200px]" : "max-w-[128px]",
        )}
        style={{ aspectRatio: "220 / 300" }}
      >
        {/* floor shadow */}
        <span
          aria-hidden
          className="absolute -bottom-4 left-6 right-0 h-3 rounded-full bg-foreground/15 blur-[7px]"
        />

        {/* 3D planes */}
        <svg
          viewBox="0 0 220 300"
          aria-hidden
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <polygon
            points="0,20 20,0 220,0 200,20"
            fill="var(--media-face-top)"
            stroke="var(--media-line)"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          <polygon
            points="200,20 220,0 220,280 200,300"
            fill="var(--media-face)"
            stroke="var(--media-line)"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          <rect
            x="0"
            y="20"
            width="200"
            height="280"
            fill="var(--media)"
            stroke="var(--media-line)"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
        </svg>

        {/* front artwork */}
        <div
          className="absolute overflow-hidden text-media-foreground"
          style={{
            left: 0,
            top: "6.67%",
            width: "90.9%",
            height: "93.33%",
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-media-foreground/10 via-transparent to-media-foreground/5"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-px bg-media-foreground/20"
          />

          <Motif variant={variant} />

          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-6 right-0 select-none font-medium leading-none tracking-[-0.06em] text-media-foreground/[0.07] text-[5rem]"
          >
            {code.slice(-2)}
          </span>

          <div className="relative flex h-full flex-col justify-between p-3">
            <div className="flex items-center justify-between gap-2 text-[6px] uppercase tracking-[0.22em] text-media-soft">
              <span>HISA</span>
              <span className="font-mono">{code}</span>
            </div>

            <div>
              <p className="text-[6px] uppercase leading-relaxed tracking-[0.22em] text-media-soft">
                {kicker}
              </p>
              <p
                className={cn(
                  "mt-2 font-medium uppercase leading-[0.95] tracking-[-0.01em]",
                  titleSize,
                )}
              >
                {title}
              </p>
            </div>

            <div className="flex items-end justify-between gap-2">
              <span className="text-[5px] uppercase leading-tight tracking-[0.18em] text-media-soft">
                Exclusive
                <br />
                edition
              </span>
              <Barcode />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
