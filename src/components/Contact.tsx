import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { profile } from "../data";
import { Reveal, ext } from "./ui";

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
    <section id="contact" className="bg-red text-paper">
      <div className="wrap py-20 sm:py-28">
        <Reveal className="meta flex items-baseline gap-3 border-t border-paper pt-5">
          <span className="font-medium">§ 06</span>
          <span className="font-medium">Contact</span>
        </Reveal>

        <Reveal className="mt-10">
          <h2 className="display max-w-[16ch] text-h2 text-ink">
            Let&rsquo;s build something that <em className="accent !text-paper">stays up</em>.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 grid-cols-1 md:grid-cols-12 md:gap-8 lg:mt-24">
          <Reveal className="md:col-span-6">
            <p className="text-lede">Write directly —</p>
            <a
              href={`mailto:${profile.email}`}
              className="group mt-2 inline-flex max-w-full items-start gap-2 text-[clamp(1.125rem,0.9rem+1.2vw,1.75rem)] leading-snug font-medium [overflow-wrap:anywhere] underline decoration-1 underline-offset-[0.2em]"
            >
              {profile.email}
              <ArrowUpRight className="mt-1 size-[0.9em] shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
            </a>
            <div className="mt-6">
              <button
                type="button"
                onClick={copy}
                className="btn border-paper text-paper hover:bg-paper hover:text-red"
              >
                {copied ? "Copied to clipboard" : "Copy email address"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied" : ""}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="md:col-span-6 lg:col-[8/span_5]">
            <ul className="border-t border-paper/60">
              {rows.map((r) => (
                <li key={r.label} className="border-b border-paper/60">
                  <a
                    href={r.href}
                    {...(r.external ? ext : {})}
                    {...(r.download ? { download: true } : {})}
                    className="group grid grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-5 transition-colors hover:text-ink"
                  >
                    <span className="font-medium">{r.label}</span>
                    <span className="min-w-0 break-words">{r.value}</span>
                    <ArrowUpRight className="size-5 self-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    {r.external && <span className="sr-only"> (opens in new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
