import { useEffect } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Cover from "./components/Cover";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Masthead from "./components/Masthead";
import Security from "./components/Security";
import Stack from "./components/Stack";
import Work from "./components/Work";

/**
 * The page is rendered by JavaScript, so on a direct visit to a link like /#toolkit the
 * browser looks for the anchor before it exists and stays at the top. Once rendered, scroll
 * to it ourselves — again after webfonts settle, since they shift the layout slightly.
 */
function useInitialHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const go = () => document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    const raf = requestAnimationFrame(go);
    document.fonts?.ready.then(go);
    return () => cancelAnimationFrame(raf);
  }, []);
}

export default function App() {
  useInitialHashScroll();
  return (
    <div className="paper">
      <a
        href="#main"
        className="sr-only z-[70] bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Masthead />
      <main id="main">
        <Cover />
        <About />
        <Work />
        <Security />
        <Experience />
        <Stack />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
