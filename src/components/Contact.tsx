import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { profile } from "../data";
import { Reveal, SectionHead, ext } from "./ui";

export default function Contact() {
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

  const rows = [
    { label: "Phone", value: profile.phone, href: profile.phoneHref, external: false },
    { label: "LinkedIn", value: profile.linkedinLabel, href: profile.linkedin, external: true },
    { label: "GitHub", value: profile.githubLabel, href: profile.github, external: true },
    { label: "Résumé", value: "Download the PDF", href: profile.resume, external: false, download: true },
  ];

  return (
    <section id="contact" className="wrap pt-8 pb-24 sm:pb-32">
      <SectionHead no="06" label="Contact" title="Let’s build something that stays up." />

      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8 lg:mt-14">
        <Reveal className="md:col-[4/span_9] lg:col-[4/span_4]">
            <p className="text-ink-2">Write directly —</p>
            <a
              href={`mailto:${profile.email}`}
              className="group mt-2 inline-flex max-w-full items-start gap-2 text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] leading-snug font-medium tracking-[-0.01em] [overflow-wrap:anywhere] underline decoration-rule decoration-1 underline-offset-[0.25em] transition-colors hover:text-red hover:decoration-red"
            >
              {profile.email}
              <ArrowUpRight className="mt-1 size-[0.9em] shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
            </a>
            <div className="mt-6">
              <button
                type="button"
                onClick={copy}
                className="btn btn-line"
              >
                {copied ? "Copied to clipboard" : "Copy email address"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied" : ""}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="md:col-[4/span_9] lg:col-[8/span_5]">
            <ul className="border-t border-ink">
              {rows.map((r) => (
                <li key={r.label} className="border-b border-rule">
                  <a
                    href={r.href}
                    {...(r.external ? ext : {})}
                    {...(r.download ? { download: true } : {})}
                    className="group grid grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-4 transition-colors hover:text-red"
                  >
                    <span className="font-medium">{r.label}</span>
                    <span className="min-w-0 break-words text-ink-2">{r.value}</span>
                    <ArrowUpRight className="size-4 self-center text-mute transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    {r.external && <span className="sr-only"> (opens in new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
      </div>
    </section>
  );
}
