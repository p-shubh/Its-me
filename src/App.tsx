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

export default function App() {
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
