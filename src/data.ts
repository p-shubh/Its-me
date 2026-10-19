// Every fact on the site comes from Shubham_Prajapati_CV.pdf. Keep this file in sync with the CV.

export const profile = {
  name: "Shubham Prajapati",
  firstName: "Shubham",
  lastName: "Prajapati",
  title: "Backend Engineer",
  focus: ["Distributed Systems", "gRPC & Event-Driven Architecture", "Real-Time Systems"],
  phone: "+91-8340535268",
  phoneHref: "tel:+918340535268",
  email: "shubhamprajapati032@gmail.com",
  linkedin: "https://www.linkedin.com/in/shubham-prajapati-5aa33117a",
  linkedinLabel: "linkedin.com/in/shubham-prajapati-5aa33117a",
  github: "https://github.com/p-shubh",
  githubLabel: "github.com/p-shubh",
  resume: `${import.meta.env.BASE_URL}Shubham_Prajapati_CV.pdf`,
  summary:
    "Results-driven Backend Engineer with 3+ years of production experience building high-performance, distributed systems in Golang. Deep expertise in designing gRPC and REST APIs, event-driven architectures, and real-time WebSocket systems that scale under concurrent load. Skilled at architecting microservices with clean separation of concerns, async pub-sub pipelines, and robust authentication layers (JWT, PASETO, OAuth 2.0). Comfortable owning the full backend lifecycle — from database schema and API design through containerized deployment, CI/CD automation, and production infrastructure management on AWS, GCP, and Vultr. Open source contributor with hands-on experience in decentralized and peer-to-peer systems (libp2p, DePIN networks).",
};

export type SkillGroup = { label: string; items: string[]; note?: string };

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["Golang (primary)", "Python", "TypeScript", "SQL", "Bash"] },
  { label: "APIs & Protocols", items: ["REST", "gRPC (Protocol Buffers)", "WebSocket", "HTTP/2"] },
  {
    label: "Distributed Systems",
    items: ["Microservices", "libp2p", "DePIN networks", "pub-sub pipelines", "async event architectures"],
  },
  {
    label: "Event-Driven Architecture",
    items: ["Pub-Sub messaging", "Redis Streams", "async pipelines", "producer-consumer decoupling"],
  },
  {
    label: "Real-Time Systems",
    items: ["WebSocket servers", "live data streaming", "concurrent connection management"],
  },
  {
    label: "Auth & Security",
    items: ["JWT", "PASETO v4", "OAuth 2.0", "OIDC", "Ethereum wallet challenge-response", "SSL/TLS"],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MySQL", "gORM", "ElephantSQL", "Supabase", "Redis", "TimescaleDB", "Valkey"],
  },
  {
    label: "Containers & DevOps",
    items: ["Docker", "Docker Compose", "GitHub Actions CI/CD", "container networking"],
  },
  {
    label: "Cloud & Infra",
    items: [
      "AWS",
      "GCP",
      "Vultr",
      "Traefik",
      "Cloudflare (WAF, Workers, Zero Trust)",
      "Uptime Kuma",
    ],
    note: "Provisioning & server management",
  },
  { label: "Networking", items: ["WireGuard", "iptables NAT", "DNS (PiHole)", "wgctrl", "TCP/IP", "SSH"] },
  {
    label: "AI & retrieval",
    items: ["RAG", "embeddings", "pgvector similarity search", "Gemini", "Ollama", "streaming answers (SSE)"],
  },
  { label: "Frontend", items: ["Next.js", "React", "Tailwind CSS"] },
  { label: "Tools", items: ["Postman", "Git", "Jira", "Notion", "Slack", "Discord"] },
];

export type SubProject = {
  name: string;
  org: string;
  tagline: string;
  stack: string[];
  points: string[];
};

export type Role = {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: string;
  start: string;
  end: string;
  current?: boolean;
  context: string;
  stack: string[];
  points: string[];
  subProject?: SubProject;
};

