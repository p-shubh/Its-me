import { evidence, strengths } from "../data";
import { AboutDeveloper } from "./LineArt";
import { Reveal, SectionHead } from "./ui";

export default function About() {
  return (
    <section id="about" className="wrap pt-4 pb-24 sm:pb-32">
      <SectionHead no="01" label="About" title="Systems that hold up after launch." />

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-8 lg:mt-14">
        <Reveal className="md:col-[4/span_9] md:row-start-1 lg:col-[4/span_7]">
          <p className="max-w-[30ch] text-standfirst text-pretty">
            Results-driven backend engineer with 3+ years of production experience building high-performance,
            distributed systems in Golang.
          </p>
          <div className="mt-8 max-w-[38rem] space-y-5 text-[1.0625rem] leading-[1.75] text-ink-2 text-pretty sm:text-[1.125rem]">
            <p>
              The core of the work is designing gRPC and REST APIs, event-driven architectures and real-time WebSocket
              systems that scale under concurrent load — microservices with a clean separation of concerns, async pub-sub
              pipelines, and robust authentication layers built on JWT, PASETO and OAuth 2.0.
            </p>
            <p>
              Shubham owns the full backend lifecycle: database schema and API design, containerized deployment, CI/CD
              automation, and production infrastructure management on AWS, GCP and Vultr.
            </p>
            <p>
              Shubham is also an open source contributor with hands-on experience in decentralized and peer-to-peer
              systems — libp2p and DePIN networks — and came to backend engineering from a Mechanical Engineering degree,
              through open-source contributions and production project work.
            </p>
          </div>
        </Reveal>
        <div className="w-full max-w-[240px] md:col-[1/span_3] md:row-start-1 md:max-w-none md:pr-6 md:pt-2">
          <AboutDeveloper />
        </div>
      </div>

      {/* evidence: two-column metrics, thin dividers, attribution under each figure */}
      <section aria-labelledby="evidence-h" className="mt-20 grid grid-cols-1 gap-5 sm:mt-24 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-3">
          <h3 id="evidence-h" className="text-h4 font-medium">
            The evidence
          </h3>
          <p className="meta mt-1 text-mute">Each figure with its source</p>
        </Reveal>
        <Reveal className="md:col-span-9">
          <ul className="grid grid-cols-1 border-t border-ink sm:grid-cols-2">
            {evidence.map((e, i) => (
              <li key={e.text} className={`border-b border-rule ${i % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8"}`}>
                <a href={e.anchor} className="group flex h-full flex-col py-7">
                  <span className="display text-stat tabular-nums">{e.figure}</span>
                  <span className="mt-4 text-ink-2 text-pretty">{e.text}</span>
                  <span className="meta mt-auto pt-4 text-mute transition-colors group-hover:text-red">
                    {e.source} →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section aria-labelledby="strengths-h" className="mt-20 grid grid-cols-1 gap-5 sm:mt-24 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-3">
          <h3 id="strengths-h" className="text-h4 font-medium">
            Key strengths
          </h3>
          <p className="meta mt-1 text-mute">Seven principles that run through the work on this page</p>
        </Reveal>
        <ol className="grid grid-cols-1 gap-x-8 border-t border-ink sm:grid-cols-2 md:col-span-9">
          {strengths.map((s, i) => (
            <Reveal as="li" key={s.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 border-b border-rule py-6">
              <span className="meta pt-0.5 font-medium text-red tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h4 className="text-h4 font-medium">{s.title}</h4>
                <p className="mt-2 text-ink-2 text-pretty">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>
    </section>
  );
}
