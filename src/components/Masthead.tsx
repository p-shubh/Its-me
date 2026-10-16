import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "../data";

export const sections = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "security", label: "Security" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "education", label: "Education" },
];

export default function Masthead() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (window.scrollY < window.innerHeight * 0.5) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const els = [...sections, { id: "contact" }]
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-paper/92 backdrop-blur-md transition-[border-color] ${
        scrolled ? "border-b border-rule" : "border-b border-transparent"
      }`}
    >
      <div className="wrap flex h-14 items-center justify-between gap-6">
        <a href="#top" className="group flex items-baseline gap-3">
          <span className="font-semibold tracking-tight">{profile.name}</span>
          <span className="meta hidden text-mute lg:inline">Backend Engineer</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.9375rem]">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "true" : undefined}
                  className={`relative py-1 transition-colors hover:text-red ${active === s.id ? "text-ink" : "text-ink-2"}`}
                >
                  {s.label}
                  {active === s.id && (
                    <motion.span layoutId="nav-rule" className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-red" />
                  )}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="btn btn-solid !min-h-10 !px-4 !text-[0.95rem]">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-11 px-1 font-medium md:hidden"
          aria-expanded={open}
          aria-controls="menu"
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-paper md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="wrap flex h-16 items-center justify-between border-b border-rule">
              <span className="font-semibold tracking-tight">{profile.name}</span>
              <button type="button" onClick={() => setOpen(false)} className="min-h-11 px-1 font-medium" autoFocus>
                Close
              </button>
            </div>
            <ul className="wrap mt-6 flex-1">
              {[...sections, { id: "contact", label: "Contact" }].map((s, i) => (
                <li key={s.id} className="border-b border-rule">
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-3"
                  >
                    <span className="text-[1.75rem] font-medium tracking-[-0.025em]">{s.label}</span>
                    <span className="meta text-red tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="wrap pb-8">
              <a href={profile.resume} download className="btn btn-solid w-full">
                Download résumé (PDF)
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
