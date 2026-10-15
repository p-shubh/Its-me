import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import actions from "../assets/icons/github-actions.webp";
import aws from "../assets/icons/aws.webp";
import cloudflare from "../assets/icons/cloudflare.webp";
import docker from "../assets/icons/docker.webp";
import gcp from "../assets/icons/gcp.webp";
import go from "../assets/icons/go.webp";
import postgres from "../assets/icons/postgresql.webp";
import postman from "../assets/icons/postman.webp";
import redis from "../assets/icons/redis.webp";
import supabase from "../assets/icons/supabase.webp";
import vscode from "../assets/icons/vscode.webp";
import vultr from "../assets/icons/vultr.webp";
import typing from "../assets/dev-typing.webp";

/*
 * Hero diagram: how Shubham builds, ships and runs backend services, using only tools
 * from the CV (plus VS Code). Laptop and up: one SVG that scales as a unit.
 * Below lg: the same content as stacked cards.
 */

const INK = "#171614";
const MUTE = "#66615a";
const RED = "#c2370f";
const CARD = "#fbf9f5";
const LINE = "rgba(23,22,20,0.16)";

const GH =
  "M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z";

type Glyph = { img?: string; draw?: "github" | "terminal" | "pay" | "api" | "users" };
type Node = { title: string; sub: string[]; icon: Glyph };

const N = {
  github: { title: "GitHub", sub: ["Code and", "version control"], icon: { draw: "github" } },
  actions: { title: "GitHub Actions", sub: ["CI/CD pipeline"], icon: { img: actions } },
  docker: { title: "Docker", sub: ["Containerize", "services"], icon: { img: docker } },
  cloud: { title: "Cloud servers", sub: ["AWS · GCP · Vultr · Cloudflare"], icon: {} },
  vscode: { title: "VS Code", sub: ["Development", "environment"], icon: { img: vscode } },
  go: { title: "Go", sub: ["Backend APIs", "and workers"], icon: { img: go } },
  postman: { title: "Postman", sub: ["API testing"], icon: { img: postman } },
  local: { title: "Local dev", sub: ["Docker Compose"], icon: { draw: "terminal" } },
  postgres: { title: "PostgreSQL", sub: ["Primary database", "+ TimescaleDB"], icon: { img: postgres } },
  redis: { title: "Redis", sub: ["Caching and", "Redis Streams"], icon: { img: redis } },
  supabase: { title: "Supabase", sub: ["Hosted Postgres"], icon: { img: supabase } },
  pay: { title: "Integrations", sub: ["Stripe · MailGun"], icon: { draw: "pay" } },
  apis: { title: "APIs & services", sub: ["REST APIs", "gRPC services", "WebSocket", "event workers"], icon: { draw: "api" } },
  users: { title: "Users / clients", sub: ["Web, mobile and", "external systems"], icon: { draw: "users" } },
} satisfies Record<string, Node>;

type Id = keyof typeof N;

