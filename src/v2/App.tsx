import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Mail } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { education, experience, profile, skills } from "../data";
import HeroStack from "../components/HeroStack";
import Security from "../components/Security";
import Toolkit from "../components/Toolkit";
import { AtlasCase, DocsAiCase, MyriadFlowCase, NetsepioCase, SotreusCase, TradingCase } from "../components/Work";
import { Reveal, SectionHead, ext } from "../components/ui";
import { cases, proof, type CaseId } from "./content";

/*
 * v2 — a shorter home page with the depth one click away.
 * Routes live in the hash: "#/work/<id>" and "#/security" are detail pages; any other hash
 * ("#work", "#contact") is a section of the home page.
 */

type Route = { page: "home" } | { page: "case"; id: CaseId } | { page: "security" };

function parse(hash: string): Route {
  const m = hash.match(/^#\/work\/([a-z]+)/);
  if (m && cases.some((c) => c.id === m[1])) return { page: "case", id: m[1] as CaseId };
  if (hash.startsWith("#/security")) return { page: "security" };
  return { page: "home" };
}

function useRoute() {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // after each route change: detail pages start at the top; home scrolls to its #section if any
  useEffect(() => {
    const go = () => {
      const h = window.location.hash;
      if (route.page !== "home") return window.scrollTo({ top: 0, behavior: "instant" });
      const el = h && !h.startsWith("#/") ? document.getElementById(decodeURIComponent(h.slice(1))) : null;
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    };
    const raf = requestAnimationFrame(go);
    document.fonts?.ready.then(go);
    return () => cancelAnimationFrame(raf);
  }, [route]);

  return route;
}

/* ── shared bits ─────────────────────────────────────────────────────────── */

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

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li key={t} className="meta rounded border border-rule bg-paper px-1.5 py-px text-ink-2">
          {t}
        </li>
      ))}
    </ul>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Apr 2023" → months since year 0; "Present" → now. */
function toMonths(s: string) {
  if (s === "Present") {
    const d = new Date();
    return d.getFullYear() * 12 + d.getMonth();
  }
  const [m, y] = s.split(" ");
  return Number(y) * 12 + MONTHS.indexOf(m);
}