export const experience: Role[] = [
  {
    id: "intellixente",
    title: "Backend Engineer",
    company: "Intellixente Solutions",
    location: "Pune, India",
    mode: "On-site",
    start: "Apr 2023",
    end: "Present",
    current: true,
    context: "Project: X-Factor — Enterprise Project Management System",
    stack: ["Golang", "PostgreSQL", "Mux", "Docker"],
    points: [
      "Architected scalable, multi-tenant backend infrastructure in Golang — owning the full stack from database schema design through API layer and containerized deployment.",
      "Engineered REST APIs for user authentication (JWT/PASETO), role-based access control, and Excel-based project plan ingestion with robust server-side validation.",
      "Designed and implemented an event-driven architecture for real-time task status propagation — async pub-sub pipelines decoupling producers from consumers, ensuring reliable delivery under concurrent load.",
      "Implemented superadmin dynamic company context switching — a stateless JWT design embedding company scopes, enabling seamless multi-tenant isolation without session state.",
      "Managed Docker networking, container inspection, and server infrastructure on Vultr; configured SSL/TLS hardening (HSTS, redirect middleware) behind Cloudflare and Traefik.",
      "Led Git branching strategy, PR reviews, and GitHub Actions CI/CD pipelines for automated testing and zero-downtime deployment.",
    ],
  },
  {
    id: "lazarus",
    title: "Backend Engineer & Server Handler",
    company: "Lazarus Network",
    location: "Florida, USA",
    mode: "Remote",
    start: "Mar 2022",
    end: "Mar 2023",
    context: "High-performance event/community platform with Blockchain, NFT minting, and virtual event capabilities",
    stack: [
      "Golang",
      "gORM",
      "PostgreSQL",
      "Gin Gonic",
      "gRPC",
      "WebSocket",
      "Redis",
      "Docker",
      "Supabase",
      "Stripe",
      "MailGun",
      "GitHub Actions",
    ],
    points: [
      "Led full project lifecycle from backend infrastructure setup through production deployment, including OAuth-authenticated REST API and gRPC service design for internal microservice communication.",
      "Designed and implemented an event-driven architecture powering ticket purchasing, virtual event streaming, and NFT minting — using async pub-sub pipelines to handle bursty, high-concurrency workloads gracefully.",
      "Implemented Redis caching layer for hot-path API endpoints, achieving a 50% reduction in API response times under high-traffic event loads.",
      "Built WebSocket-based real-time notification system for live event updates and community activity feeds, supporting thousands of concurrent subscribers.",
      "Integrated Blockchain/NFT minting pipelines, Stripe payments, and MailGun transactional email — orchestrating multiple distributed services reliably.",
      "Managed server infrastructure, ensuring high availability, monitoring, and rapid bug fixes under production load.",
    ],
    subProject: {
      name: "Sotreus — Decentralized VPN Infrastructure",
      org: "Lazarus Network",
      tagline: "WireGuard orchestration, DNS firewall, kernel networking",
      stack: ["Golang", "Docker", "wgctrl", "PiHole"],
      points: [
        "Built a multi-instance WireGuard VPN orchestration system supporting isolated VPN + DNS firewall pairs per region, enabling secure and ad-filtered tunneling for all connected clients.",
        "Designed and implemented gRPC and REST APIs in Golang for programmatic VPN client provisioning, integrated with PASETO v4 token authentication and Ethereum wallet challenge-response.",
        "Engineered iptables NAT rules, DNS interception via PiHole, and kernel-level WireGuard interface management using wgctrl.",
        "Automated multi-instance deployment using Docker Compose with dynamic port allocation, duplicate instance prevention, and per-instance volume isolation.",
      ],
    },
  },
];

