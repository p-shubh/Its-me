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

/** Fig. 1 — producer/consumer decoupling through async pub-sub (X-Factor, Lazarus Network). */
export function PubSubFigure({ accent = INK }: { accent?: string }) {
  return (
    <Svg vb="0 0 420 290" label="Two producers publish into a pub-sub channel that fans out asynchronously to three consumers">
      {(m) => (
        <>
          <Box x={0} y={60} w={100} h={44} lines={["producer"]} />
          <Box x={0} y={176} w={100} h={44} lines={["producer"]} />
          <rect x={150} y={110} width={120} height={60} fill={accent} />
          {[180, 210, 240].map((x) => (
            <line key={x} x1={x} y1={118} x2={x} y2={162} stroke={PAPER} strokeOpacity={0.5} />
          ))}
          <text x={210} y={196} textAnchor="middle" fontSize={14} fill="currentColor">
            pub-sub
          </text>
          {[20, 118, 216].map((y) => (
            <Box key={y} x={320} y={y} w={100} h={44} lines={["consumer"]} />
          ))}
          <path {...line} className="flow" d="M100 82 C 128 82, 124 132, 148 132" markerEnd={m} />
          <path {...line} className="flow" d="M100 198 C 128 198, 124 148, 148 148" markerEnd={m} />
          <path {...line} className="flow" d="M270 132 C 296 132, 292 42, 318 42" markerEnd={m} />
          <path {...line} className="flow" d="M270 140 L 318 140" markerEnd={m} />
          <path {...line} className="flow" d="M270 148 C 296 148, 292 238, 318 238" markerEnd={m} />
          {/* dimension line */}
          <g opacity={0.7}>
            <line x1={100} y1={262} x2={320} y2={262} stroke="currentColor" />
            <line x1={100} y1={255} x2={100} y2={269} stroke="currentColor" />
            <line x1={320} y1={255} x2={320} y2={269} stroke="currentColor" />
            <text x={210} y={285} textAnchor="middle" fontSize={12} fill="currentColor">
              decoupled · async
            </text>
          </g>
        </>
      )}
    </Svg>
  );
}

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

/** Fig. 3 — Atlas: agents → libp2p → control plane → TimescaleDB → dashboard. */
export function AtlasFigure() {
  return (
    <Svg
      vb="0 0 420 380"
      label="Three Go agents stream host metrics over libp2p with Peer ID mutual authentication to a control plane, which stores them in PostgreSQL plus TimescaleDB and serves a React TypeScript dashboard"
    >
      {(m) => (
        <>
          {[0, 62, 124].map((y) => (
            <Box key={y} x={0} y={y} w={112} h={44} lines={["Go agent"]} />
          ))}
          <Box x={196} y={52} w={136} h={64} lines={["control", "plane"]} accent={INK} />
          {[22, 84, 146].map((y) => (
            <path key={y} {...line} className="flow" d={`M112 ${y} C 150 ${y}, 156 84, 194 84`} markerEnd={m} />
          ))}
          <text x={0} y={198} fontSize={12} fill="currentColor" opacity={0.8}>
            libp2p · Peer ID mutual auth
          </text>

          <path {...line} d="M264 116 L264 214" markerEnd={m} />
          <Box x={196} y={218} w={136} h={56} lines={["PostgreSQL", "+ TimescaleDB"]} />
          <path {...line} d="M264 274 L264 318" markerEnd={m} />
          <Box x={196} y={322} w={136} h={56} lines={["React / TS", "dashboard"]} />

          {/* side annotations */}
          <g fontSize={12} fill="currentColor">
            <line x1={332} y1={84} x2={350} y2={84} stroke="currentColor" />
            <text x={354} y={80}>per-env</text>
            <text x={354} y={95}>allowlist</text>
            <line x1={332} y1={246} x2={350} y2={246} stroke="currentColor" />
            <text x={354} y={242}>17 GB</text>
            <text x={354} y={257}>→ 1.1 GB</text>
          </g>

          <g fontSize={12} fill="currentColor">
            <text x={0} y={244} opacity={0.75}>roles</text>
            {["viewer", "operator", "admin"].map((r, i) => (
              <text key={r} x={0} y={266 + i * 18}>
                {r}
              </text>
            ))}
            <rect x={-4} y={311} width={100} height={22} fill={INK} />
            <text x={2} y={326} fill={PAPER}>
              superadmin
            </text>
          </g>
        </>
      )}
    </Svg>
  );
}

/** Fig. 4 — trading calculator: signals in, P&L computed, broadcast out. */
export function TradingFigure() {
  return (
    <Svg
      vb="0 0 420 220"
      label="Market signals stream into a Go WebSocket server that computes position P and L, tracks per-client sessions and broadcasts to four concurrent clients"
    >
      {(m) => (
        <>
          <Box x={0} y={78} w={104} h={56} lines={["market", "signals"]} />
          <path {...line} className="flow" d="M104 106 L148 106" markerEnd={m} />
          <Box x={150} y={56} w={124} h={100} lines={["WebSocket", "server", "P&L · sessions"]} accent={INK} />
          {[8, 62, 116, 170].map((y) => (
            <g key={y}>
              <path {...line} className="flow" d={`M274 106 C 300 106, 300 ${y + 18}, 326 ${y + 18}`} markerEnd={m} />
              <Box x={328} y={y} w={92} h={36} lines={["client"]} size={13} />
            </g>
          ))}
          <text x={212} y={180} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.8}>
            sub-ms broadcast
          </text>
        </>
      )}
    </Svg>
  );
}

/** Fig. 5 — Sotreus: authenticated API provisioning isolated WireGuard + PiHole instance pairs. */
export function SotreusFigure() {
  return (
    <Svg
      vb="0 0 420 270"
      label="A gRPC and REST API with PASETO v4 and Ethereum wallet authentication provisions isolated instances, each pairing a WireGuard VPN with a PiHole DNS firewall"
    >
      {(m) => (
        <>
          <Box x={0} y={92} w={124} h={86} lines={["gRPC + REST", "PASETO v4", "wallet auth"]} />
          {[0, 146].map((y, i) => (
            <g key={y}>
              <Frame x={170} y={y} w={250} h={124} label={`instance ${i + 1}`} />
              <Box x={184} y={y + 38} w={102} h={44} lines={["WireGuard"]} size={13} accent={INK} />
              <Box x={304} y={y + 38} w={102} h={44} lines={["PiHole DNS"]} size={13} />
              <line x1={286} y1={y + 60} x2={304} y2={y + 60} stroke="currentColor" />
              <text x={184} y={y + 108} fontSize={11} fill="currentColor" opacity={0.75}>
                own port · own volume
              </text>
            </g>
          ))}
          <path {...line} d="M124 120 C 146 120, 146 62, 168 62" markerEnd={m} />
          <path {...line} d="M124 150 C 146 150, 146 208, 168 208" markerEnd={m} />
        </>
      )}
    </Svg>
  );
}
