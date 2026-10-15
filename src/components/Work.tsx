import type { ReactNode } from "react";
import { atlas, experience, myriadflow, netsepio, trading } from "../data";
import { AtlasFigure, NetsepioFigure, SotreusFigure, TradingFigure } from "./Figures";
import { Figure, Reveal, SectionHead, StackLine } from "./ui";

const sotreus = experience.find((r) => r.subProject)!.subProject!;

const index = [
  { id: "netsepio", name: netsepio.name, kind: netsepio.kind, line: "Peer-to-peer DePIN contribution and production edge security" },
  { id: "atlas", name: atlas.name, kind: atlas.kind, line: "Fleet observability over libp2p, end to end" },
  { id: "trading", name: trading.name, kind: trading.kind, line: "Live signal streaming and P&L over WebSocket" },
  { id: "sotreus", name: "Sotreus", kind: "Lazarus Network", line: "Multi-instance WireGuard VPN orchestration" },
  { id: "myriadflow", name: myriadflow.name, kind: myriadflow.kind, line: "Event-driven NFT marketplace backend" },
];

function CaseHead({
  no,
  kind,
  name,
  sub,
  night = false,
  note,
}: {
  no: string;
  kind: string;
  name: string;
  sub: string;
  night?: boolean;
  note?: ReactNode;
}) {
  return (
    <Reveal className={`grid gap-4 border-t pt-5 grid-cols-1 md:grid-cols-12 md:gap-8 ${night ? "border-paper" : "border-ink"}`}>
      <div className="md:col-span-3">
        <p className="meta">
          <span className={night ? "text-red-bright" : "text-red"}>Case {no}</span>
        </p>
        <p className={`mt-1 ${night ? "text-night-mute" : "text-ink-2"}`}>{kind}</p>
      </div>
      <div className="md:col-span-9">
        <h3 className="display text-[clamp(3.5rem,11vw,10rem)] leading-[0.85]">{name}</h3>
        <p className="display mt-[0.6em] text-[clamp(1.5rem,2.6vw,2.25rem)] italic">{sub}</p>
        {note && <div className="mt-5">{note}</div>}
      </div>
    </Reveal>
  );
}