export const netsepio = {
  name: "Netsepio",
  subtitle: "Decentralized Internet Infrastructure (DePIN)",
  kind: "Open Source",
  stack: [
    "Golang",
    "PostgreSQL",
    "Docker",
    "libp2p",
    "gRPC",
    "Next.js",
    "BullMQ",
    "Valkey",
    "Cloudflare WAF & Workers",
  ],
  intro: [
    "Contributed to a decentralized physical infrastructure network (DePIN) designed for secure, unrestricted global connectivity.",
    "Worked with libp2p for peer-to-peer networking and gRPC for inter-node service communication, managing distributed node routing and protocol design in Golang and Docker.",
    "Engaged with real-world challenges of building overlay networks, secure tunnels, and high-availability distributed endpoints.",
  ],
  log: [
    {
      title: "Operating production",
      text: "Secured and operated production infrastructure for a NetSepio ecosystem platform (Next.js web app, mobile API, BullMQ workers) running on Vultr behind Cloudflare.",
    },
    {
      title: "Abnormal traffic",
      text: "Investigated abnormal traffic of 1.01M requests per day, 72% from a single scraper IP, and deployed per-IP API rate limiting within Cloudflare Free-plan limits, validated by load testing.",
    },
    {
      title: "Automated blocking",
      text: "Built a Cloudflare Worker on a cron trigger that queries the GraphQL Firewall Events API and adds repeat rate-limit offenders to a WAF-enforced IP block list.",
    },
    {
      title: "A WAF bypass, closed",
      text: "Found and closed a WAF bypass where spoofable Origin-header skip rules let any client evade bot protection; replaced them with IP-based and secret-header rules for monitoring and mobile clients.",
    },
    {
      title: "Outage diagnosis",
      text: "Diagnosed a production outage caused by an ioredis/BullMQ connection leak that had grown to 7,817 of 7,848 maximum Valkey clients over 31 days.",
    },
    {
      title: "Database access control",
      text: "Designed PostgreSQL access control across production, development and test databases: role isolation, scoped grants without DELETE/TRUNCATE for human users, default privileges and Row Level Security policies.",
    },
    {
      title: "Alerting through Zero Trust",
      text: "Set up uptime, memory and disk alerting with Uptime Kuma push monitors and Teams notifications, using Cloudflare Access service tokens so Zero Trust no longer silently blocked heartbeats.",
    },
  ],
};

export const myriadflow = {
  name: "MyriadFlow",
  subtitle: "NFT / Phygital Platform",
  kind: "Open Source",
  stack: ["Golang", "PostgreSQL", "Docker", "gRPC"],
  points: [
    "Built and maintained backend services for an NFT marketplace handling high-throughput event-driven workflows — async event pipelines for mint triggers, ownership transfers, and marketplace activity.",
    "Contributed to gRPC-based inter-service communication, microservices architecture design, and database optimization for scalable data retrieval under concurrent load.",
  ],
  url: "https://myriadflow.com/",
  // Public description of the platform, from myriadflow.com and its Devfolio listing
  // (devfolio.co/projects/myriadflows-phygital-xperience-d455). Not a claim about Shubham's own work.
  about:
    "An AI-powered, no-code platform that lets brands and creators launch phygital NFTs — tokens tied to physical products for verified ownership and authenticity — along with immersive brand experiences, without writing code.",
  pillars: [
    { title: "No-Code Studio", text: "A launchpad where brands create phygital NFT collections and AI-powered experiences without code." },
    { title: "Discover marketplace", text: "A marketplace that connects brands, creators and collectors around digital and physical collectibles." },
    { title: "AI-powered WebXR", text: "Brand AI agents in immersive WebXR environments that customers can interact with." },
  ],
  phygital: [
    { title: "Create", text: "A brand sets up a phygital collection in the Studio; lazy minting and Web2 logins keep the on-ramp simple." },
    { title: "Link", text: "Each physical product carries an NFC tag that links it to its NFT, for asset tracking and verified ownership." },
    { title: "Claim", text: "The owner scans the tag and opens the product's WebXR experience; fans can also claim free fan tokens." },
  ],
  publicStack: ["BASE", "Coinbase Smart Wallet", "IPFS", "Next.js", "NFC", "WebXR"],
  events: ["Mint triggers", "Ownership transfers", "Marketplace activity"],
};

