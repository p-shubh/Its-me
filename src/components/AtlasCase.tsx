import type { ReactNode } from "react";
import { atlas, atlasOverview } from "../data";
import { Box, Dot, LineArt, Person, S, T } from "./LineArt";
import { Figure, Reveal, StackLine } from "./ui";

/*
 * Atlas architecture, drawn with the shared line-art primitives so it shares the
 * developer character and the scroll-triggered draw. One observer runs the sequence:
 *   0ms     signed-in user (the developer character)
 *   ~150ms  servers and agents
 *   ~450ms  agent links, the two connection paths
 *   ~900ms  Atlas server and TimescaleDB
 *   ~1300ms dashboard and the authorized flow into it (terracotta)
 * Without JS or with reduced motion the diagram renders complete.
 */

const SRV = 150;
const LINK = 450;
const CORE = 900;
const DASH = 1300;

const LABEL =
  "Atlas architecture. Three example Linux servers (production, application, database) each run atlas-agent, which takes resource measurements about every 15 seconds and a fuller snapshot about every 60 seconds. Each agent connects to the Atlas server by one of two paths: primarily libp2p with an administrator-approved persistent identity, or alternatively HTTPS enrollment with a one-time token followed by certificate-based connections. The Atlas server checks approved agent identities on the libp2p path and takes in reports, storing them in TimescaleDB, which keeps detailed measurements for 30 days and summarized history longer. Separately, a user signs in; authorization by role and by server and page permission decides what the web dashboard shows: fleet health, resource usage, containers and logs, services, processes, ports, scheduled jobs and items needing attention.";

/* arrowheads are drawn strokes (not SVG markers) so they appear with their line */
const head = {
  right: (x: number, y: number) => `M${x - 7} ${y - 4} L${x} ${y} L${x - 7} ${y + 4}`,
  left: (x: number, y: number) => `M${x + 7} ${y - 4} L${x} ${y} L${x + 7} ${y + 4}`,
  down: (x: number, y: number) => `M${x - 4} ${y - 7} L${x} ${y} L${x + 4} ${y - 7}`,
  up: (x: number, y: number) => `M${x - 4} ${y + 7} L${x} ${y} L${x + 4} ${y + 7}`,
};

function Flow({ d, tip, at, accent, mute }: { d: string; tip: string; at: number; accent?: boolean; mute?: boolean }) {
  return (
    <>
      <S d={d} at={at} dur={420} accent={accent} mute={mute} />
      <S d={tip} at={at + 380} dur={150} accent={accent} mute={mute} />
    </>
  );
}

/* small technical icons, all 14–16px, same stroke */
const icon = {
  server: (x: number, y: number) => `M${x} ${y} h14 v18 h-14 z M${x + 3} ${y + 6} h8 M${x + 3} ${y + 11} h8`,
  db: (x: number, y: number) =>
    `M${x} ${y + 3} a8 3 0 1 0 16 0 a8 3 0 1 0 -16 0 v12 a8 3 0 0 0 16 0 v-12`,
  lock: (x: number, y: number) => `M${x} ${y + 7} h12 v9 h-12 z M${x + 3} ${y + 7} v-3 a3 3 0 0 1 6 0 v3`,
  window: (x: number, y: number) => `M${x} ${y} h16 v12 h-16 z M${x} ${y + 4} h16`,
};

const servers = ["Production server", "Application server", "Database server"];
const dashboardItems: [string, string][] = [
  ["Fleet health", "node status"],
  ["CPU · memory", "disk · network"],
  ["Containers", "and their logs"],
  ["Services · processes", "ports · scheduled jobs"],
  ["Needs attention", "consolidated issues"],
];

