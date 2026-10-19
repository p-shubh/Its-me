import { Fragment, type ReactNode } from "react";
import { Reveal, SectionHead } from "./ui";

/*
 * How Shubham approaches request security, as seven layers.
 *
 * No company, client or project names appear in this section, by request.
 * Sources: every control without a `source` comes from the CV; the source code is not in
 * this repository, so nothing beyond the CV is claimed. Items with source "platform" describe
 * the documented default behaviour of Cloudflare, not something the CV states. The token
 * bucket and the request decision are conceptual and labelled as such.
 */

type Where = "edge" | "proxy" | "app" | "db" | "ops";

const whereLabel: Record<Where, string> = {
  edge: "Cloudflare edge",
  proxy: "Edge + reverse proxy",
  app: "Go service",
  db: "PostgreSQL",
  ops: "Alongside, out of band",
};

type Item = { text: string; source?: "platform" };

type Layer = {
  name: string;
  short: string;
  where: Where;
  rejects: string;
  items: Item[];
  note?: string;
};

const layers: Layer[] = [
  {
    name: "Edge",
    short: "WAF · bot protection",
    where: "edge",
    rejects: "Bots and blocked IPs",
    items: [
      {
        text: "Closed a WAF bypass: spoofable Origin-header skip rules replaced with IP-based and secret-header rules for monitoring and mobile clients.",
      },
      {
        text: "A Cloudflare Worker on a cron trigger reads the GraphQL Firewall Events API and adds repeat rate-limit offenders to a WAF-enforced IP block list.",
      },
      { text: "A request matching a WAF block rule is stopped at the edge with 403 Forbidden by default.", source: "platform" },
    ],
  },
  {
    name: "Rate limiting",
    short: "Per-IP, at the edge",
    where: "edge",
    rejects: "Requests over the limit",
    items: [
      {
        text: "Investigated 1.01M requests per day of abnormal traffic, 72% from a single scraper IP, and deployed per-IP API rate limiting within Cloudflare Free-plan limits, validated by load testing.",
      },
      {
        text: "A request over the limit is answered by Cloudflare — 429 Too Many Requests by default — and does not reach the origin.",
        source: "platform",
      },
    ],
    note: "Keyed by client IP and enforced only at the Cloudflare edge. No application-level, per-user or per-API-key limiter is claimed here.",
  },
  {
    name: "Transport",
    short: "TLS · HTTPS · Zero Trust",
    where: "proxy",
    rejects: "Plain HTTP, redirected",
    items: [
      { text: "SSL/TLS hardening (HSTS, redirect middleware) behind Cloudflare and Traefik." },
      {
        text: "Cloudflare Access service tokens for monitoring, so Zero Trust no longer silently blocked heartbeats.",
      },
    ],
  },
  {
    name: "Identity",
    short: "Who is calling",
    where: "app",
    rejects: "Unknown callers",
    items: [
      { text: "JWT and PASETO authentication for the REST APIs." },
      { text: "OAuth-authenticated REST API." },
      { text: "PASETO v4 tokens with Ethereum wallet challenge-response." },
      { text: "libp2p Peer ID mutual authentication with a per-environment allowlist — for agents, not users." },
    ],
  },
  {
    name: "Authorization",
    short: "What they may do",
    where: "app",
    rejects: "Out-of-scope actions",
    items: [
      { text: "Role-based access control." },
      {
        text: "Stateless JWT design embedding company scopes, for multi-tenant isolation without session state.",
      },
      {
        text: "Protected superadmin tier: admins cannot modify the superadmin across all 7 user-management actions.",
      },
    ],
  },
  {
    name: "Data",
    short: "Least privilege in PostgreSQL",
    where: "db",
    rejects: "Rows and statements outside policy",
    items: [
      {
        text: "Role isolation across production, development and test; scoped grants without DELETE/TRUNCATE for human users; default privileges; Row Level Security policies.",
      },
    ],
  },
  {
    name: "Operate",
    short: "Watch, recover, release safely",
    where: "ops",
    rejects: "Dirty builds",
    items: [
      { text: "Uptime, memory and disk alerting with Uptime Kuma push monitors and Teams notifications." },
      { text: "Server hardening — SSH keys and config, Fail2ban, UFW, a CVE mitigation — paired with a verifier that checks the result." },
      { text: "Central Prometheus, Grafana and Alertmanager monitoring of prod, staging and dev servers, alerting to Teams." },
      { text: "Release pipeline with a hard gate that blocks dirty builds from becoming release artifacts." },
      { text: "Diagnosed an outage caused by an ioredis/BullMQ connection leak (7,817 of 7,848 Valkey clients)." },
    ],
    note: "The hardening and monitoring scripts are described under Infrastructure toolkit, at the end of Work.",
  },
];

