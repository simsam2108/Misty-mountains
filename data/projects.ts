export type CaseSection = {
  heading: string;
  body: string;
};

export type HeroImage = {
  src: string;
  width: number; // native px — feeds next/image so nothing shifts or clips
  height: number;
};

export type Project = {
  slug: string;
  index: string; // "(01)"
  title: string;
  role: string;
  discipline: string;
  org: string;
  year: string;
  inProgress?: boolean;
  hero: HeroImage; // the stage screenshot (device mockup, native ratio)
  images: string[]; // first is the hero/panel image
  subtitle: string;
  meta: { label: string; value: string }[];
  sections: CaseSection[];
};

export const projects: Project[] = [
  {
    slug: "installer",
    index: "(01)",
    title: "Installer App",
    role: "Lead UX/UI Designer",
    discipline: "Native Mobile App",
    org: "ChargePoint",
    year: "2025",
    hero: { src: "/projects/installer-hero.png", width: 2117, height: 4328 },
    images: ["/projects/installer.png"],
    subtitle:
      "Connecting the field to the platform — an end-to-end self-serve installation native mobile app.",
    meta: [
      { label: "Role", value: "Lead UX/UI Designer" },
      { label: "Duration", value: "6 months · 2 iterations" },
      { label: "Domain", value: "B2B SaaS · Native Mobile" },
      { label: "Client", value: "ChargePoint" },
    ],
    sections: [
      {
        heading: "Context & Problem",
        body: "ChargePoint moved from direct sales to a Value-Added Reseller model, with 90% of sales flowing through partners like EATON. The activation workflow never adapted: electricians deployed hardware in the Installer App while org admins managed everything post-install in Polaris Suite — two systems that didn't talk. Every activation required manual intervention from a Customer Experience agent to link stations to their owners.",
      },
      {
        heading: "Iteration 1 — MVP",
        body: "Mapped the data handoff between field and platform and found three critical gaps. Introduced site-level grouping, upfront CMS declaration, org pre-assignment from Salesforce, and email-triggered activation, plus a gatekeeping CMS selection screen to prevent misrouted activation emails.",
      },
      {
        heading: "Iteration 2 — Refinement",
        body: "Removed the fragile Salesforce dependency (missing in ~30% of VAR transactions). Added a Job Summary screen consolidating multiple stations into a single submission, let installers loop back to cluster more devices, and moved to org-agnostic completion — installation succeeds regardless of pre-assignment, and admins receive regional links to self-activate.",
      },
      {
        heading: "Outcome",
        body: "Zero CX touches on the self-serve path, with two clean activation routes (enterprise API + VAR email). The handoff between field deployment and platform management became a unified data flow, turning white-glove service from operational overhead into a premium offering.",
      },
    ],
  },
  {
    slug: "activation",
    index: "(02)",
    title: "Station Activation Flow",
    role: "Lead UX/UI Designer",
    discipline: "Enterprise Workflow",
    org: "ChargePoint",
    year: "2025",
    hero: { src: "/projects/activation-hero.png", width: 5701, height: 3323 },
    images: ["/projects/activation.png"],
    subtitle:
      "Self-serve admin design that replaced expert-only setup with workflows anyone on the team can run.",
    meta: [
      { label: "Role", value: "Lead UX/UI Designer" },
      { label: "Duration", value: "1 year · 4 iterations" },
      { label: "Domain", value: "B2B Enterprise SaaS" },
      { label: "Client", value: "ChargePoint" },
    ],
    sections: [
      {
        heading: "Context & Problem",
        body: "ChargePoint runs the world's largest EV charging network — 1.3M+ ports. Every activation once required a Deployment Specialist, creating bottlenecks across three legacy platforms (NOS, be.ENERGISED, Viriciti) with fragmented logic, no bulk workflows, and disconnected field tools. The goal: cut activation time from 3–5 days to same-day while eliminating ~40% of support tickets.",
      },
      {
        heading: "Iterations 1–2",
        body: "Started with a three-step wizard for single-station activation with sensible defaults, compressing the specialist workflow into self-serve. Then added bulk activation via copy/configuration, advanced token selection, and recovery dialogs for common failure states.",
      },
      {
        heading: "Iterations 3–4",
        body: "Ported the flow to the NOS ecosystem and made pre-activation blockers (uncommissioned hardware, missing gateways, GPS pending) first-class design states caught early. The current iteration adds cluster-hierarchy visualization for multi-port stations.",
      },
      {
        heading: "Outcome",
        body: "Design defects resolved pre-launch through QA ownership on dev builds. Same-day self-serve activation at scale — as one internal review put it, \"the DC blocker banner alone saves us a support ticket every other day.\"",
      },
    ],
  },
  {
    slug: "designgrid",
    index: "(03)",
    title: "DesignGrid",
    role: "UX/UI Designer",
    discipline: "Design Systems",
    org: "The Mobility House",
    year: "2024",
    hero: { src: "/projects/designgrid-hero.png", width: 5765, height: 3340 },
    images: ["/projects/designgrid.png"],
    subtitle: "The infrastructure behind a three-product enterprise SaaS suite.",
    meta: [
      { label: "Role", value: "UX/UI Designer" },
      { label: "Duration", value: "9 months" },
      { label: "Domain", value: "B2B Enterprise SaaS" },
      { label: "Client", value: "The Mobility House" },
    ],
    sections: [
      {
        heading: "Context & Problem",
        body: "The product ecosystem was fragmented — each application spoke its own interface language, with inconsistent components and competing definitions of basic UI elements. Teams rebuilt identical components across three codebases, slowing engineering velocity and making new products nearly impossible to scale.",
      },
      {
        heading: "Approach",
        body: "Adopted Brad Frost's Atomic Design hierarchy to enforce consistency through structure, on an Ant Design foundation customized for brand alignment. Three pillars: accessibility built in from the start (WCAG before shipping), collaborative development with engineering, and a dual source of truth — Figma for decisions, code for implementation, validated with Chromatic.",
      },
      {
        heading: "System & Adoption",
        body: "Structured the system from atoms to templates and treated adoption as the real work — pairing with product teams, demonstrating component rationale, and treating edge cases as system insights rather than exceptions. Chromatic visual regression testing held quality across viewports and states.",
      },
      {
        heading: "Outcome",
        body: "An 80% reduction in development time for new products and features, recurring design/engineering duplication eliminated, and a coherent experience across the entire suite — infrastructure-level design that changed how teams make decisions.",
      },
    ],
  },
  {
    slug: "cocreate",
    index: "(04)",
    title: "CoCreate",
    role: "Product Designer",
    discipline: "Product Design",
    org: "In Progress",
    year: "2026",
    inProgress: true,
    hero: { src: "/projects/cocreate-hero.png", width: 2117, height: 4452 },
    images: ["/projects/cocreate.png"],
    subtitle: "A collaborative design initiative — case study in progress.",
    meta: [
      { label: "Role", value: "Product Designer" },
      { label: "Status", value: "In Progress" },
      { label: "Domain", value: "Product Design" },
    ],
    sections: [
      {
        heading: "In Progress",
        body: "This case study is being written. CoCreate explores collaborative, multiplayer workflows for enterprise teams — check back soon for the full story, or reach out and I'll walk you through it.",
      },
    ],
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