function duration(start: string, end: string) {
  const n = toMonths(end) - toMonths(start) + (end === "Present" ? 1 : 0);
  const y = Math.floor(n / 12);
  const m = n % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

/* ── navigation ─────────────────────────────────────────────────────────── */

const navLinks = [
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#security", label: "Security" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-paper/92 backdrop-blur-md">
      <div className="wrap flex h-14 items-center justify-between gap-6">
        <a href="#top" className="font-semibold tracking-tight">
          {profile.name}
        </a>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 text-[0.9375rem] text-ink-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-red">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={profile.resume} download className="btn btn-solid !min-h-9 !px-3.5 !text-[0.875rem]">
                <ArrowDownToLine className="size-3.5" aria-hidden /> Résumé
              </a>
            </li>
          </ul>
        </nav>
        <button type="button" onClick={() => setOpen((o) => !o)} className="min-h-11 px-1 font-medium md:hidden" aria-expanded={open} aria-controls="v2-menu">
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="v2-menu" aria-label="Primary" className="border-t border-rule bg-paper md:hidden">
          <ul className="wrap py-2">
            {navLinks.map((l) => (
              <li key={l.href} className="border-b border-rule last:border-0">
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg font-medium">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="py-3">
              <a href={profile.resume} download className="btn btn-solid w-full">
                <ArrowDownToLine className="size-4" aria-hidden /> Download résumé
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

/* ── home ───────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="top" className="wrap pt-24 sm:pt-28">
      <div className="grid grid-cols-1 gap-12 xl:grid-cols-12 xl:gap-10">
        <div className="xl:col-span-4 xl:pt-4">
          <p className="meta flex items-center gap-2 font-medium tracking-[0.18em] uppercase">
            <span className="size-1.5 rounded-full bg-red" aria-hidden />
            {profile.title}
          </p>
          <h1 className="mt-5 text-[clamp(3rem,1.6rem+4.4vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em]">
            {profile.firstName}
            <br />
            {profile.lastName}
          </h1>
          <p className="mt-6 text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-none font-semibold tracking-[-0.03em] text-red">
            0 <span className="text-mute">→</span> 1 <span className="text-mute">→</span> 10×
          </p>
          <p className="mt-3 text-lede font-medium text-pretty">Engineering solutions. Solving hard problems. Scaling ideas.</p>
          <p className="mt-3 max-w-[36ch] text-ink-2 text-pretty">
            I turn complex problems into reliable, scalable software — from first principles to production systems, across
            technologies and domains.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-solid">
              View work <ArrowRight className="size-4" aria-hidden />
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-line">
              <Mail className="size-4" aria-hidden /> Get in touch
            </a>
          </div>
          <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-ink-2">
            <a className="ulink inline-flex items-center gap-2" href={profile.github} {...ext}>
              <GitHubMark /> GitHub<span className="sr-only"> (opens in new tab)</span>
            </a>
            <a className="ulink inline-flex items-center gap-2" href={profile.linkedin} {...ext}>
              <LinkedInMark /> LinkedIn<span className="sr-only"> (opens in new tab)</span>
            </a>
            <a className="ulink inline-flex items-center gap-2" href={profile.resume} download>
              <ArrowDownToLine className="size-[1.05em]" aria-hidden /> Résumé
            </a>
          </p>
        </div>
        <div className="xl:col-span-8">
          <HeroStack />
        </div>
      </div>

      {/* proof line: real figures only */}
      <ul className="mt-12 grid grid-cols-2 border-y border-ink md:grid-cols-4" aria-label="Highlights">
        {proof.map((p, i) => (
          <li key={p.value} className={`py-5 ${i % 2 ? "pl-5" : "pr-5"} md:px-6 ${i > 0 ? "md:border-l md:border-rule" : "md:pl-0"} ${i % 2 ? "border-l border-rule md:border-l" : ""} ${i > 1 ? "border-t border-rule md:border-t-0" : ""}`}>
            <p className="text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] leading-none font-semibold tracking-[-0.03em] tabular-nums">{p.value}</p>
            <p className="meta mt-2 text-mute">{p.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="wrap pt-24 sm:pt-32">
      <SectionHead no="01" label="Experience" title="Where I've worked." />
      <ol className="mt-10 grid grid-cols-1 md:grid-cols-12 md:gap-8">
        <div className="md:col-[4/span_9]">
          {experience.map((r) => (
            <Reveal as="li" key={r.id} className="list-none border-t border-rule py-6 last:border-b">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-h4 font-semibold">{r.company}</h3>
                <p className="meta text-mute tabular-nums">
                  {r.start} – <span className={r.current ? "font-medium text-red" : ""}>{r.end}</span> · {duration(r.start, r.end)}
                </p>
              </div>
              <p className="mt-1 text-ink-2">
                {r.title} <span className="text-mute">· {r.location} · {r.mode}</span>
              </p>
              <div className="mt-3">
                <Tags items={r.stack.slice(0, 7)} />
              </div>
              <details className="group mt-3">
                <summary className="meta inline-flex cursor-pointer list-none items-center gap-1 font-medium text-ink hover:text-red [&::-webkit-details-marker]:hidden">
                  What I did <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-3 font-medium text-pretty">{r.context}</p>
                <ul className="prose-list mt-3 max-w-[48rem] space-y-2.5 text-ink-2">
                  {r.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {r.subProject && (
                  <p className="mt-4 text-ink-2">
                    Also at {r.company}:{" "}
                    <a href="#/work/sotreus" className="ulink font-medium text-ink">
                      Sotreus
                    </a>
                  </p>
                )}
              </details>
            </Reveal>
          ))}
        </div>
      </ol>
    </section>
  );
}

function WorkSection() {
  return (
    <section id="work" className="wrap pt-24 sm:pt-32">
      <SectionHead no="02" label="Work" title="Selected work." lede="Each card opens the full case study, with architecture diagrams and the details." />
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cases.map((c) => (
          <Reveal as="li" key={c.id} className="list-none">
            <a
              href={`#/work/${c.id}`}
              className="group flex h-full flex-col rounded-xl border border-rule bg-[#fbf9f5] p-5 transition-colors hover:border-ink/40"
            >
              <p className="meta text-mute">{c.kind}</p>
              <h3 className="mt-1 text-h4 font-semibold transition-colors group-hover:text-red">{c.name}</h3>
              <p className="mt-4 text-[1.5rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">{c.metric}</p>
              <p className="meta mt-1 text-mute">{c.metricLabel}</p>
              <p className="mt-4 text-ink-2 text-pretty">{c.line}</p>
              <div className="mt-auto pt-5">
                <Tags items={c.tags} />
                <p className="meta mt-4 inline-flex items-center gap-1 font-medium text-ink group-hover:text-red">
                  Read the case study <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </p>
              </div>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

const securityLayers = ["Edge", "Rate limiting", "Transport", "Identity", "Authorization", "Data", "Operate"];

function SecuritySummary() {
  return (
    <section id="security" className="wrap pt-24 sm:pt-32">
      <SectionHead
        no="03"
        label="Security"
        title="Security, layer by layer."
        lede="Each layer blocks the threats it understands, as early as practical, before traffic reaches more expensive components."
      />
      <Reveal className="mt-10 grid grid-cols-1 md:grid-cols-12 md:gap-8">
        <div className="md:col-[4/span_9]">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="Security layers">
            {securityLayers.map((l, i) => (
              <li key={l} className="flex items-center gap-2">
                <span className="rounded-lg border border-rule bg-[#fbf9f5] px-3 py-2 text-[0.9375rem]">
                  <span className="meta mr-1.5 font-medium text-red tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {l}
                </span>
                {i < securityLayers.length - 1 && (
                  <span className="text-mute" aria-hidden>
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-5 max-w-[44rem] text-ink-2 text-pretty">
            WAF rules and per-IP rate limiting at the edge, TLS and Zero Trust, JWT / PASETO / OAuth identity, RBAC and tenant
            isolation, PostgreSQL least privilege with row-level security, and monitored, gated releases.
          </p>
          <a href="#/security" className="btn btn-line mt-6">
            Read the security breakdown <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="wrap pt-24 sm:pt-32">
      <SectionHead no="04" label="Skills" title="Tools I reach for." />
      <Reveal className="mt-10 grid grid-cols-1 md:grid-cols-12 md:gap-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:col-[4/span_9]">
          {skills.map((g) => (
            <div key={g.label}>
              <dt className="meta font-medium text-ink">{g.label}</dt>
              <dd className="mt-2">
                <Tags items={g.items.map((s) => s.replace(" (primary)", ""))} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal className="mt-12 grid grid-cols-1 border-t border-rule pt-6 md:grid-cols-12 md:gap-8">
        <p className="meta font-medium md:col-span-3">Education</p>
        <p className="md:col-span-9">
          {education.degree} <span className="text-mute">· {education.institution}, {education.place} · {education.year.replace("Graduated ", "")}</span>
        </p>
      </Reveal>
    </section>
  );
}

function useLocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const iv = setInterval(() => setT(fmt()), 30000);
    return () => clearInterval(iv);
  }, []);
  return t;
}

function ContactSection() {
  const time = useLocalTime();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <section id="contact" className="wrap pt-24 pb-20 sm:pt-32 sm:pb-28">
      <SectionHead no="05" label="Contact" title="Let’s build something that stays up." />
      <Reveal className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-[4/span_5]">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex max-w-full items-start gap-2 text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] leading-snug font-medium [overflow-wrap:anywhere] underline decoration-rule underline-offset-[0.25em] hover:text-red hover:decoration-red"
          >
            {profile.email}
            <ArrowUpRight className="mt-1 size-[0.9em] shrink-0" aria-hidden />
          </a>
          <div className="mt-5">
            <button type="button" onClick={copy} className="btn btn-line">
              {copied ? "Copied to clipboard" : "Copy email address"}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Email address copied" : ""}
            </span>
          </div>
        </div>
        <div className="md:col-span-4">
          <p className="meta text-mute">Based in</p>
          <p className="mt-1">
            Pune, India <span className="text-mute">· {time} IST</span>
          </p>
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <a className="ulink inline-flex items-center gap-2" href={profile.github} {...ext}>
              <GitHubMark /> GitHub<span className="sr-only"> (opens in new tab)</span>
            </a>
            <a className="ulink inline-flex items-center gap-2" href={profile.linkedin} {...ext}>
              <LinkedInMark /> LinkedIn<span className="sr-only"> (opens in new tab)</span>
            </a>
            <a className="ulink" href={profile.phoneHref}>
              {profile.phone}
            </a>
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <ExperienceSection />
      <WorkSection />
      <SecuritySummary />
      <SkillsSection />
      <ContactSection />
    </>
  );
}

/* ── detail pages ───────────────────────────────────────────────────────── */

const caseViews: Record<CaseId, () => ReactNode> = {
  netsepio: NetsepioCase,
  atlas: AtlasCase,
  trading: TradingCase,
  sotreus: SotreusCase,
  myriadflow: MyriadFlowCase,
  docsai: DocsAiCase,
  toolkit: Toolkit,
};

function DetailBar({ back, prev, next }: { back: string; prev?: { href: string; label: string }; next?: { href: string; label: string } }) {
  return (
    <div className="wrap flex flex-wrap items-center justify-between gap-4 pt-20 sm:pt-24">
      <a href={back} className="meta inline-flex items-center gap-1.5 font-medium hover:text-red">
        <ArrowLeft className="size-3.5" aria-hidden /> All work
      </a>
      <span className="meta flex gap-5 text-mute">
        {prev && (
          <a href={prev.href} className="hover:text-red">
            ← {prev.label}
          </a>
        )}
        {next && (
          <a href={next.href} className="hover:text-red">
            {next.label} →
          </a>
        )}
      </span>
    </div>
  );
}

function CasePage({ id }: { id: CaseId }) {
  const i = cases.findIndex((c) => c.id === id);
  const prev = cases[i - 1];
  const next = cases[i + 1];
  const View = caseViews[id];
  return (
    <>
      <DetailBar
        back="#work"
        prev={prev && { href: `#/work/${prev.id}`, label: prev.name }}
        next={next && { href: `#/work/${next.id}`, label: next.name }}
      />
      {/* case components open with a large top margin meant for the long page; pull it in */}
      <div className="-mt-20 sm:-mt-32">
        <View />
      </div>
      <div className="wrap mt-24 border-t border-ink py-10">
        <a href="#work" className="btn btn-line">
          <ArrowLeft className="size-4" aria-hidden /> Back to all work
        </a>
      </div>
    </>
  );
}

function SecurityPage() {
  return (
    <>
      <DetailBar back="#security" />
      <div className="-mt-20 sm:-mt-32">
        <Security />
      </div>
      <div className="wrap border-t border-ink py-10">
        <a href="#security" className="btn btn-line">
          <ArrowLeft className="size-4" aria-hidden /> Back home
        </a>
      </div>
    </>
  );
}

/* ── app ────────────────────────────────────────────────────────────────── */

export default function App() {
  const route = useRoute();
  return (
    <div className="paper">
      <a href="#main" className="sr-only z-[70] bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        {route.page === "home" && <Home />}
        {route.page === "case" && <CasePage key={route.id} id={route.id} />}
        {route.page === "security" && <SecurityPage />}
      </main>
      <footer className="border-t border-rule">
        <div className="wrap flex flex-wrap items-center justify-between gap-4 py-8">
          <p className="meta text-mute">
            {profile.name} · {profile.title} · © {new Date().getFullYear()}
          </p>
          <a href="#top" className="meta font-medium underline decoration-rule underline-offset-4 hover:text-red">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
