import { Fragment } from "react";
import { Reveal, SectionHead } from "./ui";

/*
 * How Shubham approaches security: the layers a request passes through, each filled
 * only with controls his CV says he built, tagged with the project they come from.
 * No block percentages or throughput figures are invented; the token bucket and the
 * final-decision rule are labelled as general models.
 */

type Layer = {
  name: string;
  short: string;
  rejects: string;
  items: { text: string; where: string }[];
};

const layers: Layer[] = [
  {
    name: "Edge",
    short: "WAF · bot protection",
    rejects: "Bots and blocked IPs",
    items: [
      {
        text: "Closed a WAF bypass: spoofable Origin-header skip rules replaced with IP-based and secret-header rules for monitoring and mobile clients.",
        where: "Netsepio",
      },
      {
        text: "A Cloudflare Worker on a cron trigger reads the GraphQL Firewall Events API and adds repeat rate-limit offenders to a WAF-enforced IP block list.",
        where: "Netsepio",
      },
    ],
  },
  {
    name: "Rate limiting",
    short: "Per-IP API limits",
    rejects: "Requests over the limit",
    items: [
      {
        text: "Investigated 1.01M requests per day of abnormal traffic, 72% from a single scraper IP, and deployed per-IP API rate limiting within Cloudflare Free-plan limits, validated by load testing.",
        where: "Netsepio",
      },
    ],
  },
  {
    name: "Transport",
    short: "TLS · Zero Trust",
    rejects: "Plain HTTP, redirected",
    items: [
      { text: "SSL/TLS hardening (HSTS, redirect middleware) behind Cloudflare and Traefik.", where: "Intellixente · X-Factor" },
      {
        text: "Cloudflare Access service tokens for monitoring, so Zero Trust no longer silently blocked heartbeats.",
        where: "Netsepio",
      },
    ],
  },
  {
    name: "Identity",
    short: "Who is calling",
    rejects: "Unknown callers",
    items: [
      { text: "JWT and PASETO authentication for the REST APIs.", where: "Intellixente · X-Factor" },
      { text: "OAuth-authenticated REST API.", where: "Lazarus Network" },
      { text: "PASETO v4 tokens with Ethereum wallet challenge-response.", where: "Sotreus" },
      { text: "libp2p Peer ID mutual authentication with a per-environment allowlist.", where: "Atlas" },
    ],
  },
  {
    name: "Authorization",
    short: "What they may do",
    rejects: "Out-of-scope actions",
    items: [
      { text: "Role-based access control.", where: "Intellixente · X-Factor" },
      {
        text: "Stateless JWT design embedding company scopes, for multi-tenant isolation without session state.",
        where: "Intellixente · X-Factor",
      },
      {
        text: "Protected superadmin tier: admins cannot modify the superadmin across all 7 user-management actions.",
        where: "Atlas",
      },
    ],
  },
  {
    name: "Data",
    short: "Least privilege in PostgreSQL",
    rejects: "Rows and statements outside policy",
    items: [
      {
        text: "Role isolation across production, development and test; scoped grants without DELETE/TRUNCATE for human users; default privileges; Row Level Security policies.",
        where: "Netsepio",
      },
    ],
  },
  {
    name: "Operate",
    short: "Watch and recover",
    rejects: "Dirty builds",
    items: [
      { text: "Uptime, memory and disk alerting with Uptime Kuma push monitors and Teams notifications.", where: "Netsepio" },
      { text: "Release pipeline with a hard gate that blocks dirty builds from becoming release artifacts.", where: "Atlas" },
      { text: "Diagnosed an outage caused by an ioredis/BullMQ connection leak (7,817 of 7,848 Valkey clients).", where: "Netsepio" },
    ],
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

/** Desktop: the layers as one horizontal request path. */
function Pipeline() {
  return (
    <ol className="hidden items-stretch lg:flex" aria-label="Request path">
      <li className="flex w-[7.5rem] shrink-0 flex-col justify-center rounded-lg border border-rule bg-[#fbf9f5] p-3">
        <span className="font-semibold">Internet</span>
        <span className="meta text-mute">Users · bots · attackers</span>
      </li>
      {layers.map((l, i) => (
        <Fragment key={l.name}>
          <li className="flex w-6 shrink-0 items-center justify-center text-mute" aria-hidden>
            →
          </li>
          <li className="flex min-w-0 flex-1 flex-col">
            <div className="flex-1 rounded-lg border border-rule bg-[#fbf9f5] p-3">
              <span className="meta font-medium text-red tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-1 text-[0.9375rem] leading-tight font-semibold">{l.name}</p>
              <p className="meta mt-1 text-mute">{l.short}</p>
            </div>
            <span className="mx-auto h-4 w-px border-l border-dashed border-red/50" aria-hidden />
            <Reject>{l.rejects}</Reject>
          </li>
        </Fragment>
      ))}
      <li className="flex w-6 shrink-0 items-center justify-center text-mute" aria-hidden>
        →
      </li>
      <li className="flex w-[7.5rem] shrink-0 flex-col justify-center rounded-lg border border-ink bg-ink p-3 text-paper">
        <span className="font-semibold">Application</span>
        <span className="meta text-paper/70">only what passed</span>
      </li>
    </ol>
  );
}

function TokenBucket() {
  const s = { fill: "none", stroke: "#171614", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[360px]" role="img" aria-label="Token bucket: tokens refill at rate r up to a bucket size b; a request with a token is allowed, a request without one is rejected">
      <defs>
        <marker id="tb-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1 L8 5 L1 9" fill="none" stroke="#171614" strokeWidth="1.6" />
        </marker>
        <marker id="tb-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1 L8 5 L1 9" fill="none" stroke="#c2370f" strokeWidth="1.6" />
        </marker>
      </defs>
      <path d="M170 8 V44" {...s} markerEnd="url(#tb-a)" />
      <text x={178} y={26} fontSize={13} fill="#66615a">
        refill r tokens/s
      </text>
      <path d="M135 52 L148 150 H192 L205 52 Z" {...s} />
      <path d="M135 52 H205" {...s} />
      {[72, 92, 112, 132].map((y) => (
        <path key={y} d={`M${140 + (y - 52) * 0.13} ${y} H${200 - (y - 52) * 0.13}`} {...s} strokeOpacity={0.35} />
      ))}
      {[156, 170, 184].map((x, i) => (
        <circle key={x} cx={x} cy={140 - i * 10} r={5} fill="#c2370f" stroke="none" />
      ))}
      <text x={170} y={172} fontSize={13} fill="#66615a" textAnchor="middle">
        bucket size b
      </text>
      <text x={8} y={96} fontSize={13} fill="#171614">
        request
      </text>
      <path d="M62 92 H128" {...s} markerEnd="url(#tb-a)" />
      <path d="M212 80 H272" {...s} markerEnd="url(#tb-a)" />
      <text x={280} y={84} fontSize={13} fill="#171614">
        allow
      </text>
      <text x={216} y={70} fontSize={11} fill="#66615a">
        token available
      </text>
      <path d="M212 126 H272" {...s} stroke="#c2370f" markerEnd="url(#tb-r)" />
      <text x={280} y={130} fontSize={13} fill="#c2370f">
        reject
      </text>
      <text x={216} y={146} fontSize={11} fill="#66615a">
        bucket empty
      </text>
    </svg>
  );
}

export default function Security() {
  return (
    <section id="security" className="wrap pt-28 pb-24 sm:pt-40 sm:pb-32">
      <SectionHead
        no="03"
        label="Security"
        title="Security, layer by layer."
        lede="How I approach request security: every layer rejects what it can before the next one spends compute on it. Each control below is something I built, tagged with where."
      />

      <Reveal className="mt-14">
        <Pipeline />
      </Reveal>

      {/* the layers in detail; on small screens this is the whole pipeline */}
      <ol className="relative mt-10 lg:mt-14">
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
              <p className="flex items-baseline gap-3">
                <span className="meta hidden font-medium text-red tabular-nums md:inline">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-h4 font-medium">{l.name}</span>
              </p>
              <p className="meta mt-1 text-mute md:ml-8">{l.short}</p>
              <div className="mt-3 md:ml-8">
                <Reject>{l.rejects}</Reject>
              </div>
            </div>
            <ul className="col-start-2 mt-4 space-y-3 md:col-span-9 md:col-start-auto md:mt-0">
              {l.items.map((it) => (
                <li key={it.text} className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-6">
                  <span className="text-ink-2 text-pretty">{it.text}</span>
                  <span className="meta text-mute sm:text-right">{it.where}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>

      {/* general models */}
      <div className="mt-6 grid grid-cols-1 gap-10 border-t border-ink pt-8 md:grid-cols-2 md:gap-8">
        <Reveal>
          <h3 className="text-h4 font-medium">How a rate limit decides</h3>
          <p className="meta mt-1 text-mute">General token-bucket model, not a measured result. Cloudflare&rsquo;s own rules count requests per period.</p>
          <div className="mt-5 rounded-lg border border-rule bg-[#fbf9f5] p-4 sm:p-6">
            <TokenBucket />
            <pre className="mt-4 overflow-x-auto rounded bg-paper-2 p-3 text-[0.8125rem] leading-relaxed">
              <code>{`tokens = min(b, tokens + r × Δt)
if tokens ≥ 1:
    tokens -= 1
    allow()
else:
    reject()`}</code>
            </pre>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 className="text-h4 font-medium">The final decision</h3>
          <p className="meta mt-1 text-mute">Conceptual rule: a request reaches the application only if every layer passes it.</p>
          <div className="mt-5 rounded-lg border border-rule bg-[#fbf9f5] p-4 sm:p-6">
            <pre className="overflow-x-auto rounded bg-paper-2 p-3 text-[0.8125rem] leading-relaxed">
              <code>
                {`ALLOW if edge_ok
      ∧ under_rate_limit
      ∧ tls
      ∧ authenticated
      ∧ authorized_for(scope)
      ∧ row_policy_ok
else `}
                <span className="font-semibold text-red">REJECT</span>
                {` with reason`}
              </code>
            </pre>
            <ul className="mt-5 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-[0.7rem] text-paper" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="font-medium">Allowed</span>
                  <span className="text-ink-2"> → load balancer → application servers</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-red text-[0.7rem] text-paper" aria-hidden>
                  ✕
                </span>
                <span>
                  <span className="font-medium text-red">Rejected</span>
                  <span className="text-ink-2"> → stopped at the first layer that fails, before it costs application compute</span>
                </span>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
