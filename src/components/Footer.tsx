import { profile } from "../data";
import { sections } from "./Masthead";
import { ext } from "./ui";

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="wrap grid gap-6 py-10 grid-cols-1 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          <p className="font-medium">{profile.name}</p>
          <p className="meta mt-0.5 text-mute">
            {profile.title} · © {new Date().getFullYear()}
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-5">
          <ul className="meta flex flex-wrap gap-x-6 gap-y-2 text-mute">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="transition-colors hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={profile.github} {...ext} className="transition-colors hover:text-ink">
                GitHub<span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.linkedin} {...ext} className="transition-colors hover:text-ink">
                LinkedIn<span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
        <a href="#top" className="meta justify-self-start font-medium underline decoration-rule underline-offset-4 hover:text-red md:col-span-2 md:justify-self-end">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