function Reject({ children }: { children: string }) {
  return (
    <span className="meta inline-flex items-start gap-1.5 rounded border border-red/30 bg-red/[0.06] px-2 py-1 leading-snug text-red">
      <svg viewBox="0 0 16 16" className="mt-[0.2em] size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <circle cx="8" cy="8" r="6.2" />
        <path d="M3.7 12.3 L12.3 3.7" />
      </svg>
      {children}
    </span>
  );
}

/* layers that run in the same place, grouped for the overview */
const groups: { where: Where; from: number; to: number }[] = [
  { where: "edge", from: 0, to: 1 },
  { where: "proxy", from: 2, to: 2 },
  { where: "app", from: 3, to: 4 },
  { where: "db", from: 5, to: 5 },
];

/** Wide screens only: the request path in one row, grouped by where each layer runs. */
function Pipeline() {
  const ops = layers[6];
  return (
    <div className="hidden xl:block">
      <ol className="flex items-stretch" aria-label="Request path overview">
        <li className="flex w-[7rem] shrink-0 flex-col justify-center rounded-lg border border-rule bg-[#fbf9f5] p-3">
          <span className="font-semibold">Internet</span>
          <span className="meta text-mute">Users · bots · attackers</span>
        </li>
        {groups.map((g) => (
          <Fragment key={g.where}>
            <li className="flex w-5 shrink-0 items-center justify-center text-mute" aria-hidden>
              →
            </li>
            <li className="flex min-w-0 flex-col" style={{ flex: g.to - g.from + 1 }}>
              <p className="meta mb-2 border-b border-rule pb-1 font-medium text-mute">{whereLabel[g.where]}</p>
              <ol className="flex flex-1 gap-3">
                {layers.slice(g.from, g.to + 1).map((l, k) => (
                  <li key={l.name} className="flex min-w-0 flex-1 flex-col">
                    <div className="flex-1 rounded-lg border border-rule bg-[#fbf9f5] p-3">
                      <span className="meta font-medium text-red tabular-nums">{String(g.from + k + 1).padStart(2, "0")}</span>
                      <p className="mt-1 text-[0.9375rem] leading-tight font-semibold">{l.name}</p>
                      <p className="meta mt-1 text-mute">{l.short}</p>
                    </div>
                    <span className="mx-auto h-3 w-px border-l border-dashed border-red/50" aria-hidden />
                    <Reject>{l.rejects}</Reject>
                  </li>
                ))}
              </ol>
            </li>
          </Fragment>
        ))}
        <li className="flex w-5 shrink-0 items-center justify-center text-mute" aria-hidden>
          →
        </li>
        <li className="flex w-[7.75rem] shrink-0 flex-col justify-center rounded-lg border border-ink bg-ink p-3 text-paper">
          <span className="font-semibold">Application</span>
          <span className="meta text-paper/70">serves what passed</span>
        </li>
      </ol>

      <div className="mt-4 flex items-center gap-4 rounded-lg border border-dashed border-ink/30 px-4 py-3">
        <span className="meta font-medium text-red tabular-nums">07</span>
        <span className="font-semibold">{ops.name}</span>
        <span className="meta text-mute">{ops.short} — runs alongside every layer, not on the request path</span>
        <span className="ml-auto">
          <Reject>{ops.rejects}</Reject>
        </span>
      </div>
    </div>
  );
}