/* ── drawn glyphs, 44×44 box ─────────────────────────────────────────── */
function DrawnGlyph({ kind }: { kind: NonNullable<Glyph["draw"]> }) {
  const s = { fill: "none", stroke: INK, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (kind) {
    case "github":
      return <path d={GH} transform="translate(3 3) scale(1.6)" fill={INK} />;
    case "terminal":
      return (
        <>
          <rect x={2} y={6} width={40} height={32} rx={5} fill={INK} />
          <path d="M10 16 L16 22 L10 28" {...s} stroke={CARD} />
          <path d="M20 29 H30" {...s} stroke={CARD} />
        </>
      );
    case "pay":
      return (
        <>
          <rect x={3} y={8} width={38} height={28} rx={4} {...s} />
          <path d="M3 15 L22 26 L41 15" {...s} stroke={RED} />
        </>
      );
    case "api":
      return (
        <>
          {[4, 17, 30].map((y) => (
            <g key={y}>
              <rect x={4} y={y} width={36} height={10} rx={2} {...s} />
              <circle cx={10} cy={y + 5} r={1.6} fill={INK} />
              <path d={`M16 ${y + 5} H32`} {...s} strokeWidth={1.6} />
            </g>
          ))}
        </>
      );
    case "users":
      return (
        <>
          <circle cx={22} cy={13} r={7} fill={INK} />
          <path d="M9 38 C9 28 35 28 35 38 Z" fill={INK} />
          <circle cx={8} cy={17} r={5} fill={INK} />
          <circle cx={36} cy={17} r={5} fill={INK} />
          <path d="M0 36 C0 28 10 26 13 29 M44 36 C44 28 34 26 31 29" {...s} />
        </>
      );
  }
}

/* ── SVG layout (viewBox 1120 × 780) ─────────────────────────────────── */
type Box = { x: number; y: number; w: number; h: number };
const L: Record<Id, Box> = {
  github: { x: 0, y: 20, w: 200, h: 100 },
  actions: { x: 270, y: 20, w: 230, h: 100 },
  docker: { x: 570, y: 20, w: 170, h: 100 },
  cloud: { x: 810, y: 20, w: 310, h: 120 },
  vscode: { x: 0, y: 170, w: 200, h: 82 },
  go: { x: 0, y: 268, w: 200, h: 82 },
  postman: { x: 0, y: 366, w: 200, h: 82 },
  local: { x: 0, y: 464, w: 200, h: 82 },
  postgres: { x: 700, y: 200, w: 210, h: 82 },
  redis: { x: 700, y: 296, w: 210, h: 82 },
  supabase: { x: 700, y: 392, w: 210, h: 82 },
  pay: { x: 700, y: 488, w: 210, h: 82 },
  apis: { x: 950, y: 200, w: 170, h: 178 },
  users: { x: 950, y: 432, w: 170, h: 132 },
};

function Card({ id, at }: { id: Id; at: number }) {
  const reduce = useReducedMotion();
  const b = L[id];
  const n: Node = N[id];
  const stacked = id === "apis" || id === "users"; // icon above the text
  const ix = b.x + 16;
  const iy = stacked ? b.y + 14 : b.y + (b.h - 44) / 2;
  const tx = stacked ? b.x + 16 : b.x + 72;
  const ty = stacked ? b.y + 82 : b.y + (n.sub.length > 1 ? 32 : 40);

  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: at, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={12} fill={CARD} stroke={LINE} />
      {id === "cloud" ? (
        <>
          {[aws, gcp, vultr, cloudflare].map((src, i) => (
            <image key={src} href={src} x={b.x + 18 + i * 72} y={b.y + 12} width={60} height={46} preserveAspectRatio="xMidYMid meet" />
          ))}
          <text x={b.x + 18} y={b.y + 86} fontSize={19} fontWeight={600} fill={INK}>
            {n.title}
          </text>
          <text x={b.x + 18} y={b.y + 107} fontSize={15} fill={MUTE}>
            {n.sub[0]}
          </text>
        </>
      ) : (
        <>
          <g transform={`translate(${ix} ${iy})`}>
            {n.icon.img ? (
              <image href={n.icon.img} width={44} height={44} preserveAspectRatio="xMidYMid meet" />
            ) : (
              <DrawnGlyph kind={n.icon.draw!} />
            )}
          </g>
          <text x={tx} y={ty} fontSize={19} fontWeight={600} fill={INK}>
            {n.title}
          </text>
          {n.sub.map((s, i) => (
            <text key={s} x={tx} y={ty + 21 + i * 19} fontSize={15} fill={MUTE}>
              {s}
            </text>
          ))}
          {id === "actions" && (
            <>
              <rect x={b.x + 72} y={b.y + 62} width={140} height={24} rx={12} fill="rgba(23,22,20,0.06)" />
              <text x={b.x + 142} y={b.y + 79} fontSize={13} fill={MUTE} textAnchor="middle">
                Build · Test · Deploy
              </text>
            </>
          )}
        </>
      )}
    </motion.g>
  );
}

function Arrow({ d, red, label, lx, ly, anchor = "middle" }: { d: string; red?: boolean; label?: string; lx?: number; ly?: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={red ? RED : INK}
        strokeOpacity={red ? 0.85 : 0.7}
        strokeWidth={1.6}
        strokeDasharray="5 6"
        strokeLinecap="round"
        className={red ? "flow" : undefined}
        markerEnd={`url(#hs-${red ? "red" : "ink"})`}
      />
      {label && (
        <text x={lx} y={ly} fontSize={14} fill={MUTE} textAnchor={anchor}>
          {label}
        </text>
      )}
    </>
  );
}

const LABEL =
  "How Shubham builds, ships and runs backend services. Code lives on GitHub; a push triggers GitHub Actions (build, test, deploy), which containerizes services with Docker and deploys them to cloud servers on AWS, GCP, Vultr and Cloudflare. Development uses VS Code, Go, Postman and Docker Compose locally. The running services — REST APIs, gRPC services, WebSocket and event workers — use PostgreSQL with TimescaleDB, Redis caching and Streams, Supabase, and Stripe and MailGun, and serve web, mobile and external clients.";

