import { Reveal, StackLine } from "./ui";

/*
 * Infrastructure toolkit — Shubham's shell scripts and runbooks for setting up, hardening and
 * monitoring Linux servers. Read from his installation_scripts repository (not linked until its
 * README is cleaned up). Compact entry, not a numbered case study.
 */

const groups = [
  {
    title: "Harden, then verify",
    text: "An Ubuntu 26 hardening script — SSH key setup, a hardened SSH config, Fail2ban, UFW firewall rules and a CVE-2026-31431 mitigation — paired with a separate verifier that runs 21 checks against the result, plus a revert script.",
  },
  {
    title: "Central monitoring",
    text: "A Docker Compose stack: Prometheus with alert rules (instance down, high and critical CPU), Grafana, and Alertmanager sending alerts to Microsoft Teams, behind Traefik. Remote servers run node-exporter and cAdvisor.",
  },
  {
    title: "Installers and runbooks",
    text: "Installers for Docker, Traefik and Caddy and a server-essentials setup that waits for the apt lock instead of failing, plus runbooks for HashiCorp Vault KV v2, PostgreSQL dump and restore, and volume backups.",
  },
];

function Box({ title, sub, strong = false }: { title: string; sub?: string; strong?: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${strong ? "border-red/40 bg-red/[0.04]" : "border-rule bg-[#fbf9f5]"}`}>
      <p className={`text-[0.9375rem] leading-tight font-medium ${strong ? "text-red" : ""}`}>{title}</p>
      {sub && <p className="meta mt-0.5 text-mute">{sub}</p>}
    </div>
  );
}

function Arrow() {
  return (
    <span className="self-center justify-self-center text-red" aria-hidden>
      <span className="md:hidden">↓</span>
      <span className="hidden md:inline">→</span>
    </span>
  );
}

/** The monitoring stack as a small flow: remote exporters → Prometheus → Grafana / Alertmanager → Teams. */
function MonitoringFlow() {
  return (
    <figure>
      <div
        className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]"
        role="img"
        aria-label="Monitoring stack: production, staging and development servers run node-exporter and cAdvisor; a central Prometheus scrapes them and evaluates alert rules; Grafana shows dashboards and Alertmanager sends alerts to Microsoft Teams; Traefik fronts the central stack."
      >
        <div className="space-y-2">
          <p className="meta font-medium text-mute">Remote servers</p>
          {["prod", "staging", "dev"].map((e) => (
            <Box key={e} title={e} sub="node-exporter · cAdvisor" />
          ))}
        </div>
        <Arrow />
        <div className="flex flex-col justify-center space-y-2">
          <p className="meta font-medium text-mute">Central · behind Traefik</p>
          <Box title="Prometheus" sub="scrapes · alert rules" strong />
        </div>
        <Arrow />
        <div className="flex flex-col justify-center space-y-2">
          <p className="meta font-medium text-mute">Out</p>
          <Box title="Grafana" sub="dashboards" />
          <Box title="Alertmanager" sub="→ Microsoft Teams" />
        </div>
      </div>
    </figure>
  );
}

export default function Toolkit() {
  return (
    <section id="toolkit" className="wrap mt-28 sm:mt-40" aria-labelledby="toolkit-h">
      <Reveal className="grid grid-cols-1 gap-4 border-t border-ink pt-5 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <p className="meta font-medium text-red">Also built</p>
          <p className="meta mt-1 text-mute">Shell · Docker Compose</p>
        </div>
        <div className="md:col-span-9">
          <h3 id="toolkit-h" className="display text-h3">
            Infrastructure toolkit
          </h3>
          <p className="mt-2 max-w-[44rem] text-lede text-pretty text-ink-2">
            Scripts and runbooks for setting up, hardening and monitoring Linux servers — with verifier scripts that check
            the result instead of assuming it.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <ul className="grid grid-cols-1 gap-6 md:col-[4/span_9] lg:grid-cols-3">
          {groups.map((g) => (
            <li key={g.title} className="border-t border-rule pt-4">
              <p className="font-medium">{g.title}</p>
              <p className="mt-1.5 text-ink-2 text-pretty">{g.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-10 grid grid-cols-1 md:grid-cols-12 md:gap-8">
        <div className="md:col-[4/span_9]">
          <MonitoringFlow />
          <div className="mt-8 border-t border-rule pt-5">
            <StackLine
              items={["Bash", "Docker Compose", "Prometheus", "Grafana", "Alertmanager", "Traefik", "Caddy", "Fail2ban", "UFW", "HashiCorp Vault", "PostgreSQL"]}
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
