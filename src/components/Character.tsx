import { useEffect, useRef, useState } from "react";
import cheering from "../assets/dev-cheering.webp";
import explaining from "../assets/dev-explaining.webp";
import thinking from "../assets/dev-thinking.webp";
import typing from "../assets/dev-typing.webp";

/*
 * Shubham's illustrated character, one pose per section. The poses are flat raster
 * illustrations, so motion is limited to the whole figure: a short entrance on first
 * view, then a slow breath (scaleY from the feet) while on screen and the tab is
 * visible. Reduced motion, or no JavaScript, shows the plain image.
 */

const poses = {
  typing: { src: typing, w: 900, h: 835 },
  thinking: { src: thinking, w: 508, h: 1515 },
  explaining: { src: explaining, w: 760, h: 677 },
  cheering: { src: cheering, w: 560, h: 1060 },
} as const;

export type Pose = keyof typeof poses;

export default function Character({ pose, eager = false, className = "" }: { pose: Pose; eager?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);
  const [live, setLive] = useState(false);
  const p = poses[pose];

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setArmed(true);
    let onScreen = false;
    const sync = () => setLive(onScreen && !document.hidden);
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (e.isIntersecting) setSeen(true);
        sync();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`char ${className}`}
      data-armed={armed && !seen ? "" : undefined}
      data-in={seen ? "" : undefined}
      data-live={live ? "" : undefined}
    >
      <div className="char-body">
        <img
          src={p.src}
          width={p.w}
          height={p.h}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className="block h-auto w-full select-none"
        />
      </div>
    </div>
  );
}
