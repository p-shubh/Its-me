import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type SVGProps } from "react";

/*
 * Line-art illustration system: one developer character, drawn with the same head, hair,
 * hoodie (collar + drawstrings) and 1.5px rounded strokes in every pose.
 *
 * Each stroke uses pathLength=1, so CSS can draw it with stroke-dashoffset 1 → 0
 * (see the .art rules in index.css). The SVG renders complete by default; it is only
 * "armed" (hidden, ready to draw) when JavaScript runs and motion is allowed, so the
 * artwork still shows if scripts or animations fail.
 */

const INK = "#171614";
const MUTE = "#a8a299";
const RED = "#c2370f";
const PAPER = "#f5f2ec";

type ArtState = "static" | "armed" | "drawn";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Scroll-triggered wrapper: draws once on first entry; `loop` art also tracks visibility to pause its micro-animation. */
export function LineArt({
  viewBox,
  loop = false,
  label,
  className = "",
  children,
}: {
  viewBox: string;
  loop?: boolean;
  /** A meaningful drawing (e.g. an architecture diagram) gets a label; decorative art stays hidden. */
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [state, setState] = useState<ArtState>("static");
  const [live, setLive] = useState(false);

  // arm before first paint so in-view art never flashes complete, then draw
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setState("armed");
    let onScreen = false;
    const sync = () => setLive(onScreen && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("drawn");
          if (!loop) io.disconnect();
        }
        onScreen = entry.isIntersecting;
        if (loop) sync();
      },
      // start a little before the art is fully on screen, but not while it is still far below
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 },
    );
    io.observe(el);
    // loops also pause while the tab is hidden
    if (loop) document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [loop]);

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      data-art={state}
      data-live={live ? "" : undefined}
      className={`art h-auto w-full overflow-visible ${className}`}
      fill="none"
      stroke={INK}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* ── drawing primitives ───────────────────────────────────────────────── */

type Timing = { at?: number; dur?: number };
export const timing = ({ at = 0, dur = 600 }: Timing) => ({ "--d": `${at}ms`, "--t": `${dur}ms` }) as CSSProperties;

/** A stroke that draws itself. */
export function S({ at, dur, accent, mute, ...p }: SVGProps<SVGPathElement> & Timing & { accent?: boolean; mute?: boolean }) {
  return (
    <path
      pathLength={1}
      className="d"
      style={timing({ at, dur })}
      stroke={accent ? RED : mute ? MUTE : undefined}
      {...p}
    />
  );
}

/** A rounded box that draws its outline; filled with paper so it masks what sits behind it. */
export function Box({ x, y, w, h, r = 5, at, dur, accent }: { x: number; y: number; w: number; h: number; r?: number; accent?: boolean } & Timing) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill={PAPER}
      pathLength={1}
      className="d"
      style={timing({ at, dur })}
      stroke={accent ? RED : undefined}
    />
  );
}

/** A small filled detail that fades in rather than draws. */
export function Dot({ cx, cy, r = 2.5, at = 0, accent = true }: { cx: number; cy: number; r?: number; accent?: boolean } & Timing) {
  return <circle cx={cx} cy={cy} r={r} fill={accent ? RED : INK} stroke="none" className="f" style={timing({ at })} />;
}

/** Diagram text that fades in with its shape. */
export function T({
  at = 0,
  size = 13,
  weight = 400,
  tone = "ink",
  children,
  ...p
}: Omit<SVGProps<SVGTextElement>, "fill" | "fontSize" | "fontWeight"> &
  Timing & { size?: number; weight?: number; tone?: "ink" | "mute" | "red" | "paper" }) {
  const fill = { ink: INK, mute: "#66615a", red: RED, paper: PAPER }[tone];
  return (
    <text className="f" style={timing({ at })} fontSize={size} fontWeight={weight} fill={fill} stroke="none" {...p}>
      {children}
    </text>
  );
}

/* ── the character ────────────────────────────────────────────────────── */
// Local coordinates: head centre at (0,0), shoulders at (±24, 28), hem at y=88, feet at y=150.

function Head({ at = 0 }: Timing) {
  return (
    <>
      <circle cx={0} cy={0} r={13} pathLength={1} className="d" style={timing({ at, dur: 500 })} />
      <S at={at + 150} dur={450} d="M-12.4 -4 C-8 -10 3 -11 8 -6 C10 -4.5 11.5 -3.5 12.7 -3" />
      <S at={at + 250} dur={300} d="M0 13 V19" />
    </>
  );
}

function HoodieTop({ at = 0 }: Timing) {
  return (
    <>
      <S at={at + 140} dur={350} d="M-9 21 C-5 29 5 29 9 21" />
      <S at={at + 260} dur={250} d="M-3 26 V36" />
      <S at={at + 300} dur={250} d="M3 26 V36" />
    </>
  );
}

/** Standing figure; arms are pose-specific and passed in. */
export function Person({ x, y, at = 0, arms }: { x: number; y: number; arms: ReactNode } & Timing) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Head at={at} />
      <S at={at + 250} dur={700} d="M-24 28 C-18 21 18 21 24 28 L27 88 H-27 Z" />
      <HoodieTop at={at + 300} />
      <S at={at + 650} dur={350} d="M-13 70 H13" />
      <S at={at + 500} dur={500} d="M-11 88 L-12 150 H-23" />
      <S at={at + 560} dur={500} d="M11 88 L12 150 H23" />
      {arms}
    </g>
  );
}

/* ── poses ────────────────────────────────────────────────────────────── */