function Diagram() {
  const toolMids = [211, 309, 407, 505];
  const dataMids = [241, 337, 433, 529];
  return (
    <svg viewBox="0 0 1120 780" className="h-auto w-full overflow-visible" role="img" aria-label={LABEL}>
      <defs>
        {[
          ["ink", INK],
          ["red", RED],
        ].map(([id, c]) => (
          <marker key={id} id={`hs-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1 1 L8 5 L1 9" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
          </marker>
        ))}
      </defs>

      {/* pipeline */}
      <Arrow d="M204 70 H264" label="Push code" lx={234} ly={58} />
      <Arrow d="M504 70 H564" label="Automate" lx={534} ly={58} />
      <Arrow d="M744 70 H804" label="Deploy" lx={774} ly={58} />
      <Arrow d="M1035 144 V194" label="Run services" lx={1025} ly={174} anchor="end" />
      <Arrow d="M900 144 C900 230 560 210 512 372" red />

      {/* tools → plan → developer */}
      {toolMids.map((m) => (
        <Arrow key={m} d={`M204 ${m} C224 ${m} 214 348 234 348`} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={238} y={300} width={104} height={96} rx={12} fill="#f3e3d8" stroke="rgba(194,55,15,0.25)" />
        {["Plan", "Build", "Develop"].map((t, i) => (
          <text key={t} x={290} y={329 + i * 22} fontSize={17} fontWeight={600} fill={INK} textAnchor="middle">
            {t}
          </text>
        ))}
      </motion.g>
      <Arrow d="M344 360 C380 368 392 392 404 414" />

      {/* developer */}
      <g className="hero-breathe">
        <image href={typing} x={300} y={404} width={400} height={371} />
      </g>

      {/* data and integrations */}
      <path d="M680 241 V600" fill="none" stroke={RED} strokeOpacity={0.85} strokeWidth={1.6} strokeDasharray="5 6" className="flow" />
      <path d="M640 600 H680" fill="none" stroke={RED} strokeOpacity={0.85} strokeWidth={1.6} strokeDasharray="5 6" className="flow" />
      {dataMids.map((m) => (
        <Arrow key={m} d={`M680 ${m} H696`} red />
      ))}
      {dataMids.map((m) => (
        <path key={`r${m}`} d={`M910 ${m} H930`} fill="none" stroke={RED} strokeOpacity={0.85} strokeWidth={1.6} strokeDasharray="5 6" />
      ))}
      <path d="M930 241 V529" fill="none" stroke={RED} strokeOpacity={0.85} strokeWidth={1.6} strokeDasharray="5 6" className="flow" />
      <Arrow d="M930 275 H946" red />
      <Arrow d="M1035 378 V426" />

      {(Object.keys(L) as Id[]).map((id, i) => (
        <Card key={id} id={id} at={0.15 + i * 0.05} />
      ))}
    </svg>
  );
}

/* ── below lg: the same content as stacked cards ─────────────────────── */
function MiniCard({ id }: { id: Id }) {
  const n: Node = N[id];
  return (
    <li className="flex items-center gap-2.5 rounded-xl border border-rule bg-[#fbf9f5] p-2.5 sm:gap-3 sm:p-3">
      <span className="grid size-9 shrink-0 place-items-center sm:size-10">
        {id === "cloud" ? (
          <img src={aws} alt="" className="h-auto w-10" />
        ) : n.icon.img ? (
          <img src={n.icon.img} alt="" className="max-h-10 w-10 object-contain" />
        ) : (
          <svg viewBox="0 0 44 44" className="size-9" aria-hidden>
            <DrawnGlyph kind={n.icon.draw!} />
          </svg>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.875rem] leading-tight font-semibold sm:text-[0.9375rem]">{n.title}</span>
        <span className="block text-[0.8125rem] leading-snug text-mute">{n.sub.join(id === "apis" ? " · " : " ")}</span>
      </span>
    </li>
  );
}

function Group({ title, ids }: { title: ReactNode; ids: Id[] }) {
  return (
    <div>
      <p className="meta mb-2 font-medium text-red">{title}</p>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {ids.map((id) => (
          <MiniCard key={id} id={id} />
        ))}
      </ul>
    </div>
  );
}

export default function HeroStack() {
  return (
    <>
      <div className="hidden lg:block">
        <Diagram />
      </div>
      <div className="lg:hidden">
        <div className="hero-breathe-wrap mx-auto max-w-[300px]">
          <img src={typing} width={900} height={835} alt="" className="hero-breathe h-auto w-full" />
        </div>
        <div className="mt-8 space-y-6">
          <Group title="Build" ids={["vscode", "go", "postman", "local"]} />
          <Group title="Ship — push code, automate, deploy" ids={["github", "actions", "docker", "cloud"]} />
          <Group title="Run" ids={["postgres", "redis", "supabase", "pay", "apis", "users"]} />
        </div>
      </div>
    </>
  );
}
