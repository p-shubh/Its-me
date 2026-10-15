import type { ReactNode } from "react";
import { atlas, myriadflow, netsepio, sotreusCase, trading } from "../data";
import AtlasCase from "./AtlasCase";
import { NetsepioFigure, TradingFigure } from "./Figures";
import Character from "./Character";
import SotreusCase from "./SotreusCase";
import { Figure, Reveal, SectionHead, StackLine } from "./ui";

const index = [
  { id: "netsepio", name: netsepio.name, kind: netsepio.kind, line: "Peer-to-peer DePIN contribution and production edge security" },
  { id: "atlas", name: atlas.name, kind: atlas.kind, line: "Fleet observability over libp2p, end to end" },
  { id: "trading", name: trading.name, kind: trading.kind, line: "Live signal streaming and P&L over WebSocket" },
  { id: "sotreus", name: "Sotreus", kind: "Lazarus Network", line: "Self-hosted, operator-managed VPN infrastructure" },
  { id: "myriadflow", name: myriadflow.name, kind: myriadflow.kind, line: "Event-driven NFT marketplace backend" },
];

function CaseHead({
  no,
  kind,
  name,
  sub,
  note,
}: {
  no: string;
  kind: string;
  name: string;
  sub: string;
  note?: ReactNode;
}) {
  return (
    <Reveal className="grid grid-cols-1 gap-4 border-t border-ink pt-5 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-3">
        <p className="meta font-medium">
          <span className="text-red tabular-nums">Case {no}</span>
        </p>
        <p className="meta mt-1 text-mute">{kind}</p>
      </div>
      <div className="md:col-span-9">
        <h3 className="display text-h3">{name}</h3>
        <p className="mt-2 text-lede text-ink-2">{sub}</p>
        {note && <div className="mt-5">{note}</div>}
      </div>
    </Reveal>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="prose-list max-w-[40rem] space-y-4 text-ink-2 text-pretty">
      {items.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <h4 className="mb-4 border-b border-rule pb-2 text-h4 font-medium">{children}</h4>
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
              Five pieces of work, read closely.
            </>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-[4/span_9] md:row-start-1">
          <ol className="border-t border-rule">
            {index.map((p, i) => (
              <li key={p.id} className="border-b border-rule">
                <a href={`#${p.id}`} className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-4 sm:grid-cols-[3rem_14rem_1fr_auto]">
                  <span className="meta text-mute tabular-nums">0{i + 1}</span>
                  <span className="text-h4 font-medium transition-colors group-hover:text-red">{p.name}</span>
                  <span className="col-start-2 text-ink-2 sm:col-start-auto">{p.line}</span>
                  <span className="meta col-start-2 text-mute sm:col-start-auto">{p.kind}</span>
                </a>
              </li>
            ))}
          </ol>
        </Reveal>
        <div className="w-full max-w-[260px] md:col-[1/span_3] md:row-start-1 md:max-w-none md:pr-6">
          <Character pose="explaining" />
        </div>
        </div>
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
            <div className="border-t-2 border-ink bg-paper-2 p-6 sm:p-8">
              <p className="display text-stat tabular-nums">1.01M</p>
              <p className="mt-4 text-lede font-medium">
                requests per day of abnormal traffic — 72% of it from a single scraper IP.
              </p>
              <p className="mt-6 border-t border-rule pt-4 text-ink-2">
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
                  <span className="meta pt-0.5 font-medium text-red">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h5 className="text-h4 font-medium">{l.title}</h5>
                    <p className="mt-1.5 text-ink-2 text-pretty">{l.text}</p>
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

      {/* ── Case 02 · Atlas — architecture-first case study ── */}
      <AtlasCase
        head={
          <CaseHead
            no="02"
            kind={atlas.kind}
            name={atlas.name}
            sub={atlas.subtitle}
            note={
              <p className="meta inline-flex items-center gap-2.5 text-mute">
                <span className="size-1.5 shrink-0 rounded-full bg-red" aria-hidden />
                {atlas.note}
              </p>
            }
          />
        }
      />

      {/* ── Case 03 · Trading calculator ─────────────────── */}
      <article id="trading" className="wrap mt-28 sm:mt-40" aria-label={`${trading.name} case study`}>
        <CaseHead no="03" kind={trading.kind} name={trading.name} sub={trading.subtitle} />
        <div className="mt-12 grid gap-12 grid-cols-1 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-7">
            <Figure no="4" caption={`${trading.tagline}: signals stream in, position P&L is computed per client, updates fan out to concurrent subscribers.`}>
              <div className="border border-rule p-5 sm:p-8">
                <TradingFigure />
              </div>
            </Figure>
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-5 lg:col-[9/span_4]">
            <p className="display text-stat">Sub-millisecond</p>
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

      {/* ── Case 04 · Sotreus — see SotreusCase for the evidence-labelled case study ── */}
      <SotreusCase
        head={
          <CaseHead
            no="04"
            kind={`${sotreusCase.org} · ${sotreusCase.period}`}
            name={sotreusCase.name}
            sub={sotreusCase.subtitle}
          />
        }
      />

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
