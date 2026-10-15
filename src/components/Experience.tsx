import { experience } from "../data";
import { Reveal, SectionHead, StackLine } from "./ui";

/** Puts the CV's own measurable results in bold so they can be found at a glance. */
function emphasise(text: string) {
  const key = /(50% reduction in API response times|thousands of concurrent subscribers|zero-downtime deployment)/;
  return text.split(key).map((part, i) => (key.test(part) ? <strong key={i} className="font-semibold text-ink">{part}</strong> : part));
}

export default function Experience() {
  return (
    <section id="experience" className="wrap pt-28 pb-24 sm:pt-40 sm:pb-36">
      <SectionHead
        no="03"
        label="Experience"
        title={
          <>
            Two companies, <em className="text-red">two</em> continents.
          </>
        }
        lede="One through-line: event-driven backends in Go that hold up under concurrent load — designed, shipped and operated."
      />

      <div className="mt-16 sm:mt-24">
        {experience.map((r, idx) => (
          <article
            key={r.id}
            id={`exp-${r.id}`}
            className={`grid gap-10 border-t border-ink pt-8 grid-cols-1 md:grid-cols-12 md:gap-8 ${idx > 0 ? "mt-20 sm:mt-28" : ""}`}
          >
            <Reveal className="md:col-span-4">
              <div className="md:sticky md:top-24">
                <p className="text-lg font-medium">
                  {r.start} – <span className={r.current ? "text-red" : ""}>{r.end}</span>
                </p>
                <h3 className="display mt-4 text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[0.92]">{r.company}</h3>
                <p className="mt-4 text-lg">{r.title}</p>
                <p className="mt-1 text-mute">
                  {r.location} · {r.mode}
                </p>
              </div>
            </Reveal>

            <div className="md:col-span-8 lg:col-[6/span_7]">
              <Reveal>
                <p className="display text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.15] italic text-pretty">{r.context}</p>
              </Reveal>
              <ol className="mt-8">
                {r.points.map((p, i) => (
                  <Reveal as="li" key={p} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-rule py-5">
                    <span className="meta pt-1 text-mute">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-[1.0625rem] leading-relaxed text-ink-2 text-pretty">{emphasise(p)}</p>
                  </Reveal>
                ))}
              </ol>
              <Reveal className="border-t border-ink pt-5">
                <StackLine items={r.stack} />
                {r.subProject && (
                  <p className="mt-5 text-ink-2">
                    Also at {r.company}:{" "}
                    <a href="#sotreus" className="ulink font-medium text-ink">
                      {r.subProject.name}
                    </a>{" "}
                    — case 04 above.
                  </p>
                )}
              </Reveal>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