export const atlas = {
  name: "Atlas",
  subtitle: "Fleet Observability Platform",
  kind: "Personal Project",
  note: "Personal project, deployed to monitor a live server fleet",
  stack: ["Golang", "libp2p", "PostgreSQL + TimescaleDB", "React/TypeScript", "Docker", "GitHub Actions"],
  points: [
    "Built a fleet observability platform end to end: Go agents on remote servers stream host metrics to a central control plane over libp2p, stored in PostgreSQL + TimescaleDB and served through a React/TypeScript dashboard.",
    "Replaced bearer enrollment tokens with libp2p Peer ID–based mutual authentication and a per-environment allowlist, with a unique persistent keypair per agent and per relationship (local vs. production).",
    "Added a protected superadmin tier to the role-based access model (viewer, operator, admin): admins cannot modify the superadmin across all 7 user-management actions, verified in production with no regression for admin-to-admin actions.",
    "Built a GitHub Actions release pipeline with a hard gate that blocks dirty builds from becoming release artifacts, and tag rules that keep test tags out of production and off the :stable image.",
    "Wrote idempotent agent install and migration scripts with dry-run mode, a 12-point health check, byte-identical identity verification and automatic rollback on failure.",
    "Recovered the metrics database after a full disk left TimescaleDB compression jobs stuck: rebuilt compression policies and chunk intervals, cutting the database from 17 GB to 1.1 GB.",
  ],
};

export const trading = {
  name: "Real-Time Trading Calculator",
  subtitle: "WebSocket Engine",
  kind: "Personal Project",
  tagline: "Live buy/sell signal streaming with P&L computation",
  stack: ["Golang", "WebSocket"],
  points: [
    "Developed a real-time WebSocket server for a live trading buy/sell calculator — streaming market signals, computing position P&L, and broadcasting live updates to multiple concurrent clients with sub-millisecond latency.",
    "Designed stateful connection management to track per-client session context, handle reconnections gracefully, and maintain consistent order book state across concurrent subscribers.",
  ],
};

export const strengths = [
  {
    title: "Distributed systems architecture",
    text: "Hands-on experience designing microservices, pub-sub event pipelines, gRPC inter-service communication, and peer-to-peer networks (libp2p, DePIN) — building systems that stay reliable under concurrent, high-throughput load.",
  },
  {
    title: "Event-driven design",
    text: "Consistently chosen async event architectures across production projects to decouple services, improve resilience, and handle bursty workloads without bottlenecks.",
  },
  {
    title: "API depth",
    text: "Fluent in both REST and gRPC — understands the trade-offs and picks the right protocol per use case; experienced with Protocol Buffers, HTTP/2, and WebSocket for different latency and throughput requirements.",
  },
  {
    title: "Performance engineering",
    text: "Proven track record of measurable improvements — 50% API response time reduction with Redis caching; sub-millisecond WebSocket broadcast latency in the trading calculator.",
  },
  {
    title: "Security-first mindset",
    text: "JWT, PASETO v4, OAuth 2.0, Ethereum wallet auth, and SSL/TLS hardening applied at every layer — not bolted on after the fact.",
  },
  {
    title: "Full ownership mentality",
    text: "Comfortable taking a feature from schema design → API implementation → containerized deployment → CI/CD pipeline → production monitoring.",
  },
  {
    title: "Self-driven learner",
    text: "Transitioned from a Mechanical Engineering background into backend engineering through open-source contributions and production project work — fast to pick up new domains and technologies.",
  },
];

export const education = {
  degree: "Bachelor of Engineering — Mechanical Engineering",
  institution: "Gandhi Institute for Technology (GIFT)",
  place: "Bhubaneswar, Odisha",
  year: "Graduated 2022",
};

// Headline evidence, each with the scope the CV gives it. `anchor` points at the section that tells the full story.
export const evidence = [
  {
    figure: "50%",
    text: "reduction in API response times under high-traffic event loads, from a Redis caching layer on hot-path endpoints.",
    source: "Lazarus Network",
    anchor: "#exp-lazarus",
  },
  {
    figure: "1.01M",
    text: "requests per day of abnormal traffic investigated — 72% from a single scraper IP — then contained with per-IP rate limiting.",
    source: "Netsepio · open source",
    anchor: "#netsepio",
  },
  {
    figure: "17 → 1.1 GB",
    text: "metrics database after recovering stuck TimescaleDB compression jobs and rebuilding chunk intervals.",
    source: "Atlas · personal project",
    anchor: "#atlas",
  },
  {
    figure: "7,817",
    text: "of 7,848 maximum Valkey clients held by an ioredis/BullMQ connection leak over 31 days — diagnosed as the cause of an outage.",
    source: "Netsepio · open source",
    anchor: "#netsepio",
  },
  {
    figure: "Sub-ms",
    text: "latency broadcasting live P&L updates to concurrent WebSocket clients.",
    source: "Trading calculator · personal project",
    anchor: "#trading",
  },
];

