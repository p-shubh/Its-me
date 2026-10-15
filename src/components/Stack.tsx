import { skills } from "../data";
import { Reveal, SectionHead } from "./ui";

export default function Stack() {
  const total = skills.reduce((n, g) => n + g.items.length, 0);
  return (
    <section id="stack" className="bg-paper-2 py-24 sm:py-36">
      <div className="wrap">
        <SectionHead
          no="04"
          label="Technical skills"
          title={
            <>
              A technical <em className="text-red">reference</em>.
            </>
          }
          lede={`${skills.length} areas, ${total} entries — read top to bottom, from the language at the core to the tools around the work.`}
        />

        <Reveal className="mt-16 sm:mt-20">
          <ol aria-label="Technical skills by category">
            {skills.map((g, i) => (
              <li
                key={g.label}
                className="grid grid-cols-[3rem_minmax(0,1fr)] border-t border-ink/25 py-6 md:grid-cols-12 md:gap-8"
              >
                <span className="meta pt-2 text-mute md:col-span-1" aria-hidden>
                  A.{String(i + 1).padStart(2, "0")}
                </span>
                <div className="md:col-span-4 lg:col-span-3">
                  <h3 className="display text-[2rem] leading-tight">{g.label}</h3>
                  {g.note && <p className="mt-1 text-mute">{g.note}</p>}
                </div>
                <p className="col-start-2 mt-3 text-[1.125rem] leading-relaxed md:col-span-7 md:col-start-auto md:mt-0 md:pt-2 lg:col-span-8">
                  {g.items.map((s, j) => {
                    const primary = s.includes("(primary)");
                    return (
                      <span key={s}>
                        {primary ? (
                          <span className="font-semibold">
                            Golang <span className="bg-red px-1.5 py-0.5 text-sm font-medium text-paper">primary</span>
                          </span>
                        ) : (
                          s
                        )}
                        {j < g.items.length - 1 && (
                          <span className="text-mute" aria-hidden>
                            {" \u00a0/ "}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
