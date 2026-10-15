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
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Comp>
  );
}

/** Section opener on the 12-column grid: number and label in 3 columns, heading in 9. */
export function SectionHead({
  no,
  label,
  title,
  lede,
}: {
  no: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <Reveal className="grid grid-cols-1 gap-5 border-t border-ink pt-5 md:grid-cols-12 md:gap-8">
      <p className="meta flex items-baseline gap-3 md:col-span-3">
        <span className="font-medium text-red tabular-nums">{no}</span>
        <span className="font-medium">{label}</span>
      </p>
      <div className="md:col-span-9">
        <h2 className="display max-w-[22ch] text-h2">{title}</h2>
        {lede && <p className="mt-5 max-w-[38rem] text-lede text-pretty text-ink-2">{lede}</p>}
      </div>
    </Reveal>
  );
}

/** Inline technology list — a quiet line of text instead of a pile of badges. */
export function StackLine({ items }: { items: string[] }) {
  return (
    <p className="meta text-mute">
      <span className="mr-3 font-medium text-ink">Stack</span>
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
  className = "",
}: {
  no: string;
  caption: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={className}>
      {children}
      <figcaption className="meta mt-4 flex gap-3 border-t border-rule pt-3 text-mute">
        <span className="shrink-0 font-medium text-ink">Fig. {no}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
