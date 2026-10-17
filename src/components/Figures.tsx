import { useId, type ReactNode } from "react";

// Blueprint-style figures. Each depicts only what the CV documents for that piece of work.
// Strokes use currentColor so a figure works on paper and on the dark Atlas spread.

const PAPER = "#f5f2ec";
// highlighted nodes are filled with the page's charcoal ink
const INK = "#171614";

type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  accent?: string;
  size?: number;
  dashed?: boolean;
};

function Box({ x, y, w, h, lines, accent, size = 15, dashed }: BoxProps) {
  const lh = size * 1.2;
  const top = y + h / 2 - ((lines.length - 1) * lh) / 2 + size * 0.35;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ?? "none"}
        stroke={accent ?? "currentColor"}
        strokeWidth={1.25}
        strokeDasharray={dashed ? "3 4" : undefined}
      />
      {lines.map((l, i) => (
        <text
          key={l}
          x={x + w / 2}
          y={top + i * lh}
          textAnchor="middle"
          fontSize={i === 0 ? size : size - 2}
          fill={accent ? PAPER : "currentColor"}
          opacity={i === 0 || accent ? 1 : 0.72}
        >
          {l}
        </text>
      ))}
    </g>
  );
}

function Frame({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1} />
      <text x={x + 10} y={y + 20} fontSize={13} fill="currentColor" opacity={0.8}>
        {label}
      </text>
    </g>
  );
}

function Svg({ vb, label, children }: { vb: string; label: string; children: (m: string) => ReactNode }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={vb} className="fig h-auto w-full overflow-visible" role="img" aria-label={label}>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1 L9 5 L0 9" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </marker>
      </defs>
      {children(`url(#${id})`)}
    </svg>
  );
}

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.25 } as const;

/** Fig. 2 — Netsepio ecosystem platform: edge protection on Cloudflare in front of a Vultr origin. */
export function NetsepioFigure() {
  return (
    <Svg
      vb="0 0 420 470"
      label="Client traffic passes Cloudflare per-IP rate limiting and a WAF IP block list fed by a cron Worker, then reaches the Vultr origin running the Next.js web app, mobile API and BullMQ workers backed by Valkey and PostgreSQL"
    >
      {(m) => (
        <>
          <Box x={95} y={0} w={230} h={52} lines={["client traffic", "1.01M req/day · 72% one IP"]} />
          <path {...line} d="M210 52 L210 92" markerEnd={m} />

          <Frame x={0} y={96} w={420} h={110} label="Cloudflare" />
          <Box x={18} y={134} w={180} h={54} lines={["per-IP", "rate limit"]} />
          <Box x={222} y={134} w={180} h={54} lines={["WAF", "IP block list"]} accent={INK} />

          <Box x={222} y={240} w={180} h={54} lines={["Worker · cron", "Firewall Events API"]} dashed />
          <path {...line} className="flow" d="M108 188 C 108 228, 160 267, 220 267" markerEnd={m} />
          <path {...line} className="flow" d="M312 240 L312 190" markerEnd={m} />
          <text x={96} y={302} fontSize={12} fill="currentColor" opacity={0.75}>
            repeat offenders
          </text>

          <path {...line} d="M60 206 L60 326" markerEnd={m} />

          <Frame x={0} y={330} w={420} h={140} label="Vultr" />
          <Box x={14} y={360} w={124} h={44} lines={["Next.js app"]} size={13} />
          <Box x={148} y={360} w={124} h={44} lines={["mobile API"]} size={13} />
          <Box x={282} y={360} w={124} h={44} lines={["BullMQ workers"]} size={13} />
          <Box x={14} y={414} w={190} h={40} lines={["PostgreSQL · RLS"]} size={13} />
          <Box x={216} y={414} w={190} h={40} lines={["Valkey"]} size={13} />
        </>
      )}
    </Svg>
  );
}
