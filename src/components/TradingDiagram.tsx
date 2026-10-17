import { Box, Dot, LineArt, S, T } from "./LineArt";

/*
 * Real-time trading calculator, as described in the CV: market buy/sell signals stream into a
 * Go WebSocket server that keeps one consistent order book, computes P&L per position and
 * broadcasts live updates to concurrent clients; per-client session context lets a dropped
 * client reconnect gracefully. Internals the CV does not state are not drawn.
 * Drawn with the shared line-art primitives, so it draws itself once on first view.
 */

const head = {
  right: (x: number, y: number) => `M${x - 7} ${y - 4} L${x} ${y} L${x - 7} ${y + 4}`,
  left: (x: number, y: number) => `M${x + 7} ${y - 4} L${x} ${y} L${x + 7} ${y + 4}`,
  down: (x: number, y: number) => `M${x - 4} ${y - 7} L${x} ${y} L${x + 4} ${y - 7}`,
  up: (x: number, y: number) => `M${x - 4} ${y + 7} L${x} ${y} L${x + 4} ${y + 7}`,
};

function Flow({ d, tip, at, accent, mute }: { d: string; tip: string; at: number; accent?: boolean; mute?: boolean }) {
  return (
    <>
      <S d={d} at={at} dur={380} accent={accent} mute={mute} />
      <S d={tip} at={at + 340} dur={140} accent={accent} mute={mute} />
    </>
  );
}

/** Numbered step marker, matching the list under the diagram. */
function Step({ n, x, y, at }: { n: number; x: number; y: number; at: number }) {
  return (
    <>
      <Dot cx={x} cy={y} r={10} at={at} />
      <T x={x} y={y + 4.5} size={12} weight={600} tone="paper" textAnchor="middle" at={at}>
        {n}
      </T>
    </>
  );
}

function Node({ x, y, w, h, title, sub, at, mute }: { x: number; y: number; w: number; h: number; title: string; sub: string; at: number; mute?: boolean }) {
  return (
    <>
      <Box x={x} y={y} w={w} h={h} r={6} at={at} dur={420} />
      <T x={x + w / 2} y={y + h / 2 - 3} size={15} weight={500} textAnchor="middle" tone={mute ? "mute" : "ink"} at={at + 120}>
        {title}
      </T>
      <T x={x + w / 2} y={y + h / 2 + 16} size={12.5} tone="mute" textAnchor="middle" at={at + 160}>
        {sub}
      </T>
    </>
  );
}

const LABEL =
  "Real-time trading calculator. Market buy and sell signals stream into a Go WebSocket server. 1: signals arrive at the ingest. 2: the order book state is updated, one consistent view for every subscriber. 3: the P&L engine recomputes each position. 4: updates go to the broadcast stage. 5: the session layer fans them out to each connected client over its WebSocket with sub-millisecond latency. 6: a client that drops reconnects, and its per-client session context is restored.";

function Wide() {
  return (
    <LineArt viewBox="0 0 1000 430" label={LABEL}>
      <T x={0} y={20} size={12} weight={500} tone="mute" at={0}>
        Source
      </T>
      <T x={820} y={20} size={12} weight={500} tone="mute" at={0}>
        Subscribers
      </T>

      {/* source */}
      <Node x={0} y={176} w={150} h={76} title="Market signals" sub="buy / sell stream" at={0} />

      {/* server */}
      <Box x={186} y={34} w={576} h={386} r={10} at={150} dur={600} />
      <T x={204} y={60} size={13} weight={500} at={250}>
        Go WebSocket server
      </T>
      <Node x={210} y={84} w={160} h={70} title="Signal ingest" sub="live stream in" at={350} />
      <Node x={410} y={84} w={170} h={70} title="Order book state" sub="one consistent view" at={500} />
      <Node x={410} y={194} w={170} h={70} title="P&L engine" sub="per position" at={650} />
      <Node x={410} y={304} w={170} h={70} title="Broadcast" sub="live updates" at={800} />

      {/* session layer */}
      <Box x={614} y={84} w={130} h={290} r={6} at={900} dur={500} />
      <T x={679} y={110} size={15} weight={500} textAnchor="middle" at={1000}>
        Sessions
      </T>
      <T x={679} y={128} size={12.5} tone="mute" textAnchor="middle" at={1000}>
        per-client context
      </T>
      {["client A", "client B", "client C"].map((c, i) => (
        <g key={c}>
          <Box x={628} y={148 + i * 52} w={102} h={38} r={4} at={1050 + i * 60} dur={300} />
          <T x={679} y={172 + i * 52} size={13} textAnchor="middle" at={1100 + i * 60}>
            {c}
          </T>
        </g>
      ))}

      {/* pipeline */}
      <Flow d="M150 214 H168 V119 H206" tip={head.right(208, 119)} at={350} accent />
      <Flow d="M370 119 H406" tip={head.right(408, 119)} at={500} accent />
      <Flow d="M495 154 V190" tip={head.down(495, 192)} at={650} accent />
      <Flow d="M495 264 V300" tip={head.down(495, 302)} at={800} accent />
      <Flow d="M580 339 H610" tip={head.right(612, 339)} at={950} accent />

      {/* fan-out to subscribers */}
      <Node x={820} y={84} w={180} h={70} title="Client A" sub="WebSocket · live P&L" at={1250} />
      <Node x={820} y={194} w={180} h={70} title="Client B" sub="WebSocket · live P&L" at={1300} />
      <Node x={820} y={304} w={180} h={70} title="Client C" sub="dropped, reconnecting" at={1350} mute />
      <Flow d="M730 167 C770 167 776 119 816 119" tip={head.right(818, 119)} at={1250} accent />
      <Flow d="M730 219 C770 219 776 229 816 229" tip={head.right(818, 229)} at={1300} accent />
      <T x={775} y={84} size={12} weight={500} tone="red" textAnchor="middle" at={1400}>
        sub-ms
      </T>

      {/* graceful reconnection */}
      <Flow d="M820 356 C786 356 780 271 734 271" tip={head.left(732, 271)} at={1450} mute />
      <T x={910} y={398} size={12} tone="mute" textAnchor="middle" at={1550}>
        reconnects; session context
      </T>
      <T x={910} y={414} size={12} tone="mute" textAnchor="middle" at={1550}>
        restored
      </T>

      <Step n={1} x={168} y={166} at={500} />
      <Step n={2} x={388} y={119} at={650} />
      <Step n={3} x={495} y={172} at={800} />
      <Step n={4} x={495} y={282} at={950} />
      <Step n={5} x={775} y={194} at={1400} />
      <Step n={6} x={790} y={318} at={1600} />
    </LineArt>
  );
}

