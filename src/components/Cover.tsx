import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowDownToLine } from "lucide-react";
import { education, experience, profile } from "../data";
import { PubSubFigure } from "./Figures";
import { Figure, ext } from "./ui";

export default function Cover() {
  const reduce = useReducedMotion();
  const [now, before] = experience;
  const fade = (d: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: d, ease: [0.2, 0.7, 0.2, 1] as const },
        };

  return (
    <section id="top" className="wrap pt-20 sm:pt-24">
      <motion.p
        {...fade(0)}
        className="meta flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-ink pb-3"
      >
        <span className="font-medium">{profile.title}</span>
        <span className="text-ink-2">{profile.focus.join("  ·  ")}</span>
      </motion.p>

      <motion.h1 {...fade(0.1)} className="display mt-12 text-hero font-semibold sm:mt-16">
        {profile.name}
      </motion.h1>

      <div className="mt-10 grid grid-cols-1 gap-12 border-t border-ink pt-8 pb-14 sm:mt-12 md:grid-cols-12 md:gap-8 lg:pb-20">
        <motion.div {...fade(0.5)} className="md:col-span-6 lg:col-span-5">
          <p className="max-w-[30ch] text-standfirst text-pretty">
            I build backend systems in Go that stay reliable under concurrent, high-throughput load — gRPC and REST APIs,
            event-driven pipelines and real-time WebSocket infrastructure, owned from schema to production.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-solid">
              Read the case studies <ArrowDown className="size-4" aria-hidden />
            </a>
            <a href={profile.resume} download className="btn btn-line">
              <ArrowDownToLine className="size-4" aria-hidden /> Résumé (PDF)
            </a>
          </div>
          <p className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            <a className="ulink" href={`mailto:${profile.email}`}>
              Email
            </a>
            <a className="ulink" href={profile.github} {...ext}>
              GitHub<span className="sr-only"> (opens in new tab)</span>
            </a>
            <a className="ulink" href={profile.linkedin} {...ext}>
              LinkedIn<span className="sr-only"> (opens in new tab)</span>
            </a>
          </p>
        </motion.div>

        <motion.div {...fade(0.65)} className="md:col-span-6 lg:col-span-4">
          <Figure
            no="1"
            caption="Async pub-sub, producers decoupled from consumers — the pattern behind real-time task-status propagation at Intellixente and ticketing, streaming and NFT-minting flows at Lazarus Network."
          >
            <div className="mx-auto max-w-[26rem] lg:max-w-none">
              <PubSubFigure />
            </div>
          </Figure>
        </motion.div>

        <motion.dl {...fade(0.8)} className="grid content-start gap-6 sm:grid-cols-2 md:col-span-12 lg:col-span-3 lg:grid-cols-1">
          <div>
            <dt className="meta text-mute">Currently</dt>
            <dd className="mt-1.5">
              {now.title}, <span className="font-medium">{now.company}</span>
              <span className="block text-mute">
                {now.location} · {now.start} – {now.end}
              </span>
            </dd>
          </div>
          <div>
            <dt className="meta text-mute">Previously</dt>
            <dd className="mt-1.5">
              {before.title}, <span className="font-medium">{before.company}</span>
              <span className="block text-mute">
                {before.location} · {before.mode} · {before.start} – {before.end}
              </span>
            </dd>
          </div>
          <div>
            <dt className="meta text-mute">Trained as</dt>
            <dd className="mt-1.5">
              Mechanical engineer
              <span className="block text-mute">B.E., GIFT Bhubaneswar · {education.year.replace("Graduated ", "")}</span>
            </dd>
          </div>
          <div>
            <dt className="meta text-mute">In production</dt>
            <dd className="mt-1.5">3+ years building distributed systems in Golang</dd>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
