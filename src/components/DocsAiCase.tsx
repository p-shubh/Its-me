import type { ReactNode } from "react";
import { docsai } from "../data";
import { Box, LineArt, S, T } from "./LineArt";
import { Figure, Reveal, StackLine } from "./ui";

/*
 * DocsAI — from the public repository. Diagram: Next.js → Go (Gin) → PostgreSQL/pgvector and
 * MinIO; Go ⇄ Python AI service over gRPC; Python → Gemini / Ollama. Drawn with the shared
 * line-art primitives so it draws itself once on first view.
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

/** A service box: title, subtitle, and optional inner rows. */
function Service({
  x,
  y,
  w,
  h,
  title,
  sub,
  rows = [],
  at,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  rows?: string[];
  at: number;
}) {
  return (
    <>
      <Box x={x} y={y} w={w} h={h} r={8} at={at} dur={480} />
      <T x={x + 16} y={y + 28} size={15} weight={500} at={at + 120}>
        {title}
      </T>
      <T x={x + 16} y={y + 47} size={12.5} tone="mute" at={at + 160}>
        {sub}
      </T>
      {rows.map((r, i) => (
        <g key={r}>
          <Box x={x + 14} y={y + 62 + i * 34} w={w - 28} h={26} r={4} at={at + 200 + i * 80} dur={300} />
          <T x={x + 26} y={y + 80 + i * 34} size={12.5} at={at + 260 + i * 80}>
            {r}
          </T>
        </g>
      ))}
    </>
  );
}

const LABEL =
  "DocsAI architecture. A Next.js frontend talks to a Go (Gin) backend over REST, and receives streamed answers as Server-Sent Events. The Go backend stores files in MinIO and metadata, chunks and vectors in PostgreSQL with pgvector. It calls a Python AI service over gRPC to process documents, embed questions and stream answers; the Python service downloads files from MinIO, calls Gemini or a local Ollama model, and returns processing results to Go through a gRPC callback.";

function Wide() {
  return (
    <LineArt viewBox="0 96 1000 360" label={LABEL}>
      <Service x={0} y={150} w={170} h={92} title="Next.js app" sub="upload · streaming chat" at={0} />

      <Service
        x={240}
        y={110}
        w={240}
        h={176}
        title="Go backend · Gin"
        sub="coordinates everything"
        rows={["Documents API", "Chat API · SSE out", "Background processing"]}
        at={200}
      />

      <Service
        x={570}
        y={110}
        w={240}
        h={176}
        title="Python AI service"
        sub="gRPC server"
        rows={["Text extraction + chunking", "Embeddings", "Answer generation · stream"]}
        at={500}
      />

      <Service x={240} y={370} w={240} h={70} title="PostgreSQL + pgvector" sub="metadata · chunks · vectors" at={800} />
      <Service x={570} y={370} w={240} h={70} title="MinIO" sub="original files" at={850} />

      <Service x={850} y={120} w={150} h={64} title="Gemini" sub="2.5 Flash" at={1000} />
      <Service x={850} y={212} w={150} h={64} title="Ollama" sub="local models" at={1050} />

      {/* browser ⇄ Go */}
      <Flow d="M170 182 H236" tip={head.right(238, 182)} at={350} accent />
      <T x={204} y={172} size={11.5} tone="mute" textAnchor="middle" at={400}>
        REST
      </T>
      <Flow d="M240 222 H174" tip={head.left(172, 222)} at={1300} accent />
      <T x={204} y={240} size={11.5} tone="red" textAnchor="middle" at={1350}>
        SSE
      </T>

      {/* Go ⇄ Python over gRPC */}
      <Flow d="M480 160 H566" tip={head.right(568, 160)} at={650} accent />
      <T x={524} y={150} size={11.5} tone="mute" textAnchor="middle" at={700}>
        gRPC
      </T>
      <Flow d="M570 240 H484" tip={head.left(482, 240)} at={1150} />
      <T x={524} y={258} size={11} tone="mute" textAnchor="middle" at={1200}>
        callback
      </T>
      <T x={524} y={272} size={11} tone="mute" textAnchor="middle" at={1200}>
        + stream
      </T>

      {/* storage */}
      <Flow d="M330 286 V366" tip={head.down(330, 368)} at={900} />
      <Flow d="M420 286 C420 330 600 320 620 366" tip={head.down(620, 368)} at={950} mute />
      <T x={470} y={338} size={11.5} tone="mute" at={1000}>
        file upload
      </T>
      <Flow d="M720 366 V290" tip={head.up(720, 288)} at={1000} mute />
      <T x={728} y={334} size={11.5} tone="mute" at={1050}>
        download
      </T>

      {/* AI providers */}
      <Flow d="M810 152 H846" tip={head.right(848, 152)} at={1100} accent />
      <Flow d="M810 244 H846" tip={head.right(848, 244)} at={1150} accent />
    </LineArt>
  );
}