function TokenBucket() {
  const s = { fill: "none", stroke: "#171614", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg
      viewBox="0 0 360 160"
      className="mx-auto h-auto w-full max-w-[340px]"
      role="img"
      aria-label="Token bucket: tokens refill at a fixed rate up to the bucket capacity. A request that finds a token consumes it and is allowed; a request that finds the bucket empty is rejected or throttled."
    >
      <defs>
        <marker id="tb-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1 L8 5 L1 9" fill="none" stroke="#171614" strokeWidth="1.6" />
        </marker>
        <marker id="tb-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1 L8 5 L1 9" fill="none" stroke="#c2370f" strokeWidth="1.6" />
        </marker>
      </defs>
      <path d="M170 2 V32" {...s} markerEnd="url(#tb-a)" />
      <text x={178} y={20} fontSize={13} fill="#66615a">
        refill_rate
      </text>
      <path d="M135 40 L148 128 H192 L205 40 Z" {...s} />
      <path d="M135 40 H205" {...s} />
      {[60, 80, 100].map((y) => (
        <path key={y} d={`M${140 + (y - 40) * 0.14} ${y} H${200 - (y - 40) * 0.14}`} {...s} strokeOpacity={0.35} />
      ))}
      {[156, 170, 184].map((x, i) => (
        <circle key={x} cx={x} cy={118 - i * 10} r={5} fill="#c2370f" stroke="none" />
      ))}
      <text x={170} y={148} fontSize={13} fill="#66615a" textAnchor="middle">
        bucket_capacity
      </text>
      <text x={4} y={84} fontSize={13} fill="#171614">
        request
      </text>
      <path d="M60 80 H128" {...s} markerEnd="url(#tb-a)" />
      <path d="M212 68 H268" {...s} markerEnd="url(#tb-a)" />
      <text x={276} y={72} fontSize={13} fill="#171614">
        allow
      </text>
      <text x={214} y={58} fontSize={11} fill="#66615a">
        token available
      </text>
      <path d="M212 104 H268" {...s} stroke="#c2370f" markerEnd="url(#tb-r)" />
      <text x={276} y={108} fontSize={13} fill="#c2370f">
        reject
      </text>
      <text x={214} y={122} fontSize={11} fill="#66615a">
        bucket empty
      </text>
    </svg>
  );
}

function Code({ children, label }: { children: ReactNode; label: string }) {
  return (
    <pre
      className="overflow-x-auto rounded bg-paper-2 p-3 text-[0.8125rem] leading-relaxed break-words whitespace-pre-wrap xl:whitespace-pre"
      tabIndex={0}
      aria-label={label}
    >
      <code>{children}</code>
    </pre>
  );
}

const Cm = ({ children }: { children: string }) => <span className="text-mute">{children}</span>;
const Rj = ({ children }: { children: string }) => <span className="font-semibold text-red">{children}</span>;