/** Desktop: five layers left to right; the signed-in user sits under the server. */
function WideDiagram() {
  return (
    <LineArt viewBox="0 0 1060 640" label={LABEL}>
      {/* layer captions */}
      {[
        [20, "Monitored Linux servers"],
        [300, "Agent connectivity"],
        [560, "Atlas server"],
        [840, "Storage and dashboard"],
      ].map(([x, t]) => (
        <T key={t} x={x} y={28} size={12} weight={500} tone="mute" at={0}>
          {t}
        </T>
      ))}

      {/* layer 1 — servers with atlas-agent */}
      {servers.map((name, i) => {
        const y = 50 + i * 120;
        const at = SRV + i * 80;
        return (
          <g key={name}>
            <Box x={20} y={y} w={230} h={100} r={6} at={at} dur={450} />
            <S d={icon.server(224, y + 14)} at={at + 150} dur={300} />
            <T x={36} y={y + 28} size={14} weight={500} at={at + 100}>
              {name}
            </T>
            <Box x={36} y={y + 46} w={140} h={36} r={4} at={at + 200} dur={350} />
            <T x={106} y={y + 69} size={13} textAnchor="middle" at={at + 300}>
              atlas-agent
            </T>
            <S d={`M176 ${y + 64} H275`} at={LINK + i * 60} dur={300} />
          </g>
        );
      })}
      <S d="M275 114 V354" at={LINK + 150} dur={350} />

      {/* agent schedule */}
      <T x={20} y={428} size={13} weight={500} at={SRV + 300}>
        Agent schedule
      </T>
      <T x={20} y={452} size={12} weight={500} tone="red" at={SRV + 350}>
        ~15 s
      </T>
      <T x={70} y={452} size={12} at={SRV + 350}>
        Resource measurements
      </T>
      <T x={20} y={474} size={12} weight={500} tone="red" at={SRV + 400}>
        ~60 s
      </T>
      <T x={70} y={474} size={12} at={SRV + 400}>
        Fuller snapshot: processes, services,
      </T>
      <T x={70} y={491} size={12} at={SRV + 400}>
        ports and scheduled jobs
      </T>

      {/* layer 2 — two alternative connection paths */}
      <Flow d="M275 150 H298" tip={head.right(298, 150)} at={LINK + 250} accent />
      <Box x={300} y={110} w={220} h={80} r={6} at={LINK + 250} dur={450} />
      <T x={316} y={136} size={14} weight={500} at={LINK + 350}>
        libp2p
      </T>
      <T x={504} y={136} size={11.5} weight={500} tone="red" textAnchor="end" at={LINK + 350}>
        Primary
      </T>
      <T x={316} y={158} size={12} tone="mute" at={LINK + 400}>
        Persistent agent identity,
      </T>
      <T x={316} y={175} size={12} tone="mute" at={LINK + 400}>
        approved by an administrator
      </T>

      <Flow d="M275 290 H298" tip={head.right(298, 290)} at={LINK + 300} mute />
      <Box x={300} y={250} w={220} h={80} r={6} at={LINK + 300} dur={450} />
      <T x={316} y={276} size={14} weight={500} at={LINK + 400}>
        HTTPS
      </T>
      <T x={504} y={276} size={11.5} weight={500} tone="mute" textAnchor="end" at={LINK + 400}>
        Alternative
      </T>
      <T x={316} y={298} size={12} tone="mute" at={LINK + 450}>
        One-time token enrollment,
      </T>
      <T x={316} y={315} size={12} tone="mute" at={LINK + 450}>
        then certificate-based connections
      </T>
      <T x={300} y={360} size={12} tone="mute" at={LINK + 500}>
        Each agent uses one of the two paths.
      </T>

      {/* layer 3 — Atlas server: agent intake above, user access below */}
      <Box x={560} y={50} w={240} h={340} r={8} at={CORE} dur={600} />
      <T x={576} y={78} size={15} weight={500} at={CORE + 100}>
        Atlas server
      </T>
      <S d={icon.server(770, 62)} at={CORE + 150} dur={300} />
      <Box x={576} y={96} w={208} h={58} r={4} at={CORE + 120} dur={400} />
      <T x={592} y={120} size={13} weight={500} at={CORE + 220}>
        Agent identity check
      </T>
      <T x={592} y={140} size={12} tone="mute" at={CORE + 220}>
        approved agents · libp2p path
      </T>
      <Box x={576} y={170} w={208} h={52} r={4} at={CORE + 200} dur={400} />
      <T x={592} y={192} size={13} weight={500} at={CORE + 300}>
        Report intake
      </T>
      <T x={592} y={210} size={12} tone="mute" at={CORE + 300}>
        measurements and snapshots
      </T>
      <Flow d="M680 154 V168" tip={head.down(680, 168)} at={CORE + 250} />
      <Flow d="M520 150 C542 150 552 125 574 125" tip={head.right(574, 125)} at={LINK + 450} accent />
      <Flow d="M520 290 C548 290 552 196 574 196" tip={head.right(574, 196)} at={LINK + 500} mute />

      <S d="M568 250 H792" at={CORE + 250} dur={400} mute />
      <T x={576} y={270} size={11} tone="mute" at={CORE + 300}>
        User access — separate from agents
      </T>
      <Box x={576} y={282} w={208} h={92} r={4} at={CORE + 300} dur={400} />
      <S d={icon.lock(762, 292)} at={CORE + 400} dur={300} />
      <T x={592} y={306} size={13} weight={500} at={CORE + 400}>
        Sign-in and authorization
      </T>
      <T x={592} y={326} size={12} tone="mute" at={CORE + 400}>
        roles: viewer · operator ·
      </T>
      <T x={592} y={342} size={12} tone="mute" at={CORE + 400}>
        admin · superadmin
      </T>
      <T x={592} y={360} size={12} tone="mute" at={CORE + 400}>
        server and page permissions
      </T>

      {/* layer 4 — TimescaleDB */}
      <Flow d="M784 196 C812 196 814 110 838 110" tip={head.right(838, 110)} at={CORE + 300} />
      <Box x={840} y={50} w={200} h={120} r={6} at={CORE + 150} dur={450} />
      <S d={icon.db(1012, 60)} at={CORE + 300} dur={300} />
      <T x={856} y={78} size={14} weight={500} at={CORE + 250}>
        TimescaleDB
      </T>
      <T x={856} y={102} size={12} at={CORE + 300}>
        Detailed measurements
      </T>
      <T x={856} y={118} size={12} tone="mute" at={CORE + 300}>
        kept 30 days
      </T>
      <T x={856} y={140} size={12} at={CORE + 350}>
        Summarized history
      </T>
      <T x={856} y={156} size={12} tone="mute" at={CORE + 350}>
        retained longer
      </T>

      {/* layer 5 — dashboard, reached only through authorization */}
      <Flow d="M940 170 V206" tip={head.down(940, 206)} at={DASH + 100} mute />
      <T x={948} y={192} size={11} tone="mute" at={DASH + 150}>
        history
      </T>
      <Box x={840} y={210} w={200} h={300} r={6} at={DASH} dur={500} />
      <S d={icon.window(1012, 224)} at={DASH + 150} dur={300} />
      <T x={856} y={238} size={14} weight={500} at={DASH + 100}>
        Web dashboard
      </T>
      {dashboardItems.map(([a, b], i) => {
        const y = 266 + i * 42;
        const at = DASH + 150 + i * 60;
        return (
          <g key={a}>
            {i === dashboardItems.length - 1 ? (
              <Dot cx={860} cy={y - 4} r={3.5} at={at} />
            ) : (
              <S d={`M856 ${y - 8} h8 v8 h-8 z`} at={at} dur={250} />
            )}
            <T x={874} y={y} size={13} at={at}>
              {a}
            </T>
            <T x={874} y={y + 16} size={12} tone="mute" at={at}>
              {b}
            </T>
          </g>
        );
      })}
      <T x={856} y={478} size={11} tone="mute" at={DASH + 500}>
        Shows only the servers and pages
      </T>
      <T x={856} y={493} size={11} tone="mute" at={DASH + 500}>
        this user is authorized to see.
      </T>
      <Flow d="M784 327 H836" tip={head.right(838, 327)} at={DASH + 200} accent />

      {/* the signed-in user — the shared developer character */}
      <Person
        x={690}
        y={452}
        at={0}
        arms={
          <>
            <S at={700} dur={450} d="M-25 30 L-32 84 L-31 90" />
            <S at={760} dur={450} d="M25 30 L62 20 L86 14" />
          </>
        }
      />
      <Flow d="M690 432 V378" tip={head.up(690, 378)} at={DASH + 100} />
      <T x={698} y={412} size={11} tone="mute" at={DASH + 150}>
        signs in
      </T>
      <Flow d="M780 466 H836" tip={head.right(838, 466)} at={DASH + 300} accent />
      <T x={690} y={630} size={12} tone="mute" textAnchor="middle" at={DASH}>
        Signed-in user
      </T>
    </LineArt>
  );
}

