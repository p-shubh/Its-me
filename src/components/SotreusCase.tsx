import { useId } from "react";
import { evidenceLabels, experience, sotreusCase, type Evidence } from "../data";
import { Figure, Reveal, StackLine } from "./ui";

const cv = experience.find((r) => r.subProject)!.subProject!;

const INK = "#171614";
const MUTE = "#66615a";
const PAPER = "#f5f2ec";

/* ── evidence styling: the same encoding in the diagram, legend and text ── */

const dash: Record<Evidence, string | undefined> = {
  documented: undefined,
  cv: undefined,
  likely: "6 4",
  unverified: "1.5 4",
};

function EvidenceTag({ e, className = "" }: { e: Evidence; className?: string }) {
  const base = "meta inline-flex items-center gap-1.5 rounded px-1.5 py-px font-medium whitespace-nowrap";
  const style: Record<Evidence, string> = {
    documented: "border border-ink/60 text-ink",
    likely: "border border-dashed border-ink/60 text-ink-2",
    unverified: "border border-dotted border-ink/60 text-mute",
    cv: "border border-ink bg-ink text-paper",
  };
  return <span className={`${base} ${style[e]} ${className}`}>{evidenceLabels[e].label}</span>;
}

function Legend() {
  return (
    <dl className="meta grid grid-cols-1 gap-x-8 gap-y-2 text-mute sm:grid-cols-2">
      {(Object.keys(evidenceLabels) as Evidence[]).map((e) => (
        <div key={e} className="flex items-baseline gap-3">
          <dt className="shrink-0">
            <EvidenceTag e={e} />
          </dt>
          <dd>{evidenceLabels[e].meaning}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── architecture diagram ─────────────────────────────────────────────── */

type NodeId = "admin" | "api" | "email" | "clients" | "tunnel" | "dns" | "nat" | "internet";

const nodes: Record<NodeId, { title: string; sub: string; e: Evidence; status: string }> = {
  admin: { title: "Admin dashboard / API", sub: "manages clients", e: "documented", status: "Documented" },
  api: { title: "Sotreus Go API", sub: "REST · gRPC · /docs", e: "documented", status: "Documented" },
  email: { title: "Email service", sub: "SMTP", e: "documented", status: "Documented" },
  clients: { title: "VPN clients", sub: "phones · laptops", e: "documented", status: "Documented" },
  tunnel: {
    title: "WireGuard tunnel endpoint",
    sub: "Likely in public docs",
    e: "cv",
    status: "Confirmed by CV",
  },
  dns: { title: "DNS firewall", sub: "AdGuard or Pi-hole", e: "documented", status: "Documented" },
  nat: { title: "NAT", sub: "iptables", e: "cv", status: "Confirmed by CV" },
  internet: { title: "Internet egress", sub: "public internet", e: "likely", status: "Likely" },
};

type Box = { x: number; y: number; w: number; h: number };
type Edge = { d: string; e: Evidence; label: string; lx: number; ly: number; anchor?: "start" | "middle" | "end"; rotate?: number };

function Diagram({ vb, boxes, edges, title }: { vb: string; boxes: Record<NodeId, Box>; edges: Edge[]; title: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={vb} className="h-auto w-full overflow-visible" role="img" aria-labelledby={`${id}-t`}>
      <title id={`${id}-t`}>{title}</title>
      <defs>
        <marker id={`${id}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1 L9 5 L0 9" fill="none" stroke={INK} strokeWidth="1.4" />
        </marker>
      </defs>

      {edges.map((ed) => (
        <g key={ed.label + ed.d}>
          <path d={ed.d} fill="none" stroke={INK} strokeWidth={1.25} strokeDasharray={dash[ed.e]} markerEnd={`url(#${id}-a)`} />
          <text
            x={ed.lx}
            y={ed.ly}
            textAnchor={ed.anchor ?? "middle"}
            transform={ed.rotate ? `rotate(${ed.rotate} ${ed.lx} ${ed.ly})` : undefined}
            fontSize={12}
            fill={MUTE}
            stroke={PAPER}
            strokeWidth={4}
            paintOrder="stroke"
          >
            {ed.label}
          </text>
        </g>
      ))}

      {(Object.keys(boxes) as NodeId[]).map((k) => {
        const b = boxes[k];
        const n = nodes[k];
        const cx = b.x + b.w / 2;
        return (
          <g key={k}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={6}
              fill={PAPER}
              stroke={INK}
              strokeWidth={n.e === "cv" ? 2 : 1.25}
              strokeDasharray={dash[n.e]}
            />
            <text x={cx} y={b.y + 28} textAnchor="middle" fontSize={15} fontWeight={500} fill={INK}>
              {n.title}
            </text>
            <text x={cx} y={b.y + 47} textAnchor="middle" fontSize={12.5} fill={MUTE}>
              {n.sub}
            </text>
            <text x={cx} y={b.y + b.h - 12} textAnchor="middle" fontSize={11} fontWeight={500} fill={n.e === "cv" ? INK : MUTE}>
              {n.e === "cv" ? "■ " : n.e === "likely" ? "◌ " : "● "}
              {n.status}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const TITLE =
  "Sotreus architecture: an admin adds clients through the Sotreus Go API (REST, gRPC, /docs), which emails VPN configuration through an SMTP service to phones and laptops. Clients connect to a WireGuard tunnel endpoint (confirmed by CV, likely in public docs); DNS goes through an AdGuard or Pi-hole firewall and traffic leaves through iptables NAT to the internet.";

// desktop: two rows, control plane on top, data path below
const wide = {
  vb: "0 0 1000 470",
  boxes: {
    admin: { x: 20, y: 40, w: 190, h: 84 },
    api: { x: 270, y: 40, w: 220, h: 84 },
    email: { x: 560, y: 40, w: 180, h: 84 },
    clients: { x: 805, y: 40, w: 175, h: 84 },
    internet: { x: 20, y: 300, w: 160, h: 84 },
    nat: { x: 240, y: 300, w: 170, h: 84 },
    tunnel: { x: 470, y: 300, w: 260, h: 84 },
    dns: { x: 805, y: 300, w: 175, h: 84 },
  } satisfies Record<NodeId, Box>,
  edges: [
    { d: "M210 82 L268 82", e: "documented", label: "add client", lx: 239, ly: 72 },
    { d: "M490 82 L558 82", e: "documented", label: "VPN config", lx: 524, ly: 72 },
    { d: "M740 82 L803 82", e: "documented", label: "email", lx: 771, ly: 72 },
    { d: "M380 124 C380 214, 560 214, 560 298", e: "cv", label: "peer provisioning", lx: 400, ly: 205, anchor: "end" },
    { d: "M892 124 C892 214, 680 214, 680 298", e: "likely", label: "UDP · encrypted tunnel", lx: 812, ly: 205, anchor: "start" },
    { d: "M730 342 L803 342", e: "likely", label: "DNS", lx: 767, ly: 332 },
    { d: "M470 342 L412 342", e: "likely", label: "traffic", lx: 441, ly: 332 },
    { d: "M240 342 L182 342", e: "likely", label: "egress", lx: 211, ly: 332 },
    { d: "M892 384 L892 440 L100 440 L100 386", e: "likely", label: "filtered DNS upstream", lx: 496, ly: 460 },
  ] satisfies Edge[],
};

// mobile: one column top to bottom, the data path splits at the tunnel
const tall = {
  vb: "0 0 360 870",
  boxes: {
    admin: { x: 50, y: 0, w: 250, h: 76 },
    api: { x: 50, y: 120, w: 250, h: 76 },
    email: { x: 50, y: 240, w: 250, h: 76 },
    clients: { x: 50, y: 360, w: 250, h: 76 },
    tunnel: { x: 30, y: 490, w: 270, h: 76 },
    dns: { x: 0, y: 650, w: 168, h: 76 },
    nat: { x: 192, y: 650, w: 168, h: 76 },
    internet: { x: 100, y: 790, w: 160, h: 76 },
  } satisfies Record<NodeId, Box>,
  edges: [
    { d: "M175 76 L175 118", e: "documented", label: "add client", lx: 185, ly: 102, anchor: "start" },
    { d: "M175 196 L175 238", e: "documented", label: "VPN config", lx: 185, ly: 222, anchor: "start" },
    { d: "M175 316 L175 358", e: "documented", label: "email", lx: 185, ly: 342, anchor: "start" },
    { d: "M165 436 L165 488", e: "likely", label: "UDP · encrypted tunnel", lx: 175, ly: 467, anchor: "start" },
    { d: "M300 158 L342 158 L342 528 L302 528", e: "cv", label: "peer provisioning", lx: 354, ly: 343, rotate: 90 },
    { d: "M110 566 L84 648", e: "likely", label: "DNS", lx: 88, ly: 610, anchor: "end" },
    { d: "M220 566 L276 648", e: "likely", label: "traffic", lx: 256, ly: 610, anchor: "start" },
    { d: "M84 726 L150 788", e: "likely", label: "upstream", lx: 108, ly: 768, anchor: "end" },
    { d: "M276 726 L210 788", e: "likely", label: "egress", lx: 252, ly: 768, anchor: "start" },
  ] satisfies Edge[],
};

/* ── the case study ───────────────────────────────────────────────────── */

export default function SotreusCase({ head }: { head: React.ReactNode }) {
  return (
    <article id="sotreus" className="wrap mt-28 sm:mt-40" aria-label="Sotreus case study">
      {head}

      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-[4/span_9] lg:col-[4/span_6]">
          <p className="max-w-[40rem] text-lede text-pretty">{sotreusCase.summary}</p>
          <p className="meta mt-4 max-w-[40rem] text-mute">{sotreusCase.sourceNote}</p>
        </Reveal>
      </div>

      {/* evidence legend */}
      <Reveal className="mt-12 grid grid-cols-1 gap-4 border-t border-rule pt-5 md:grid-cols-12 md:gap-8">
        <h4 className="meta font-medium md:col-span-3">How to read this case study</h4>
        <div className="md:col-span-9">
          <Legend />
        </div>
      </Reveal>

      {/* architecture */}
      <Reveal className="mt-14">
        <Figure
          no="4"
          caption="Sotreus components and connections. Line and border style follow the evidence legend; heavier borders mark parts confirmed by the CV."
        >
          <div className="border border-rule bg-paper p-4 sm:p-8">
            <div className="hidden lg:block">
              <Diagram vb={wide.vb} boxes={wide.boxes} edges={wide.edges} title={TITLE} />
            </div>
            <div className="mx-auto max-w-[420px] lg:hidden">
              <Diagram vb={tall.vb} boxes={tall.boxes} edges={tall.edges} title={TITLE} />
            </div>
          </div>
        </Figure>
      </Reveal>

      {/* documented capabilities + CV contribution */}
      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-6 lg:col-[1/span_6]">
          <h4 className="flex items-baseline justify-between gap-4 border-b border-rule pb-2 text-h4 font-medium">
            Documented capabilities
            <EvidenceTag e="documented" />
          </h4>
          <ul className="prose-list mt-4 space-y-3 text-ink-2">
            {sotreusCase.capabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.05} className="md:col-span-6 lg:col-[7/span_6]">
          <h4 className="flex items-baseline justify-between gap-4 border-b border-rule pb-2 text-h4 font-medium">
            My contribution
            <EvidenceTag e="cv" />
          </h4>
          <p className="meta mt-3 text-mute">
            {sotreusCase.org} · {sotreusCase.period} — {cv.tagline}
          </p>
          <ul className="prose-list mt-4 space-y-3 text-ink-2">
            {cv.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className="mt-6 border-t border-rule pt-4">
            <StackLine items={cv.stack} />
          </div>
        </Reveal>
      </div>

      {/* five-step sequence: vertical timeline on mobile, five columns on desktop */}
      <section className="mt-16" aria-labelledby="sotreus-seq">
        <Reveal className="grid grid-cols-1 gap-4 border-t border-ink pt-5 md:grid-cols-12 md:gap-8">
          <h4 id="sotreus-seq" className="text-h4 font-medium md:col-span-3">
            Client lifecycle
          </h4>
          <p className="text-ink-2 md:col-span-9">
            Steps 1 and 3 are documented. Steps 2, 4 and 5 follow standard VPN and DNS-firewall patterns and are not
            verified Sotreus implementation details.
          </p>
        </Reveal>
        <ol className="relative mt-8 grid grid-cols-1 lg:grid-cols-5 lg:gap-6">
          {sotreusCase.steps.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] pb-8 lg:block lg:pb-0">
              {/* timeline rail */}
              <span className="absolute top-8 bottom-0 left-[0.6875rem] w-px bg-rule lg:hidden" aria-hidden />
              <span
                className={`relative z-[1] grid size-6 place-items-center rounded-full border text-[0.75rem] font-medium tabular-nums lg:mb-4 ${
                  s.evidence === "documented" ? "border-ink bg-ink text-paper" : "border-dashed border-ink bg-paper text-ink"
                }`}
                aria-hidden
              >
                {i + 1}
              </span>
              <div className="lg:border-t lg:border-rule lg:pt-4">
                <h5 className="font-medium">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h5>
                <EvidenceTag e={s.evidence} className="mt-2" />
                <p className="mt-3 text-ink-2 text-pretty">{s.text}</p>
                {s.note && <p className="meta mt-3 text-mute text-pretty">{s.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Sotreus vs Erebrus */}
      <section className="mt-16" aria-labelledby="sotreus-vs">
        <Reveal className="grid grid-cols-1 gap-4 border-t border-ink pt-5 md:grid-cols-12 md:gap-8">
          <h4 id="sotreus-vs" className="text-h4 font-medium md:col-span-3">
            Sotreus is not Erebrus
          </h4>
          <p className="text-ink-2 md:col-span-9">
            Two different products. Sotreus does not inherit Erebrus&rsquo;s decentralized architecture, node network or
            routing model.
          </p>
        </Reveal>
        <Reveal className="mt-8 grid grid-cols-1 border-t border-rule md:grid-cols-2">
          <div className="border-b border-rule py-6 md:border-b-0 md:pr-8">
            <p className="flex items-baseline justify-between gap-4">
              <span className="font-medium">Sotreus</span>
              <span className="meta text-mute">private, operator-managed VPN</span>
            </p>
            <ul className="prose-list mt-4 space-y-3 text-ink-2">
              {sotreusCase.comparison.sotreus.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="py-6 md:border-l md:border-rule md:pl-8">
            <p className="flex items-baseline justify-between gap-4">
              <span className="font-medium">Erebrus</span>
              <span className="meta text-mute">decentralized VPN · NetSepio</span>
            </p>
            <ul className="prose-list mt-4 space-y-3 text-ink-2">
              {sotreusCase.comparison.erebrus.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