function Points({ items, night = false }: { items: string[]; night?: boolean }) {
  return (
    <ul className={`prose-list space-y-4 text-[1.0625rem] leading-relaxed text-pretty ${night ? "text-paper/85" : "text-ink-2"}`}>
      {items.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}

function Label({ children, night = false }: { children: ReactNode; night?: boolean }) {
  return (
    <h4 className={`mb-4 border-b pb-2 font-medium ${night ? "border-rule-night" : "border-rule"}`}>{children}</h4>
  );
}

export default function Work() {
  return (
    <section id="work" className="pb-8">
      <div className="wrap">
        <SectionHead
          no="02"
          label="Selected work"
          title={
            <>
              Five pieces of <em className="text-red">work</em>, read closely.
            </>
          }
        />

        <Reveal className="mt-12 md:ml-[calc(25%+0.5rem)]">
          <ol className="border-t border-rule">
            {index.map((p, i) => (
              <li key={p.id} className="border-b border-rule">
                <a href={`#${p.id}`} className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-4 sm:grid-cols-[3rem_14rem_1fr_auto]">
                  <span className="meta text-mute">0{i + 1}</span>
                  <span className="display text-[1.9rem] leading-none transition-colors group-hover:text-red">{p.name}</span>
                  <span className="col-start-2 text-ink-2 sm:col-start-auto">{p.line}</span>
                  <span className="meta col-start-2 text-mute sm:col-start-auto">{p.kind}</span>
                </a>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      {/* ── Case 01 · Netsepio ─────────────────────────────── */}
      <article id="netsepio" className="wrap mt-28 sm:mt-40" aria-label={`${netsepio.name} case study`}>
        <CaseHead no="01" kind={`${netsepio.kind} · DePIN`} name={netsepio.name} sub={netsepio.subtitle} />

        <div className="mt-12 grid gap-12 grid-cols-1 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-7 lg:col-[4/span_5]">
            <Label>The contribution</Label>
            <Points items={netsepio.intro} />
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-5 lg:col-span-4">
            <div className="bg-red p-6 text-paper sm:p-8">
              <p className="text-[clamp(3.5rem,7vw,6rem)] leading-[0.85] font-extrabold tracking-[-0.05em]">1.01M</p>
              <p className="mt-4 text-lg leading-snug font-medium">
                requests per day of abnormal traffic — 72% of it from a single scraper IP.
              </p>
              <p className="mt-6 border-t border-paper/40 pt-4 text-[0.95rem] leading-relaxed">
                Answered with per-IP API rate limiting inside Cloudflare Free-plan limits, validated by load testing.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-14 grid-cols-1 md:grid-cols-12 md:gap-8 lg:mt-24">
          <Reveal className="md:col-span-5">
            <div className="md:sticky md:top-24">
              <Figure
                no="2"
                caption="The NetSepio ecosystem platform as operated: Cloudflare at the edge, a cron Worker feeding the WAF block list, and a Vultr origin."
              >
                <NetsepioFigure />
              </Figure>
            </div>
          </Reveal>

          <div className="md:col-span-7 lg:col-[7/span_6]">
            <Label>In production — seven entries</Label>
            <ol>
              {netsepio.log.map((l, i) => (
                <Reveal as="li" key={l.text} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-rule py-6 first:pt-2">
                  <span className="meta pt-2 text-red">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h5 className="display text-[1.75rem] leading-tight">{l.title}</h5>
                    <p className="mt-2 leading-relaxed text-ink-2 text-pretty">{l.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
        <Reveal className="mt-10 border-t border-rule pt-5 lg:ml-[calc(25%+0.5rem)]">
          <StackLine items={netsepio.stack} />
        </Reveal>
      </article>

      {/* ── Case 02 · Atlas — the dark spread ─────────────── */}
      <article id="atlas" className="mt-28 bg-ink py-20 text-paper sm:mt-40 sm:py-28" aria-label={`${atlas.name} case study`}>
        <div className="wrap">
          <CaseHead
            no="02"
            kind={atlas.kind}
            name={atlas.name}
            sub={atlas.subtitle}
            night
            note={
              <p className="inline-flex items-center gap-3 text-night-mute">
                <span className="size-2 shrink-0 bg-red-bright" aria-hidden />
                {atlas.note}
              </p>
            }
          />

          <div className="mt-14 grid gap-14 grid-cols-1 md:grid-cols-12 md:gap-8 lg:mt-20">
            <Reveal className="md:col-span-5">
              <div className="md:sticky md:top-24">
                <Figure
                  night
                  no="3"
                  caption="Go agents stream host metrics to the control plane over libp2p; the control plane stores them in PostgreSQL + TimescaleDB and serves the dashboard."
                >
                  <AtlasFigure />
                </Figure>
              </div>
            </Reveal>

            <div className="space-y-12 md:col-span-7 lg:col-[7/span_6]">
              <Reveal>
                <Label night>What it is</Label>
                <Points night items={[atlas.points[0]]} />
              </Reveal>
              <Reveal>
                <Label night>Identity and access</Label>
                <Points night items={[atlas.points[1], atlas.points[2]]} />
              </Reveal>
              <Reveal>
                <Label night>Releases and operations</Label>
                <Points night items={[atlas.points[3], atlas.points[4]]} />
              </Reveal>
              <Reveal>
                <Label night>Recovery</Label>
                <p className="display text-[clamp(3rem,6vw,5rem)] leading-none">
                  17 GB <span className="text-red-bright">→</span> 1.1 GB
                </p>
                <div className="mt-5">
                  <Points night items={[atlas.points[5]]} />
                </div>
              </Reveal>
            </div>
          </div>
          <Reveal className="mt-14 border-t border-rule-night pt-5 lg:ml-[calc(25%+0.5rem)]">
            <StackLine night items={atlas.stack} />
          </Reveal>
        </div>
      </article>

      {/* ── Case 03 · Trading calculator ─────────────────── */}
      <article id="trading" className="wrap mt-28 sm:mt-40" aria-label={`${trading.name} case study`}>
        <CaseHead no="03" kind={trading.kind} name={trading.name} sub={trading.subtitle} />
        <div className="mt-12 grid gap-12 grid-cols-1 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-7">
            <Figure no="4" caption={`${trading.tagline}: signals stream in, position P&L is computed per client, updates fan out to concurrent subscribers.`}>
              <div className="bg-paper-2 p-5 sm:p-8">
                <TradingFigure />
              </div>
            </Figure>
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-5 lg:col-[9/span_4]">
            <p className="display text-[clamp(2.4rem,3.6vw,3.4rem)] leading-none">Sub-millisecond</p>
            <p className="mt-2 text-ink-2">broadcast latency to multiple concurrent clients</p>
            <div className="mt-8">
              <Points items={trading.points} />
            </div>
            <div className="mt-8 border-t border-rule pt-5">
              <StackLine items={trading.stack} />
            </div>
          </Reveal>
        </div>
      </article>

      {/* ── Case 04 · Sotreus ─────────────────────────────── */}
      <article id="sotreus" className="wrap mt-28 sm:mt-40" aria-label="Sotreus case study">
        <CaseHead
          no="04"
          kind={`Built at ${sotreus.org}`}
          name="Sotreus"
          sub="Decentralized VPN Infrastructure"
          note={<p className="text-ink-2">{sotreus.tagline}</p>}
        />
        <div className="mt-12 grid gap-12 grid-cols-1 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-6 lg:col-[4/span_5]">
            <Points items={sotreus.points} />
            <div className="mt-8 border-t border-rule pt-5">
              <StackLine items={sotreus.stack} />
            </div>
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-6 lg:col-[9/span_4]">
            <Figure no="5" caption="An authenticated API provisions isolated VPN + DNS-firewall pairs, each with its own port and volume.">
              <SotreusFigure />
            </Figure>
          </Reveal>
        </div>
      </article>

      {/* ── Case 05 · MyriadFlow ─────────────────────────── */}
      <article id="myriadflow" className="wrap mt-28 sm:mt-40" aria-label={`${myriadflow.name} case study`}>
        <CaseHead no="05" kind={myriadflow.kind} name={myriadflow.name} sub={myriadflow.subtitle} />
        <Reveal className="mt-10 grid gap-8 grid-cols-1 md:grid-cols-12">
          <div className="md:col-[4/span_9] lg:col-[4/span_6]">
            <Points items={myriadflow.points} />
            <div className="mt-8 border-t border-rule pt-5">
              <StackLine items={myriadflow.stack} />
            </div>
          </div>
        </Reveal>
      </article>
    </section>
  );
}
