import { education, strengths } from "../data";
import { Reveal, SectionHead } from "./ui";

export default function Education() {
  const learner = strengths.find((s) => s.title === "Self-driven learner")!;
  return (
    <section id="education" className="wrap py-24 sm:py-36">
      <SectionHead
        no="05"
        label="Education"
        title={
          <>
            Trained as a mechanical engineer.
          </>
        }
      />
      <div className="mt-14 grid gap-12 grid-cols-1 md:grid-cols-12 md:gap-8 lg:mt-20">
        <Reveal className="md:col-span-7 lg:col-[4/span_5]">
          <p className="meta font-medium">{education.year}</p>
          <h3 className="display mt-3 max-w-[22ch] text-h3">{education.degree}</h3>
          <p className="mt-4 text-lede">{education.institution}</p>
          <p className="text-mute">{education.place}</p>
        </Reveal>
        <Reveal delay={0.08} className="md:col-span-5 lg:col-[9/span_4]">
          <blockquote className="border-l-2 border-red pl-6">
            <p className="text-lede text-ink-2 text-pretty">“{learner.text}”</p>
            <footer className="meta mt-4 text-mute">— Key strengths, 07</footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
