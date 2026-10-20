// Content for the v2 home page: short summaries that point to the full case studies.
// Every figure and claim here is already on the main page (from the CV or the public repos).

export type CaseId = "netsepio" | "atlas" | "trading" | "sotreus" | "myriadflow" | "docsai" | "toolkit";

export const cases: {
  id: CaseId;
  name: string;
  kind: string;
  metric: string;
  metricLabel: string;
  line: string;
  tags: string[];
}[] = [
  {
    id: "docsai",
    name: "DocsAI",
    kind: "Personal project · RAG",
    metric: "Go + Python",
    metricLabel: "over gRPC, with streamed answers",
    line: "Chat with your documents: chunking, embeddings and pgvector retrieval, with cited answers streamed to a Next.js app.",
    tags: ["Golang", "Python", "gRPC", "pgvector", "Next.js"],
  },
  {
    id: "netsepio",
    name: "Netsepio",
    kind: "Open source · DePIN",
    metric: "1.01M",
    metricLabel: "requests/day of abnormal traffic, contained",
    line: "Edge security and production operations: WAF bypass fix, per-IP rate limiting, automated blocking, PostgreSQL access control.",
    tags: ["Golang", "libp2p", "Cloudflare", "PostgreSQL"],
  },
  {
    id: "atlas",
    name: "Atlas",
    kind: "Personal project",
    metric: "17 → 1.1 GB",
    metricLabel: "metrics database recovered",
    line: "Fleet observability: Go agents report over libp2p to a control plane, history in TimescaleDB, role-based dashboard.",
    tags: ["Golang", "libp2p", "TimescaleDB", "React"],
  },
  {
    id: "trading",
    name: "Real-Time Trading Calculator",
    kind: "Personal project",
    metric: "Sub-ms",
    metricLabel: "broadcast to concurrent clients",
    line: "A WebSocket engine that streams buy/sell signals, computes P&L per position and keeps sessions alive across reconnects.",
    tags: ["Golang", "WebSocket"],
  },
  {
    id: "sotreus",
    name: "Sotreus",
    kind: "Lazarus Network",
    metric: "WireGuard",
    metricLabel: "multi-instance VPN orchestration",
    line: "Self-hosted VPN infrastructure: provisioning API, isolated VPN + DNS-firewall pairs, NAT and kernel interface management.",
    tags: ["Golang", "Docker", "wgctrl", "Pi-hole"],
  },
  {
    id: "myriadflow",
    name: "MyriadFlow",
    kind: "Open source · NFT / phygital",
    metric: "Event-driven",
    metricLabel: "mints, transfers, marketplace activity",
    line: "Backend services for a phygital NFT platform: async event pipelines and gRPC microservices on PostgreSQL.",
    tags: ["Golang", "gRPC", "PostgreSQL", "Docker"],
  },
  {
    id: "toolkit",
    name: "Infrastructure toolkit",
    kind: "Scripts and runbooks",
    metric: "21 checks",
    metricLabel: "verifying each hardened server",
    line: "Server hardening paired with a verifier, a Prometheus/Grafana/Alertmanager stack, and installers for Docker, Traefik and Caddy.",
    tags: ["Bash", "Prometheus", "Grafana", "Docker Compose"],
  },
];

export const proof = [
  { value: "Since 2022", label: "building production backends in Go" },
  { value: "50%", label: "faster API responses with a Redis cache" },
  { value: "1.01M", label: "req/day of abnormal traffic contained" },
  { value: "17 → 1.1 GB", label: "database recovered" },
];
