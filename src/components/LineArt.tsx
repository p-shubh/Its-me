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

/**
 * Hero — building. A layered side-view character so the hands and keyboard are visible.
 * Every moving part is its own group with its own pivot (see the .hero-char rules in index.css):
 *   .breathe     torso, head and arms rise ~0.7px on a slow breath
 *   .chest       the torso outline swells slightly from the hips
 *   .tilt        hover acknowledgment (desktop only)
 *   .head-idle   occasional small head turns
 *   .eye         irregular blinks
 *   .shoulder-*  shoulders follow their arm's typing a little
 *   .type-*      forearm + hand rotate at the elbow, so hands lift and land on the keyboard
 * Chair, desk, laptop and plant never move. Loops run only while the hero is visible.
 */
export function HeroDeveloper() {
  return (
    <LineArt viewBox="0 0 320 228" loop className="hero-char">
      {/* chair */}
      <S at={0} dur={500} d="M70 150 C66 128 64 108 68 90 L76 89" />
      <Box x={64} y={150} w={60} h={7} r={3} at={100} dur={400} />
      <S at={250} dur={300} d="M94 157 V196" />
      <S at={350} dur={350} d="M70 206 L94 196 L118 206" />
      <Dot cx={70} cy={209} r={2} accent={false} at={600} />
      <Dot cx={118} cy={209} r={2} accent={false} at={650} />

      {/* desk, laptop, plant — static */}
      <S at={150} dur={600} d="M140 144 H304" />
      <S at={400} dur={300} d="M140 144 V152" />
      <S at={450} dur={350} d="M288 144 V222" />
      <Box x={190} y={138} w={70} h={5} r={2} at={500} dur={400} />
      <S at={650} dur={250} d="M198 140.5 H248" mute />
      <S at={600} dur={400} d="M256 140 L272 92 L277 93 L261 141 Z" />
      <S at={700} dur={350} d="M286 144 L284 128 H302 L300 144 Z" accent />
      <S at={850} dur={300} d="M293 128 C291 116 286 110 281 108" />
      <S at={900} dur={300} d="M293 128 C295 114 301 108 307 106" />
      <S at={950} dur={250} d="M293 128 V112" />

      {/* legs — static, seated */}
      <S at={450} dur={400} d="M126 157 L152 157 L153 202 H166" />
      <S at={500} dur={400} d="M129 150 L158 151 L161 202 H175" />

      <g className="breathe">
        {/* far arm, behind the torso */}
        <g className="shoulder-b">
          <S at={850} dur={300} d="M110 92 L131 118" />
          <g className="type-b">
            <S at={1050} dur={350} d="M131 118 L214 133" />
            <S at={1300} dur={200} d="M214 133 C218 132 222 133 225 136" />
          </g>
        </g>

        {/* torso: filled with paper so it hides the far arm */}
        <g className="chest">
          <S at={550} dur={600} fill={PAPER} d="M100 86 C107 80 121 80 128 87 C132 104 132 128 129 152 H98 C95 128 95 104 100 86 Z" />
          <S at={850} dur={300} d="M107 83 C111 90 118 90 122 84" />
          <S at={950} dur={200} d="M121 89 V100" />
        </g>

        {/* head */}
        <g className="tilt">
          <g className="head-idle">
            <S at={600} dur={300} d="M113 75 V82" />
            <circle cx={114} cy={62} r={13} fill={PAPER} pathLength={1} className="d" style={timing({ at: 650, dur: 500 })} />
            <S at={800} dur={400} d="M101 61 C99 48 110 44 119 46 C124 47 127 50 127 53" />
            <S at={950} dur={200} d="M127 60 L130 65 L127 66" />
            <S at={1000} dur={200} d="M110 59 C107 59 107 65 110 65" />
            <g className="eye">
              <Dot cx={121.5} cy={61} r={1.4} accent={false} at={1100} />
            </g>
          </g>
        </g>

        {/* near arm, in front of the torso */}
        <g className="shoulder-a">
          <S at={900} dur={300} d="M117 93 L141 121" />
          <g className="type-a">
            <S at={1100} dur={350} d="M141 121 L200 135" />
            <S at={1350} dur={200} d="M200 135 C204 133 209 134 213 137" />
          </g>
        </g>
      </g>
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