// ── Sotreus case study ────────────────────────────────────────────────────────
// Two sources, kept apart on purpose:
//   • the supplied Sotreus research notes (public documentation of the VPN-era project)
//   • Shubham's CV (what he built at Lazarus Network)
// Every claim carries one of these confidence labels.
export type Evidence = "documented" | "likely" | "unverified" | "cv";

export const evidenceLabels: Record<Evidence, { label: string; meaning: string }> = {
  documented: { label: "Documented", meaning: "Explicitly supported by the project research." },
  likely: { label: "Likely", meaning: "Strong architectural inference from standard VPN and DNS-firewall patterns." },
  unverified: { label: "Unverified", meaning: "Plausible implementation detail that still needs source confirmation." },
  cv: { label: "Implemented", meaning: "Built as part of this work; not shown in the public documentation." },
};

export const sotreusCase = {
  name: "Sotreus",
  subtitle: "Self-Hosted VPN Infrastructure",
  org: "Lazarus Network",
  period: "Mar 2022 – Mar 2023",
  summary:
    "A self-hosted, dedicated VPN project associated with The Lazarus Network / NetSepio. A single Sotreus deployment is controlled by one operator — it is not decentralized by itself.",
  capabilities: [
    "Client and server management.",
    "REST and gRPC APIs.",
    "API documentation served at /docs, plus a Postman collection.",
    "Email delivery of VPN configuration to clients.",
    "DNS firewall integration with AdGuard or Pi-hole, run as Docker Compose services.",
  ],
  steps: [
    {
      title: "Peer creation",
      text: "An administrator adds a client through the API.",
      evidence: "documented" as Evidence,
    },
    {
      title: "Key and configuration generation",
      text: "A key pair, a private tunnel IP and a peer entry on the wg0 interface are generated for the client.",
      evidence: "likely" as Evidence,
      note: "WireGuard interface management with wgctrl is part of the implementation. Key handling, IP allocation and the wg0 interface name are not documented.",
    },
    {
      title: "Configuration delivery",
      text: "The VPN configuration is emailed to the client.",
      evidence: "documented" as Evidence,
    },
    {
      title: "Tunnel establishment",
      text: "The client performs a WireGuard handshake over UDP and an encrypted tunnel is set up.",
      evidence: "likely" as Evidence,
      note: "The tunnel is WireGuard; the handshake and transport follow standard WireGuard behaviour rather than Sotreus documentation.",
    },
    {
      title: "Traffic filtering and egress",
      text: "DNS queries pass through the AdGuard or Pi-hole DNS firewall, and traffic exits to the internet.",
      evidence: "likely" as Evidence,
      note: "The DNS firewall is documented, and iptables NAT rules with DNS interception via Pi-hole are part of the implementation; the exact routing path is an inference.",
    },
  ],
  sourceNote:
    "No repository is linked: the current NetSepio/sotreus repository is a newer Android situational-awareness application, not the VPN implementation described here.",
};

