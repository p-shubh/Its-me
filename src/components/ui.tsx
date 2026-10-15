import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Comp>
  );
}

/** A single italic serif word inside a Geist heading — the only place the serif appears. */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="accent">{children}</em>;
}

/** Editorial section opener: numbered rule, label, oversized serif title. */
export function SectionHead({
  no,
  label,
  title,
  lede,
  night = false,
}: {
  no: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  night?: boolean;
}) {
  return (
    <Reveal
      className={`grid gap-6 border-t pt-5 grid-cols-1 md:grid-cols-12 md:gap-8 ${night ? "border-paper" : "border-ink"}`}
    >
      <p className="meta flex items-baseline gap-3 md:col-span-3">
        <span className={`font-medium ${night ? "text-red-bright" : "text-red"}`}>§ {no}</span>
        <span className="font-medium">{label}</span>
      </p>
      <div className="md:col-span-9">
        <h2 className="display max-w-[20ch] text-h2">{title}</h2>
        {lede && (
          <p className={`mt-6 max-w-[38rem] text-lede text-pretty ${night ? "text-night-mute" : "text-ink-2"}`}>
            {lede}
          </p>
        )}
      </div>
    </Reveal>
  );
}

/** Inline technology list — a quiet line of text instead of a pile of badges. */
export function StackLine({ items, night = false }: { items: string[]; night?: boolean }) {
  return (
    <p className={`meta ${night ? "text-night-mute" : "text-mute"}`}>
      <span className={`mr-3 font-medium ${night ? "text-paper" : "text-ink"}`}>Stack</span>
      {items.map((t, i) => (
        <span key={t}>
          {t}
          {i < items.length - 1 && <span className="opacity-50"> &nbsp;/ </span>}
        </span>
      ))}
    </p>
  );
}

export function Figure({
  no,
  caption,
  children,
  night = false,
  className = "",
}: {
  no: string;
  caption: ReactNode;
  children: ReactNode;
  night?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      {children}
      <figcaption
        className={`meta mt-4 flex gap-3 border-t pt-3 ${
          night ? "border-rule-night text-night-mute" : "border-rule text-mute"
        }`}
      >
        <span className={`shrink-0 font-medium ${night ? "text-paper" : "text-ink"}`}>Fig. {no}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
