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
  className = "",
  children,
}: {
  viewBox: string;
  loop?: boolean;
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
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("drawn");
          if (!loop) io.disconnect();
        }
        if (loop) setLive(entry.isIntersecting);
      },
      // start a little before the art is fully on screen, but not while it is still far below
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
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
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* ── drawing primitives ───────────────────────────────────────────────── */

type Timing = { at?: number; dur?: number };
const timing = ({ at = 0, dur = 600 }: Timing) => ({ "--d": `${at}ms`, "--t": `${dur}ms` }) as CSSProperties;

/** A stroke that draws itself. */
function S({ at, dur, accent, mute, ...p }: SVGProps<SVGPathElement> & Timing & { accent?: boolean; mute?: boolean }) {
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
function Box({ x, y, w, h, r = 5, at, dur, accent }: { x: number; y: number; w: number; h: number; r?: number; accent?: boolean } & Timing) {
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
function Dot({ cx, cy, r = 2.5, at = 0, accent = true }: { cx: number; cy: number; r?: number; accent?: boolean } & Timing) {
  return <circle cx={cx} cy={cy} r={r} fill={accent ? RED : INK} stroke="none" className="f" style={timing({ at })} />;
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
function Person({ x, y, at = 0, arms }: { x: number; y: number; arms: ReactNode } & Timing) {
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

/** Hero — building: seated behind a laptop, forearms tapping. */
export function HeroDeveloper() {
  return (
    <LineArt viewBox="0 0 320 228" loop>
      {/* desk */}
      <S at={0} dur={700} d="M24 172 H296" />
      <S at={250} dur={350} d="M44 172 V222" />
      <S at={300} dur={350} d="M276 172 V222" />

      <g transform="translate(160 56)">
        <Head at={200} />
        <S at={420} dur={500} d="M-24 28 C-18 21 18 21 24 28" />
        <HoodieTop at={480} />
        {/* upper arms */}
        <S at={620} dur={450} d="M-24 29 C-30 40 -34 56 -35 74" />
        <S at={660} dur={450} d="M24 29 C30 40 34 56 35 74" />
        {/* forearms: the only looping motion, paused when off screen */}
        <g className="typing">
          <S at={900} dur={350} d="M-35 74 C-35 88 -34 100 -31 112" />
        </g>
        <g className="typing typing-b">
          <S at={940} dur={350} d="M35 74 C35 88 34 100 31 112" />
        </g>
      </g>

      {/* laptop, seen from behind; drawn last so it sits in front of the hands */}
      <Box x={128} y={116} w={64} h={52} r={4} at={1000} dur={600} />
      <S at={1150} dur={450} d="M114 170 H206" />
      <Dot cx={160} cy={142} at={1500} />

      {/* mug */}
      <S at={1250} dur={450} d="M232 148 V170 H252 V148" />
      <S at={1450} dur={300} d="M252 153 C261 153 261 165 252 165" />
    </LineArt>
  );
}

/** About — designing systems: pointing at an architecture sketch that assembles node by node. */
export function AboutDeveloper() {
  const nodes = [
    { x: 146, y: 30 },
    { x: 222, y: 14 },
    { x: 222, y: 74, accent: true },
    { x: 276, y: 44 },
    { x: 170, y: 130 },
    { x: 256, y: 120 },
  ];
  const edges: { d: string; accent?: boolean }[] = [
    { d: "M164 41 L240 25" },
    { d: "M164 41 L240 85" },
    { d: "M240 25 L294 55" },
    { d: "M240 85 L294 55", accent: true },
    { d: "M240 85 L188 141" },
    { d: "M240 85 L274 131" },
    { d: "M188 141 L274 131" },
  ];
  return (
    <LineArt viewBox="0 0 320 206">
      <Person
        x={64}
        y={44}
        arms={
          <>
            <S at={700} dur={450} d="M-25 30 L-32 84 L-31 90" />
            <S at={760} dur={500} d="M24 30 C38 24 52 12 64 0 L70 -5" />
          </>
        }
      />
      {/* edges first, so the paper-filled nodes sit on top of their ends */}
      {edges.map((e, i) => (
        <S key={e.d} at={1250 + i * 90} dur={420} d={e.d} accent={e.accent} />
      ))}
      {nodes.map((n, i) => (
        <g key={`${n.x}-${n.y}`}>
          <Box x={n.x} y={n.y} w={36} h={22} r={4} at={850 + i * 110} dur={450} accent={n.accent} />
          <S at={1050 + i * 110} dur={250} d={`M${n.x + 9} ${n.y + 11} H${n.x + 25}`} mute />
        </g>
      ))}
    </LineArt>
  );
}

/** Work — investigating: hand to chin, reading a terminal. Lines only; no invented output. */
export function ProjectDeveloper() {
  return (
    <LineArt viewBox="0 0 320 206">
      <Person
        x={76}
        y={44}
        arms={
          <>
            <S at={700} dur={450} d="M-25 30 L-32 84 L-31 90" />
            <S at={760} dur={650} d="M25 30 L32 62 L12 18" />
          </>
        }
      />
      {/* desk and monitor */}
      <S at={600} dur={600} d="M140 150 H316" />
      <S at={900} dur={300} d="M300 150 V196" />
      <Box x={150} y={26} w={160} h={104} r={6} at={800} dur={700} />
      <S at={1100} dur={400} d="M150 42 H310" />
      <S at={1000} dur={350} d="M230 130 V148 M210 148 H250" />
      <Dot cx={161} cy={34} r={2} accent={false} at={1250} />
      <Dot cx={169} cy={34} r={2} accent={false} at={1300} />
      <Dot cx={177} cy={34} r={2} accent={false} at={1350} />
      {/* terminal: a prompt, some output lines, a second prompt with the cursor */}
      <S at={1350} dur={250} d="M162 57 L166 60 L162 63" />
      <S at={1450} dur={400} d="M172 60 H226" />
      <S at={1650} dur={350} d="M162 75 H272" mute />
      <S at={1750} dur={350} d="M162 87 H244" mute />
      <S at={1850} dur={350} d="M162 99 H258" mute />
      <S at={1950} dur={250} d="M162 111 L166 114 L162 117" />
      <rect x={172} y={109} width={6} height={10} fill={RED} stroke="none" className="f" style={timing({ at: 2100 })} />
    </LineArt>
  );
}

/** Contact — connecting: a brief wave and a line reaching a message. */
export function ContactDeveloper() {
  return (
    <LineArt viewBox="0 0 320 206">
      <Person
        x={84}
        y={44}
        arms={
          <>
            <S at={700} dur={450} d="M-25 30 L-32 84 L-31 90" />
            <g className="wave">
              <S at={760} dur={450} d="M24 30 C36 22 42 8 44 -8" />
              <S at={1150} dur={250} d="M44 -8 L45 -16" />
            </g>
          </>
        }
      />
      <S at={1200} dur={700} d="M146 50 C178 26 204 44 220 72" />
      <Dot cx={146} cy={50} r={3} at={1200} />
      <Box x={222} y={74} w={66} h={44} r={4} at={1500} dur={550} />
      <S at={1800} dur={400} d="M224 77 L255 99 L286 77" />
      <Dot cx={288} cy={74} r={4} at={2050} />
    </LineArt>
  );
}