// ── Atlas overview ────────────────────────────────────────────────────────────
// From the Atlas project overview. The CV bullets above (atlas.points) stay as the record of the engineering work.
export const atlasOverview = {
  intro:
    "Atlas is a fleet observability platform, built end to end and deployed to monitor a live server fleet. Lightweight Go agents report from each Linux server to a central Atlas server; history lands in TimescaleDB; a web dashboard shows each signed-in user only the servers and pages they are allowed to see.",
  problem:
    "The problem: knowing what is happening on every server — resources, containers, services, ports and scheduled jobs — in one place, without logging into each machine, and without giving every user access to everything.",
  schedule: [
    { every: "~15 s", what: "Resource measurements" },
    { every: "~60 s", what: "Fuller snapshot: processes, services, ports and scheduled jobs" },
  ],
  retention: [
    { what: "Detailed measurements", keep: "30 days" },
    { what: "Summarized history", keep: "Retained longer" },
  ],
  connectivity: [
    {
      name: "libp2p",
      kind: "Primary",
      text: "Each agent keeps a persistent identity that an Atlas administrator approves; the server checks it against the approved agents before accepting reports.",
    },
    {
      name: "HTTPS",
      kind: "Alternative",
      text: "The agent enrolls once with a one-time token, then connects with certificate-based authentication.",
    },
  ],
  lifecycle: [
    { step: "Install", text: "Install atlas-agent on the Linux server." },
    { step: "Enroll", text: "Connect over libp2p, or enroll over HTTPS with a one-time token." },
    { step: "Approve", text: "An administrator approves the agent identity, where applicable." },
    { step: "Verify", text: "Confirm the agent can reach the Atlas server." },
    { step: "Receive", text: "Measurements and snapshots arrive on schedule." },
    { step: "Inspect", text: "Signed-in users review the data through authorized dashboard pages." },
  ],
  observability: [
    "Node health and status",
    "CPU, memory, disk and network usage",
    "Docker containers and their logs",
    "System services and processes",
    "Open ports and scheduled jobs",
    "Disk and inode monitoring",
  ],
  attention: [
    "Stale or down servers",
    "Failed services",
    "Unhealthy containers",
    "Disk pressure",
    "Certificate expiry",
    "Zombie processes",
  ],
  roles: ["viewer", "operator", "admin", "superadmin"],
};

// ── DocsAI ────────────────────────────────────────────────────────────────────
// From the public repository github.com/p-shubh/DocsAi (read 2026-10-19). Only what the code
// implements is claimed; scaffolded parts (most file loaders, OCR, OpenAI) are listed as next.
export const docsai = {
  name: "DocsAI",
  subtitle: "A RAG application for chatting with your documents",
  kind: "Personal Project · in active development",
  repo: "https://github.com/p-shubh/DocsAi",
  intro:
    "Upload documents, then ask questions in plain language and get answers grounded in those documents — streamed as they are written, with the source chunks cited. A Go backend coordinates the work, a Python service does the AI, and a Next.js app is the interface.",
  ingest: [
    { title: "Upload", text: "The Next.js app sends the file to the Go API (Gin). The file goes to MinIO; its metadata goes to PostgreSQL." },
    { title: "Hand off", text: "The API answers straight away. A background goroutine calls ProcessDocument over gRPC with the bucket and object key — not the file itself." },
    { title: "Chunk", text: "The Python service downloads the file from MinIO, extracts the text and splits it into chunks of about 1,000 characters." },
    { title: "Embed", text: "Each chunk is embedded with Gemini or a local Ollama model, chosen by configuration." },
    { title: "Save", text: "The service calls back over gRPC (SaveProcessingResult); Go stores the chunks and their 1024-dimension vectors in pgvector and marks the document completed." },
  ],
  ask: [
    { title: "Embed the question", text: "Go asks the AI service for the question's embedding (EmbedQuery, gRPC)." },
    { title: "Retrieve", text: "A pgvector cosine-distance search returns the 5 closest chunks, across all documents or within one." },
    { title: "Cite", text: "Those chunks become source citations — document, page, section — sent to the browser first." },
    { title: "Generate", text: "GenerateAnswerStream asks the LLM (Gemini 2.5 Flash or Ollama) to answer from that context, streaming over gRPC." },
    { title: "Stream", text: "Go relays each piece to the browser as Server-Sent Events; the chat renders the answer as it arrives." },
  ],
  built: [
    "Document API: upload, list, rename, delete, view chunks, download the original",
    "Async processing with status tracking: uploaded → processing → completed / failed",
    "Typed gRPC contract between Go and Python, including a server-streaming RPC",
    "Provider abstraction for chat and embeddings: Gemini and Ollama",
    "pgvector similarity search with source citations",
    "Streaming chat UI in Next.js 16 / React 19",
    "Docker Compose stack: PostgreSQL 17 + pgvector, Redis, MinIO",
  ],
  next: [
    "Text extraction for PDF, Word, PowerPoint, CSV and images (OCR) — Excel works today",
    "Smarter chunking, hybrid search and re-ranking",
    "Authentication, workspaces and role-based access",
  ],
  stack: ["Golang", "Gin", "GORM", "Python", "gRPC", "Next.js", "TypeScript", "PostgreSQL + pgvector", "MinIO", "Redis", "Gemini", "Ollama", "Docker Compose"],
};
