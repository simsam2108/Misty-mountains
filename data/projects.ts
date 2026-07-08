export type CaseImage = {
  src: string;
  width: number; // native px — feeds next/image so ratios stay exact
  height: number;
  caption?: string;
  // how the image sits in the reading flow:
  //  inline — grouped 2–3 across in a grid beside/after the copy (phone screens)
  //  phone  — a single small phone screen, centered, not stretched
  //  wide   — a portrait/composite shot, centered at a medium width
  //  full   — a landscape UI shot spanning the full image column
  layout?: "inline" | "phone" | "wide" | "full";
};

export type CaseMetric = { value: string; label: string };

export type CaseSection = {
  heading: string;
  body: string;
  points?: string[]; // scannable supporting points
  images?: CaseImage[];
  callout?: { label?: string; body: string }; // design-decision aside
  metrics?: CaseMetric[]; // stat band (used in Outcome)
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
  hero: HeroImage; // the home-page stage screenshot (device mockup, native ratio)
  overlayHero?: HeroImage; // wider hero shown at the top of the case-study overlay
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
    overlayHero: { src: "/projects/installer/hero-3-screens.png", width: 7009, height: 4152 },
    images: ["/projects/installer/hero-3-screens.png"],
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
        heading: "Context",
        body:
          "ChargePoint runs one of the world's largest commercial EV charging networks. For its first decade it ran a direct-sales model — a tightly managed pipeline where every station activation was choreographed by an in-house team. Four years ago it shifted to a Value-Added Reseller model, and today roughly 90% of sales flow through partners like EATON. The activation process never caught up.\n\nThe result was two people living in two separate worlds. The electrician shows up on-site, mounts the hardware, scans serial numbers, confirms connectivity, and leaves — everything through the Installer App. The org admin never touches hardware; they manage policies, pricing, and activation afterward in Polaris Suite. Before this work, those two worlds didn't talk, and a Customer Experience agent had to bridge every single handoff by hand.",
      },
      {
        heading: "The problem",
        body:
          "Because the field app and the platform never shared a clean data handoff, every activation stalled at the seam between them. What should have been a premium, self-serve experience became recurring operational overhead.",
        points: [
          "Stations arrived on the platform with no owner attached — nothing linked a deployed device to the organization that bought it.",
          "A CX agent had to step in on every activation to manually identify the owner and connect the stations.",
          "Installing 10 stations at one location meant running the same standalone flow 10 times.",
        ],
      },
      {
        heading: "Iteration 1 — MVP",
        body:
          "I started by mapping the data handoff between field and platform end to end. The first challenge wasn't screens — it was flow: at what point in the physical workflow is org identity even knowable? Mapping the deployment surfaced three gaps the CX agent had been bridging, and the first release closed them.",
        points: [
          "Sites concept — a physical address becomes the unit of work, so stations installed together stay together.",
          "CMS declaration upfront — ChargePoint cloud or a third-party system (be.ENERGISED, Studio); the two paths diverge immediately.",
          "Org pre-assignment — org identity pushed from Salesforce and shown on the installer's summary as a read-only signal.",
          "Email-triggered activation — a regional link (US/EU/CA, Prod/QA) sent to the org admin the moment the job is marked complete.",
        ],
        callout: {
          label: "Design decision · CMS selection screen",
          body:
            "ChargePoint hardware can be registered with a third-party CMS. If the activation email fires for a non-ChargePoint-managed station, the admin lands in Polaris with a station that can never be activated there. So I added a CMS selection step that forks the flow before any data is sent.\n\nThe trade-off: it costs the installer one redundant tap in the 90%+ ChargePoint-managed case. I considered auto-detecting CMS from the hardware scan and rejected it — API coverage was incomplete, and non-ChargePoint hardware could still be provisioned in ChargePoint's cloud, so a scan couldn't reliably tell the two apart. One deliberate tap was cheaper than the most expensive failure in the old flow: a misrouted activation email.",
        },
        images: [
          {
            src: "/projects/installer/create-site.png",
            width: 375,
            height: 1054,
            layout: "inline",
            caption: "Create a site — grouping stations by location up front.",
          },
          {
            src: "/projects/installer/station-config.png",
            width: 750,
            height: 2122,
            layout: "inline",
            caption: "Device configuration captured in the field, step by step.",
          },
          {
            src: "/projects/installer/email-activation.png",
            width: 2984,
            height: 4744,
            layout: "wide",
            caption:
              "Email-triggered activation — the owner receives a regional link and station table that deep-links into Polaris Suite.",
          },
        ],
      },
      {
        heading: "Stakeholder review — what the MVP got wrong",
        body: "Taking the MVP to review surfaced four failures that reshaped the next iteration:",
        points: [
          'Silent pre-assignment failure — when the API org link broke, there was no error feedback. The installer saw "Org ✓" while the admin received nothing.',
          "No asset visibility — the admin had no way to confirm from Polaris what had actually been installed.",
          "Per-station email didn't scale — a 30-station site fired 30 separate emails. Still manual, just a different shape.",
          "Meaningless default site name — an auto-generated string like 450haciendacalifornia meant nothing to the admin; it needed a clear naming convention or a mandatory rename.",
        ],
      },
      {
        heading: "Iteration 2 — Refinement",
        body:
          "Iteration 1 exposed two problems: a per-station email model that broke at scale, and an org pre-assignment flow that leaned on Salesforce data missing in about 30% of VAR transactions. Iteration 2 fixed both — and removing the dependency entirely turned out to be cleaner than improving the error state around it.",
        points: [
          'Org-agnostic completion — the install finishes cleanly regardless of Salesforce data. The station queues in Polaris as "Ready for Activation" immediately, and the admin gets a regional link to attach it to their org afterward.',
          "Job Summary screen — all installed devices grouped into one submit event. One activation per site, not per station.",
          "Add more stations + cluster devices — after commissioning the first device, installers can loop back and add each subsequent station to the same job before submitting.",
          "Regional self-activation links — sent to admins once the job is complete.",
        ],
        images: [
          {
            src: "/projects/installer/skip-org.png",
            width: 662,
            height: 1474,
            layout: "inline",
            caption: "Org-agnostic flow — the installer can skip Salesforce-dependent org data.",
          },
          {
            src: "/projects/installer/summary-one-station.png",
            width: 375,
            height: 1684,
            layout: "inline",
            caption: "Setup complete — full system detail sent back to ChargePoint.",
          },
          {
            src: "/projects/installer/summary-cluster.png",
            width: 750,
            height: 2886,
            layout: "inline",
            caption: "Job Summary — multiple stations rolled into one submission.",
          },
          {
            src: "/projects/installer/loop-or-submit.png",
            width: 2668,
            height: 3309,
            layout: "wide",
            caption: "Loop back to add another station, or complete the job.",
          },
          {
            src: "/projects/installer/summary-drawer.png",
            width: 1858,
            height: 2886,
            layout: "wide",
            caption: "Cluster summary with a node-detail drawer for multi-port stations.",
          },
          {
            src: "/projects/installer/station-management.png",
            width: 4222,
            height: 2212,
            layout: "full",
            caption:
              "Polaris Suite — stations arrive queued for activation at the org level, with a manual add path as a fallback.",
          },
        ],
      },
      {
        heading: "Outcome",
        body:
          "The handoff between field deployment and platform management became a single, unified data flow: a station commissioned in the field now shows up in Polaris ready to activate, with no CX involved. Enterprise accounts get their org pre-assigned via API; the VAR channel — 90% of sales — gets a regional activation link by email. Both routes land in the same place, on the admin's own timeline.\n\nWhite-glove activation stays available — now as a chargeable premium service rather than the default. That shifts agent cost from operational overhead to a revenue line.",
        metrics: [
          { value: "0", label: "CX touches on the self-serve path" },
          { value: "1", label: "activation event per site & org, not per station" },
          { value: "2", label: "clean activation routes: enterprise pre-assign + VAR hyperlink" },
        ],
        images: [
          {
            src: "/projects/installer/success.png",
            width: 375,
            height: 667,
            layout: "phone",
            caption: "Installation confirmed in the field.",
          },
        ],
      },
      {
        heading: "What two iterations taught me",
        body:
          "Both iterations came down to the same move: letting go of an assumption I'd been designing around. The first version assumed org identity had to be resolved at the moment of install — and that one belief drove the whole flow into fragility. Once I stopped defending it, the design got simpler and sturdier. The pattern that mattered wasn't fixing screens; it was finding the locked assumption underneath them.",
        points: [
          "Design for the data you have, not the data you need. Pre-assignment assumed clean Salesforce data at install time. The field didn't have it. Designing from what was reliably present — the station MAC, the site address, the installer's job record — produced a flow that survived contact with reality.",
          "The handoff point is the design. This was never about screens; it was about who holds responsibility at each point in a multi-party workflow. Designing the installer-to-admin handoff explicitly, instead of routing it through a CX agent, was the single decision that made self-serve viable.",
          'A PRD without engineering input isn\'t a requirement — it\'s an assumption. The "sites" grouping sat in the PRD from day one and shaped two iterations before engineering review found it wasn\'t buildable as written. Earlier alignment between PM, dev, and design on what\'s actually shippable would have caught it before it set the direction.',
          "Two users in one flow means two jobs to honour. The installer's job is physical; the admin's is operational. Demanding org identity at install time coupled them and violated both. Decoupling honoured both.",
        ],
        callout: {
          label: "What I chose not to do",
          body:
            "I didn't try to rescue the broken org pre-assignment with better error states. The cleaner call was to remove the dependency entirely and let the install complete without it. Designing the absence was more robust than designing the recovery.",
        },
      },
      {
        heading: "The bigger picture",
        body:
          "I didn't just design a field tool — I designed what it feeds. The Installer App is the upstream half of a two-part system; the activation flow in Polaris Suite only works because this app captures the right data, in the right shape, at the right moment. The decisions that mattered most never show up in the UI — decoupling org identity from the install event, making the job record the unit of work instead of the individual station, letting the install complete cleanly even when Salesforce data wasn't there. That seam, not the app, is what I was designing.",
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