function Tall() {
  return (
    <LineArt viewBox="0 0 360 880" label={LABEL}>
      <Node x={80} y={0} w={200} h={70} title="Market signals" sub="buy / sell stream" at={0} />
      <Flow d="M180 70 V140" tip={head.down(180, 142)} at={350} accent />

      <Box x={0} y={108} w={360} h={576} r={10} at={150} dur={600} />
      <T x={16} y={132} size={13} weight={500} at={250}>
        Go WebSocket server
      </T>
      <Node x={30} y={144} w={300} h={62} title="Signal ingest" sub="live stream in" at={350} />
      <Flow d="M180 206 V240" tip={head.down(180, 242)} at={500} accent />
      <Node x={30} y={244} w={300} h={62} title="Order book state" sub="one consistent view" at={500} />
      <Flow d="M180 306 V340" tip={head.down(180, 342)} at={650} accent />
      <Node x={30} y={344} w={300} h={62} title="P&L engine" sub="per position" at={650} />
      <Flow d="M180 406 V440" tip={head.down(180, 442)} at={800} accent />
      <Node x={30} y={444} w={300} h={62} title="Broadcast" sub="live updates" at={800} />
      <Flow d="M180 506 V540" tip={head.down(180, 542)} at={950} accent />

      <Box x={30} y={544} w={300} h={124} r={6} at={900} dur={500} />
      <T x={180} y={570} size={15} weight={500} textAnchor="middle" at={1000}>
        Sessions
      </T>
      <T x={180} y={588} size={12.5} tone="mute" textAnchor="middle" at={1000}>
        per-client context
      </T>
      {["client A", "client B", "client C"].map((c, i) => (
        <g key={c}>
          <Box x={42 + i * 94} y={604} w={86} h={38} r={4} at={1050 + i * 60} dur={300} />
          <T x={85 + i * 94} y={628} size={13} textAnchor="middle" at={1100 + i * 60}>
            {c}
          </T>
        </g>
      ))}

      <Flow d="M85 642 V744" tip={head.down(85, 746)} at={1250} accent />
      <Flow d="M179 642 V744" tip={head.down(179, 746)} at={1300} accent />
      <T x={190} y={730} size={12} weight={500} tone="red" at={1400}>
        sub-ms
      </T>

      <Node x={42} y={748} w={86} h={70} title="Client A" sub="live P&L" at={1250} />
      <Node x={136} y={748} w={86} h={70} title="Client B" sub="live P&L" at={1300} />
      <Node x={230} y={748} w={86} h={70} title="Client C" sub="offline" at={1350} mute />
      <Flow d="M273 748 V646" tip={head.up(273, 644)} at={1450} mute />
      <T x={316} y={846} size={12} tone="mute" textAnchor="end" at={1550}>
        reconnects; session context restored
      </T>

      <Step n={1} x={180} y={90} at={500} />
      <Step n={2} x={180} y={224} at={650} />
      <Step n={3} x={180} y={324} at={800} />
      <Step n={4} x={180} y={424} at={950} />
      <Step n={5} x={132} y={700} at={1400} />
      <Step n={6} x={273} y={700} at={1600} />
    </LineArt>
  );
}

export const tradingSteps = [
  { title: "Signal in", text: "Market buy/sell signals stream into the server." },
  { title: "Order book updated", text: "One consistent order book state, shared by every subscriber." },
  { title: "P&L recomputed", text: "Position P&L is computed from the new state." },
  { title: "Broadcast", text: "The update is handed to the session layer." },
  { title: "Fan-out", text: "Each connected client gets the update over its WebSocket, with sub-millisecond latency." },
  { title: "Reconnect", text: "A client that drops reconnects gracefully; its per-client session context is restored." },
];

export default function TradingDiagram() {
  return (
    <>
      <div className="hidden lg:block">
        <Wide />
      </div>
      <div className="mx-auto max-w-[420px] lg:hidden">
        <Tall />
      </div>
    </>
  );
}
