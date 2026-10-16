import { motion, useReducedMotion } from "motion/react";
import { ArrowDownToLine, ArrowRight, Mail } from "lucide-react";
import { education, experience, profile } from "../data";
import HeroStack from "./HeroStack";
import { ext } from "./ui";

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.05em]" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.05em]" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

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
    <section id="top" className="wrap pt-24 sm:pt-28">
      <div className="grid grid-cols-1 gap-12 xl:grid-cols-12 xl:gap-10">
        <div className="xl:col-span-4 xl:pt-6">
          <motion.p {...fade(0)} className="meta flex flex-wrap items-center gap-x-5 gap-y-1 font-medium tracking-[0.18em] uppercase">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-red" aria-hidden />
              {profile.title}
            </span>
            {/* <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-red" aria-hidden />
              Golang developer
            </span> */}
          </motion.p>

          <motion.h1
            {...fade(0.08)}
            className="mt-6 text-[clamp(3rem,1.6rem+4.4vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em]"
          >
            {profile.firstName}
            <br />
            {profile.lastName}
          </motion.h1>
          {/* hand-drawn underline */}
          <svg viewBox="0 0 240 18" className="mt-3 w-[11rem]" aria-hidden>
            <motion.path
              d="M4 13 C60 4 140 2 236 7 M30 15 C90 9 150 9 200 11"
              fill="none"
              stroke="#c2370f"
              strokeWidth={4}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
            />
          </svg>

          <motion.p {...fade(0.2)} className="mt-7 max-w-[34ch] text-lede text-pretty text-ink-2">
            I build scalable backend systems with Go that stay reliable under concurrent, high-throughput load — gRPC and
            REST APIs, event-driven pipelines and real-time infrastructure, owned from schema to production.
          </motion.p>

          <motion.div {...fade(0.3)} className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-solid">
              View projects <ArrowRight className="size-4" aria-hidden />
            </a>
            <a href={profile.resume} download className="btn btn-line">
              <ArrowDownToLine className="size-4" aria-hidden /> Résumé (PDF)
            </a>
          </motion.div>

          <motion.div {...fade(0.4)} className="mt-9">
            <p className="meta font-medium tracking-[0.18em] text-mute uppercase">Let&rsquo;s connect</p>
            <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <a className="ulink inline-flex items-center gap-2" href={`mailto:${profile.email}`}>
                <Mail className="size-[1.05em]" aria-hidden /> Email
              </a>
              <a className="ulink inline-flex items-center gap-2" href={profile.github} {...ext}>
                <GitHubMark /> GitHub<span className="sr-only"> (opens in new tab)</span>
              </a>
              <a className="ulink inline-flex items-center gap-2" href={profile.linkedin} {...ext}>
                <LinkedInMark /> LinkedIn<span className="sr-only"> (opens in new tab)</span>
              </a>
            </p>
          </motion.div>
        </div>

        <motion.div {...fade(0.15)} className="xl:col-span-8">
          <HeroStack />
        </motion.div>
      </div>

      {/* facts */}
      <div className="mt-14 grid grid-cols-1 gap-12 border-t border-ink pt-8 pb-14 md:grid-cols-12 md:gap-8 lg:pb-20">
        <dl className="grid content-start gap-6 sm:grid-cols-2 md:col-span-12 lg:grid-cols-4">
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
        </dl>

      </div>
    </section>
  );
}
