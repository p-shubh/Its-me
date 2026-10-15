import { profile } from "../data";
import { sections } from "./Masthead";
import { ext } from "./ui";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="wrap grid gap-8 py-12 grid-cols-1 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          <p className="display text-[2.5rem] leading-none">{profile.name}</p>
          <p className="mt-2 text-night-mute">
            {profile.title} · © {new Date().getFullYear()}
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-5">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-night-mute">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="transition-colors hover:text-paper">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={profile.github} {...ext} className="transition-colors hover:text-paper">
                GitHub<span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.linkedin} {...ext} className="transition-colors hover:text-paper">
                LinkedIn<span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
        <a href="#top" className="justify-self-start font-medium underline underline-offset-4 md:col-span-2 md:justify-self-end">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