export default function Security() {
  return (
    <section id="security" className="wrap pt-28 pb-16 sm:pt-40 sm:pb-24">
      <SectionHead
        no="03"
        label="Security"
        title="Security, layer by layer."
        lede="Each layer blocks the threats it understands, as early as practical, before traffic reaches more expensive components."
      />

      <Reveal className="mt-6 grid grid-cols-1 md:grid-cols-12 md:gap-8">
        <p className="max-w-[40rem] text-ink-2 text-pretty md:col-[4/span_9]">
          These controls come from different systems, so no single request passes through all of them. Each one is
          tagged with where it runs: the Cloudflare edge, a reverse proxy, the Go service, or PostgreSQL itself.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <Pipeline />
      </Reveal>

      {/* the layers in detail; below xl this is the whole overview */}
      <ol className="relative mt-10 xl:mt-12">
        <span className="absolute top-3 bottom-3 left-[0.6875rem] w-px bg-rule md:hidden" aria-hidden />
        {layers.map((l, i) => (
          <Reveal
            as="li"
            key={l.name}
            className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 pb-8 md:grid-cols-12 md:gap-8 md:border-t md:border-rule md:py-6"
          >
            <span
              className="relative z-[1] grid size-6 place-items-center rounded-full border border-ink bg-paper text-[0.75rem] font-medium tabular-nums md:hidden"
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="md:col-span-3">
              <h3 className="flex items-baseline gap-3">
                <span className="meta hidden w-5 font-medium text-red tabular-nums md:inline">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-h4 font-medium">{l.name}</span>
              </h3>
              <div className="md:ml-8">
                <p className="meta mt-1 text-mute">{l.short}</p>
                <p className="meta mt-2 font-medium text-ink-2">Runs in: {whereLabel[l.where]}</p>
                <div className="mt-2">
                  <Reject>{l.rejects}</Reject>
                </div>
              </div>
            </div>
            <div className="col-start-2 mt-4 md:col-span-9 md:col-start-auto md:mt-0">
              <ul className="prose-list max-w-[52rem] space-y-3 text-ink-2">
                {l.items.map((it) => (
                  <li key={it.text} className="text-pretty">
                    {it.text}
                    {it.source === "platform" && (
                      <span className="meta ml-2 rounded border border-rule px-1.5 py-px whitespace-nowrap text-mute">
                        platform default
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {l.note && <p className="meta mt-4 max-w-[52rem] border-l-2 border-red/40 pl-3 text-ink-2">{l.note}</p>}
            </div>
          </Reveal>
        ))}
      </ol>

      {/* conceptual panels */}
      <div className="mt-4 grid grid-cols-1 gap-10 border-t border-ink pt-8 md:grid-cols-2 md:gap-8">
        <Reveal>
          <h3 className="text-h4 font-medium">How a rate limit decides</h3>
          <p className="meta mt-1 text-mute">Conceptual token-bucket model. The production limit described above is a Cloudflare per-IP rule, not this code.</p>
          <div className="mt-4 space-y-4 rounded-lg border border-rule bg-[#fbf9f5] p-4 sm:p-5">
            <TokenBucket />
            <Code label="Token bucket pseudocode">
              {`tokens = min(bucket_capacity,
             current_tokens + refill_rate × elapsed_time)

if tokens ≥ 1:
    tokens -= 1
    allow()
else:
    `}
              <Rj>reject()</Rj>
              <Cm>{"   # or throttle, per the limiter"}</Cm>
            </Code>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 className="text-h4 font-medium">Conceptual request decision</h3>
          <p className="meta mt-1 text-mute">Illustrative pseudocode, not one rule engine: each block runs in a different component.</p>
          <div className="mt-4 space-y-4 rounded-lg border border-rule bg-[#fbf9f5] p-4 sm:p-5">
            <Code label="Request decision pseudocode">
              <Cm>{"# edge — Cloudflare, before the origin\n"}</Cm>
              {"if ip_blocked or bot_rule_hit:  "}
              <Rj>reject</Rj>
              <Cm>{"  # 403"}</Cm>
              {"\nif over_per_ip_limit:           "}
              <Rj>reject</Rj>
              <Cm>{"  # 429"}</Cm>
              <Cm>{"\n\n# transport — Cloudflare / Traefik\n"}</Cm>
              {"if plain_http:  redirect to https"}
              <Cm>{"  # + HSTS"}</Cm>
              <Cm>{"\n\n# application — Go service\n"}</Cm>
              {"if not authenticated:      "}
              <Rj>reject</Rj>
              <Cm>{"  # 401"}</Cm>
              {"\nif not authorized(scope):  "}
              <Rj>reject</Rj>
              <Cm>{"  # 403"}</Cm>
              {"\nvalidate(input)"}
              <Cm>{"\n\n# database — PostgreSQL, on every query\n"}</Cm>
              {"run as a scoped role; RLS filters rows"}
            </Code>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-[0.7rem] text-paper" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="font-medium">Passes a layer</span>
                  <span className="text-ink-2"> → forwarded to the next component</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-red text-[0.7rem] text-paper" aria-hidden>
                  ✕
                </span>
                <span>
                  <span className="font-medium text-red">Fails a layer</span>
                  <span className="text-ink-2"> → rejected at that enforcement point, with a reason</span>
                </span>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
