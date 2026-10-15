import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

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

const DISPLAY_FONT = '"Instrument Serif"';

/**
 * Font size (px) at which `text`, set in the display face, exactly fills the box's width.
 * Measured with canvas against the loaded webfont, so it never depends on DOM timing.
 * Returns undefined until the face has loaded.
 */
export function useFitText<T extends HTMLElement>(text: string, letterSpacingEm: number) {
  const box = useRef<T>(null);
  const [size, setSize] = useState<number>();

  useLayoutEffect(() => {
    const ctx = document.createElement("canvas").getContext("2d");
    let ready = false;
    const fit = () => {
      const b = box.current;
      if (!b || !ctx || !ready) return;
      ctx.font = `400 100px ${DISPLAY_FONT}`;
      const w = ctx.measureText(text).width + letterSpacingEm * 100 * text.length;
      if (w > 0) setSize((99.5 * b.clientWidth) / w);
    };
    document.fonts.load(`400 100px ${DISPLAY_FONT}`, text).then(
      () => {
        ready = true;
        fit();
      },
      () => {},
    );
    let lastW = 0;
    const ro = new ResizeObserver(([e]) => {
      if (Math.abs(e.contentRect.width - lastW) < 0.5) return;
      lastW = e.contentRect.width;
      fit();
    });
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [text, letterSpacingEm]);

  return { box, size };
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
      <p className="flex items-baseline gap-3 md:col-span-3">
        <span className={`meta ${night ? "text-red-bright" : "text-red"}`}>§ {no}</span>
        <span className="font-medium">{label}</span>
      </p>
      <div className="md:col-span-9">
        <h2 className="display text-[clamp(3rem,8.4vw,8.5rem)] text-balance">{title}</h2>
        {lede && (
          <p className={`mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl ${night ? "text-night-mute" : "text-ink-2"}`}>
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
    <p className={`text-[0.95rem] leading-relaxed ${night ? "text-night-mute" : "text-mute"}`}>
      <span className={`meta mr-3 ${night ? "text-paper" : "text-ink"}`}>Stack</span>
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
        className={`mt-4 flex gap-3 border-t pt-3 text-sm leading-relaxed ${
          night ? "border-rule-night text-night-mute" : "border-rule text-mute"
        }`}
      >
        <span className={`meta shrink-0 ${night ? "text-paper" : "text-ink"}`}>Fig. {no}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
