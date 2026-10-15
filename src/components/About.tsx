import { evidence, strengths } from "../data";
import { Reveal, SectionHead } from "./ui";

export default function About() {
  return (
    <section id="about" className="wrap pb-24 sm:pb-36">
      <SectionHead
        no="01"
        label="About"
        title={
          <>
            Systems that hold up <em className="text-red">after</em> launch.
          </>
        }
      />

      <div className="mt-14 grid gap-16 grid-cols-1 md:grid-cols-12 md:gap-8 lg:mt-20">
        <div className="md:col-[4/span_9] lg:col-[4/span_5]">
          <Reveal>
            <p className="display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.12] text-pretty">
              Results-driven backend engineer with 3+ years of production experience building high-performance,
              distributed systems in Golang.
            </p>
          </Reveal>
          <Reveal delay={0.05} className="mt-8 space-y-5 text-lg leading-relaxed text-ink-2 text-pretty">
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
              Shubham is also an open source contributor with hands-on experience in decentralized and peer-to-peer systems —
              libp2p and DePIN networks — and came to backend engineering from a Mechanical Engineering degree, through
              open-source contributions and production project work.
            </p>
          </Reveal>
        </div>

        <aside className="md:col-[4/span_9] lg:col-[9/span_4]" aria-labelledby="evidence-h">
          <Reveal>
            <h3 id="evidence-h" className="flex items-baseline justify-between border-b border-ink pb-3 font-medium">
              The evidence
              <span className="meta text-mute">with attribution</span>
            </h3>
            <ol>
              {evidence.map((e) => (
                <li key={e.text} className="border-b border-rule">
                  <a href={e.anchor} className="group block py-5">
                    <span className="display block text-[2.6rem] leading-none transition-colors group-hover:text-red">
                      {e.figure}
                    </span>
                    <span className="mt-2 block leading-relaxed text-ink-2">{e.text}</span>
                    <span className="meta mt-2 block text-mute">— {e.source}</span>
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </aside>
      </div>

      <div className="mt-24 sm:mt-32">
        <Reveal className="grid gap-4 border-t border-ink pt-5 grid-cols-1 md:grid-cols-12 md:gap-8">
          <h3 className="font-medium md:col-span-3">Key strengths</h3>
          <p className="text-ink-2 md:col-span-9">Seven principles that run through the work on this page.</p>
        </Reveal>
        <ol className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.map((s, i) => (
            <Reveal as="li" key={s.title} delay={(i % 3) * 0.05} className={i === 6 ? "lg:col-span-3 lg:max-w-3xl" : ""}>
              <div>
                <span className="meta text-red">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="display mt-3 text-[2rem] leading-[1.02]">{s.title}</h4>
                <p className="mt-3 leading-relaxed text-ink-2 text-pretty">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