function Tall() {
  return (
    <LineArt viewBox="0 0 360 800" label={LABEL}>
      <Service x={60} y={0} w={240} h={70} title="Next.js app" sub="upload · streaming chat" at={0} />
      <Flow d="M150 70 V116" tip={head.down(150, 118)} at={350} accent />
      <T x={140} y={98} size={11.5} tone="mute" textAnchor="end" at={400}>
        REST
      </T>
      <Flow d="M210 116 V74" tip={head.up(210, 72)} at={1300} accent />
      <T x={220} y={98} size={11.5} tone="red" at={1350}>
        SSE
      </T>

      <Service
        x={30}
        y={120}
        w={300}
        h={176}
        title="Go backend · Gin"
        sub="coordinates everything"
        rows={["Documents API", "Chat API · SSE out", "Background processing"]}
        at={200}
      />

      <Flow d="M75 296 V346" tip={head.down(75, 348)} at={900} />
      <Flow d="M285 296 V346" tip={head.down(285, 348)} at={950} mute />
      <Service x={0} y={350} w={150} h={70} title="PostgreSQL" sub="+ pgvector" at={800} />
      <Service x={210} y={350} w={150} h={70} title="MinIO" sub="original files" at={850} />

      {/* gRPC both ways, through the gap between the two stores */}
      <Flow d="M165 296 V496" tip={head.down(165, 498)} at={650} accent />
      <T x={158} y={460} size={11.5} tone="mute" textAnchor="end" at={700}>
        gRPC
      </T>
      <Flow d="M195 500 V300" tip={head.up(195, 298)} at={1150} />
      <T x={202} y={460} size={11} tone="mute" at={1200}>
        callback
      </T>
      <T x={202} y={474} size={11} tone="mute" at={1200}>
        + stream
      </T>
      <Flow d="M300 500 V424" tip={head.up(300, 422)} at={1000} mute />
      <T x={308} y={466} size={11} tone="mute" at={1050}>
        download
      </T>

      <Service
        x={30}
        y={500}
        w={300}
        h={176}
        title="Python AI service"
        sub="gRPC server"
        rows={["Text extraction + chunking", "Embeddings", "Answer generation · stream"]}
        at={500}
      />

      <Flow d="M120 676 V726" tip={head.down(120, 728)} at={1100} accent />
      <Flow d="M240 676 V726" tip={head.down(240, 728)} at={1150} accent />
      <Service x={30} y={730} w={145} h={64} title="Gemini" sub="2.5 Flash" at={1000} />
      <Service x={185} y={730} w={145} h={64} title="Ollama" sub="local models" at={1050} />
    </LineArt>
  );
}

function Steps({ title, items }: { title: ReactNode; items: { title: string; text: string }[] }) {
  return (
    <div>
      <h4 className="text-h4 font-medium">{title}</h4>
      <ol className="mt-4 border-t border-rule">
        {items.map((st, i) => (
          <li key={st.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 border-b border-rule py-4">
            <span className="grid size-6 place-items-center rounded-full bg-red text-[0.75rem] font-semibold text-paper tabular-nums" aria-hidden>
              {i + 1}
            </span>
            <div>
              <p className="font-medium">
                <span className="sr-only">Step {i + 1}: </span>
                {st.title}
              </p>
              <p className="mt-1 text-ink-2 text-pretty">{st.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function DocsAiCase({ head: caseHead }: { head: ReactNode }) {
  const d = docsai;
  return (
    <article id="docsai" className="wrap mt-28 sm:mt-40" aria-label={`${d.name} case study`}>
      {caseHead}

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12">
        <Reveal className="md:col-[4/span_9] lg:col-[4/span_7]">
          <p className="text-lede text-pretty">{d.intro}</p>
        </Reveal>
      </div>

      <Reveal className="mt-12">
        <Figure
          no="5"
          caption="DocsAI architecture. Terracotta marks the request path from the browser to the AI providers and the streamed answer back; grey arrows are storage traffic."
        >
          <div className="border border-rule bg-paper px-2 py-4 sm:p-8 lg:p-10">
            <div className="hidden lg:block">
              <Wide />
            </div>
            <div className="mx-auto max-w-[420px] lg:hidden">
              <Tall />
            </div>
          </div>
        </Figure>
      </Reveal>

      <Reveal className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
        <Steps title="How a document becomes searchable" items={d.ingest} />
        <Steps title="How a question gets answered" items={d.ask} />
      </Reveal>

      <Reveal className="mt-14 grid grid-cols-1 gap-4 border-t border-ink pt-5 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <h4 className="text-h4 font-medium">Built so far</h4>
          <p className="meta mt-1 text-mute">From the code, not the roadmap</p>
        </div>
        <div className="grid grid-cols-1 gap-10 md:col-span-9 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:gap-8">
          <ul className="prose-list space-y-2.5 text-ink-2">
            {d.built.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div>
            <p className="meta font-medium text-mute">Next</p>
            <ul className="prose-list mt-2 space-y-2.5 text-ink-2">
              {d.next.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10 border-t border-rule pt-5 lg:ml-[calc(25%+0.5rem)]">
        <StackLine items={d.stack} />
      </Reveal>
    </article>
  );
}