/** Mobile: the same layers stacked top to bottom. */
function TallDiagram() {
  return (
    <LineArt viewBox="8 0 368 1490" label={LABEL}>
      <T x={20} y={16} size={13} weight={500} tone="mute" at={0}>
        Monitored Linux servers
      </T>
      <T x={20} y={42} size={13} weight={500} tone="red" at={SRV}>
        ~15 s
      </T>
      <T x={64} y={42} size={13} at={SRV}>
        Resource measurements
      </T>
      <T x={20} y={62} size={13} weight={500} tone="red" at={SRV + 50}>
        ~60 s
      </T>
      <T x={64} y={62} size={13} at={SRV + 50}>
        Fuller snapshot: processes, services,
      </T>
      <T x={64} y={79} size={13} at={SRV + 50}>
        ports and scheduled jobs
      </T>

      {servers.map((name, i) => {
        const y = 96 + i * 76;
        const at = SRV + i * 80;
        return (
          <g key={name}>
            <Box x={20} y={y} w={340} h={64} r={6} at={at} dur={450} />
            <T x={36} y={y + 38} size={15} weight={500} at={at + 100}>
              {name}
            </T>
            <Box x={222} y={y + 14} w={124} h={36} r={4} at={at + 200} dur={350} />
            <T x={284} y={y + 37} size={14} textAnchor="middle" at={at + 300}>
              atlas-agent
            </T>
            <S d={`M346 ${y + 32} H370`} at={LINK + i * 60} dur={200} />
          </g>
        );
      })}
      <S d="M370 128 V344 H102 V358" at={LINK + 150} dur={500} accent />
      <S d={head.down(102, 360)} at={LINK + 600} dur={150} accent />
      <S d="M330 344 V358" at={LINK + 450} dur={200} mute />
      <S d={head.down(330, 360)} at={LINK + 600} dur={150} mute />

      <Box x={20} y={362} w={165} h={104} r={6} at={LINK + 250} dur={450} />
      <T x={34} y={386} size={15} weight={500} at={LINK + 350}>
        libp2p
      </T>
      <T x={171} y={386} size={12.5} weight={500} tone="red" textAnchor="end" at={LINK + 350}>
        Primary
      </T>
      {["Persistent agent", "identity, approved", "by an administrator"].map((t, i) => (
        <T key={t} x={34} y={408 + i * 16} size={13} tone="mute" at={LINK + 400}>
          {t}
        </T>
      ))}
      <Box x={195} y={362} w={165} h={104} r={6} at={LINK + 300} dur={450} />
      <T x={209} y={386} size={15} weight={500} at={LINK + 400}>
        HTTPS
      </T>
      <T x={346} y={386} size={12.5} weight={500} tone="mute" textAnchor="end" at={LINK + 400}>
        Alternative
      </T>
      {["One-time token", "enrollment, then", "certificate-based"].map((t, i) => (
        <T key={t} x={209} y={408 + i * 16} size={13} tone="mute" at={LINK + 450}>
          {t}
        </T>
      ))}
      <T x={190} y={333} size={13} tone="mute" textAnchor="middle" at={LINK + 500}>
        Each agent uses one of the two paths.
      </T>

      <Box x={20} y={510} w={340} h={310} r={8} at={CORE} dur={600} />
      <T x={204} y={584} size={15} weight={500} at={CORE + 100}>
        Atlas server
      </T>
      <Box x={36} y={550} w={150} h={58} r={4} at={CORE + 120} dur={400} />
      <T x={48} y={574} size={14} weight={500} at={CORE + 220}>
        Identity check
      </T>
      <T x={48} y={593} size={13} tone="mute" at={CORE + 220}>
        approved agents
      </T>
      <Box x={36} y={622} w={308} h={50} r={4} at={CORE + 200} dur={400} />
      <T x={48} y={644} size={14} weight={500} at={CORE + 300}>
        Report intake
      </T>
      <T x={48} y={662} size={13} tone="mute" at={CORE + 300}>
        measurements and snapshots
      </T>
      <Flow d="M102 466 V546" tip={head.down(102, 548)} at={LINK + 450} accent />
      <Flow d="M330 466 V618" tip={head.down(330, 620)} at={LINK + 500} mute />
      <Flow d="M111 608 V618" tip={head.down(111, 620)} at={CORE + 250} />

      <S d="M28 690 H352" at={CORE + 250} dur={400} mute />
      <T x={36} y={708} size={12} tone="mute" at={CORE + 300}>
        User access — separate from agent identity
      </T>
      <Box x={36} y={718} w={308} h={88} r={4} at={CORE + 300} dur={400} />
      <S d={icon.lock(322, 728)} at={CORE + 400} dur={300} />
      <T x={48} y={742} size={14} weight={500} at={CORE + 400}>
        Sign-in and authorization
      </T>
      <T x={48} y={762} size={13} tone="mute" at={CORE + 400}>
        roles: viewer · operator ·
      </T>
      <T x={48} y={778} size={13} tone="mute" at={CORE + 400}>
        admin · superadmin
      </T>
      <T x={48} y={796} size={13} tone="mute" at={CORE + 400}>
        server and page permissions
      </T>

      <Flow d="M344 647 H372 V895 H364" tip={head.left(362, 895)} at={CORE + 300} />
      <Box x={20} y={850} w={340} h={90} r={6} at={CORE + 150} dur={450} />
      <S d={icon.db(330, 862)} at={CORE + 300} dur={300} />
      <T x={36} y={876} size={15} weight={500} at={CORE + 250}>
        TimescaleDB
      </T>
      <T x={36} y={900} size={13} at={CORE + 300}>
        Detailed measurements · 30 days
      </T>
      <T x={36} y={918} size={13} tone="mute" at={CORE + 350}>
        Summarized history · retained longer
      </T>

      <Flow d="M190 940 V976" tip={head.down(190, 978)} at={DASH + 100} mute />
      <T x={198} y={964} size={12} tone="mute" at={DASH + 150}>
        history
      </T>
      <Box x={20} y={980} w={340} h={300} r={6} at={DASH} dur={500} />
      <S d={icon.window(330, 994)} at={DASH + 150} dur={300} />
      <T x={36} y={1006} size={15} weight={500} at={DASH + 100}>
        Web dashboard
      </T>
      {dashboardItems.map(([a, b], i) => {
        const y = 1040 + i * 42;
        const at = DASH + 150 + i * 60;
        return (
          <g key={a}>
            {i === dashboardItems.length - 1 ? (
              <Dot cx={40} cy={y - 4} r={3.5} at={at} />
            ) : (
              <S d={`M36 ${y - 8} h8 v8 h-8 z`} at={at} dur={250} />
            )}
            <T x={54} y={y} size={14} at={at}>
              {a}
            </T>
            <T x={54} y={y + 17} size={13} tone="mute" at={at}>
              {b}
            </T>
          </g>
        );
      })}
      <T x={36} y={1250} size={12} tone="mute" at={DASH + 500}>
        Shows only the servers and pages this
      </T>
      <T x={36} y={1266} size={12} tone="mute" at={DASH + 500}>
        user is authorized to see.
      </T>
      <Flow d="M36 762 H8 V1100 H16" tip={head.right(18, 1100)} at={DASH + 200} accent />

      <Person
        x={96}
        y={1324}
        at={0}
        arms={
          <>
            <S at={700} dur={450} d="M-25 30 L-32 84 L-31 90" />
            <S at={760} dur={450} d="M25 30 L44 2 L52 -16" />
          </>
        }
      />
      <Flow d="M150 1314 V1286" tip={head.up(150, 1284)} at={DASH + 300} accent />
      <T x={150} y={1364} size={13} tone="mute" at={DASH}>
        Signed-in user
      </T>
      <T x={150} y={1382} size={12} tone="mute" at={DASH}>
        sees authorized pages only
      </T>
    </LineArt>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal className="grid grid-cols-1 gap-4 border-t border-ink pt-5 md:grid-cols-12 md:gap-8">
      <h4 className="text-h4 font-medium md:col-span-3">{title}</h4>
      <div className="md:col-span-9">{children}</div>
    </Reveal>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="prose-list space-y-2.5 text-ink-2">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export default function AtlasCase({ head: caseHead }: { head: ReactNode }) {
  const o = atlasOverview;
  return (
    <article id="atlas" className="mt-28 border-y border-rule bg-paper-2 py-20 sm:mt-40 sm:py-28" aria-label="Atlas case study">
      <div className="wrap">
        {caseHead}

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-[4/span_9] lg:col-[4/span_7]">
            <p className="text-lede text-pretty">{o.intro}</p>
            <p className="mt-4 text-ink-2 text-pretty">{o.problem}</p>
          </Reveal>
        </div>

        {/* the centrepiece */}
        <Reveal className="mt-14">
          <Figure
            no="2"
            caption="Atlas architecture. Server names are illustrative, not the real deployment. Agent identity (libp2p path) and user sign-in are separate checks; terracotta marks the primary agent path and the authorized flow into the dashboard."
          >
            <div className="border border-rule bg-paper px-2 py-4 sm:p-8 lg:p-10">
              <div className="hidden lg:block">
                <WideDiagram />
              </div>
              <div className="mx-auto max-w-[440px] lg:hidden">
                <TallDiagram />
              </div>
            </div>
          </Figure>
        </Reveal>

        <div className="mt-16 space-y-14">
          <Block title="Telemetry lifecycle">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <p className="meta font-medium text-mute">Collection, per agent</p>
                <dl className="mt-3 divide-y divide-rule border-y border-rule">
                  {o.schedule.map((s) => (
                    <div key={s.every} className="grid grid-cols-[4rem_minmax(0,1fr)] gap-3 py-3">
                      <dt className="font-medium tabular-nums text-red">{s.every}</dt>
                      <dd className="text-ink-2">{s.what}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <p className="meta font-medium text-mute">Retention, in TimescaleDB</p>
                <dl className="mt-3 divide-y divide-rule border-y border-rule">
                  {o.retention.map((r) => (
                    <div key={r.what} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3">
                      <dt className="text-ink-2">{r.what}</dt>
                      <dd className="font-medium">{r.keep}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {o.connectivity.map((c) => (
                <div key={c.name}>
                  <p className="flex items-baseline gap-3">
                    <span className="font-medium">{c.name}</span>
                    <span className={`meta font-medium ${c.kind === "Primary" ? "text-red" : "text-mute"}`}>{c.kind}</span>
                  </p>
                  <p className="mt-2 text-ink-2 text-pretty">{c.text}</p>
                </div>
              ))}
            </div>

            <ol className="mt-10 grid grid-cols-1 border-t border-rule sm:grid-cols-2 lg:grid-cols-6 lg:gap-6 lg:border-t-0">
              {o.lifecycle.map((l, i) => (
                <li key={l.step} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 border-b border-rule py-4 lg:block lg:border-b-0 lg:border-t lg:py-0 lg:pt-4">
                  <span className="meta font-medium tabular-nums text-red">{String(i + 1).padStart(2, "0")}</span>
                  <div className="lg:mt-2">
                    <p className="font-medium">{l.step}</p>
                    <p className="meta mt-1 text-ink-2 text-pretty">{l.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          <Block title="Operational capabilities">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              <div>
                <p className="mb-3 font-medium">Fleet observability</p>
                <List items={o.observability} />
              </div>
              <div>
                <p className="mb-3 font-medium">Operational attention</p>
                <p className="meta mb-3 text-mute">One consolidated view of what needs a look:</p>
                <List items={o.attention} />
              </div>
            </div>
          </Block>

          <Block title="Roles and access control">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2" aria-label="Roles">
              {o.roles.map((r, i) => (
                <li key={r} className="flex items-center gap-3">
                  <span className={`rounded border px-2.5 py-1 font-medium ${r === "superadmin" ? "border-ink bg-ink text-paper" : "border-rule"}`}>
                    {r}
                  </span>
                  {i < o.roles.length - 1 && <span className="text-mute" aria-hidden>→</span>}
                </li>
              ))}
            </ol>
            <p className="mt-5 max-w-[42rem] text-ink-2 text-pretty">
              Permissions apply per server and per page, so the dashboard shows each user only what they are authorized
              to see. Agent identity on the libp2p path is checked separately from user sign-in.
            </p>
            <ul className="prose-list mt-4 max-w-[42rem] text-ink-2">
              <li>{atlas.points[2]}</li>
            </ul>
          </Block>

          <Block title="Engineering notes">
            <ul className="prose-list max-w-[44rem] space-y-3 text-ink-2 text-pretty">
              {[atlas.points[0], atlas.points[1], atlas.points[3], atlas.points[4]].map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-rule pt-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline sm:gap-8">
              <p className="display text-stat tabular-nums">
                17 GB <span className="text-mute">→</span> 1.1 GB
              </p>
              <p className="max-w-[36rem] text-ink-2 text-pretty">{atlas.points[5]}</p>
            </div>
            <div className="mt-8 border-t border-rule pt-5">
              <StackLine items={atlas.stack} />
            </div>
          </Block>
        </div>
      </div>
    </article>
  );
}
