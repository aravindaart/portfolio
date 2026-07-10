import type { Profile } from "@/lib/types";

export const profile: Profile = {
  identity: {
    name: "Aravindhan Mohan",
    title: "Senior Frontend Lead · Forward Deployed Engineer",
    tagline:
      "React · Frontend Architecture · Performance Optimization · Mentorship",
    location: "Singapore",
    thesis: "Forward-deployed before it had a name.",
    summary: [
      "Client-embedded frontend/full-stack engineer with 11+ years taking systems from prototype to production across enterprise, retail, and banking environments.",
      "Currently lead frontend engineering for Web Service Management at UOB Bank — owning frontend architecture, production stability, and performance for TypeScript/React applications serving thousands of daily active users across retail and wholesale banking.",
      "Specializes in React-based frontend platforms, performance engineering, production reliability, and technical mentorship in high-scale, regulated environments.",
    ],
  },

  contact: {
    email: "sayhi@aravindaart.com",
    github: "https://github.com/aravindaart",
    linkedin: "https://www.linkedin.com/in/aravindaart/",
  },

  chapters: [
    {
      id: "tcs",
      index: 1,
      company: "Tata Consultancy Services",
      role: "Software Engineer",
      period: "Jun 2015 – Jul 2020",
      location: "Chennai, India",
      kicker: "Chapter 01 — The Foundation",
      headline: "Deployed before it was a job title.",
      narrative: [
        "Led the R&D and demo team presenting a POS solution to international clients — customizing the product to each client's workflow and making live feature changes during demos, based on real-time client feedback.",
        "That is the Forward Deployed Engineer job description, eight years before the industry coined the title: sit with the client, understand the workflow, ship the change while they watch.",
      ],
      highlights: [
        "Presented and demoed POS solutions to international clients across desktop and mobile as a technical advisor supporting pre-sales and product adoption",
        "Automated deployments with one-click scripts, cutting client rollout and implementation time by ~80%",
        "Led migration of the POS application from Angular to React, optimized for React Native integration — reducing maintenance headcount by ~30%",
        "Built a certification platform for skilled laborers in India, cutting human evaluator effort by 90%",
        "Trained 500+ engineers per batch, every 6 months for 4 years, on HTML, CSS, JavaScript, and React",
      ],
    },
    {
      id: "walmart",
      index: 2,
      company: "Walmart Global Tech",
      role: "SDE III",
      period: "Jul 2020 – Jun 2022",
      location: "Chennai, India",
      kicker: "Chapter 02 — Full-Stack, Full Ownership",
      headline: "Impact you can put a number on.",
      narrative: [
        "Owned complete systems end-to-end — Node.js backend APIs and React frontends — delivering the full pipeline from data layer to UI with a deep understanding of the operations teams using them.",
        "During COVID, spotted that an enhanced employee insurance program could be delivered by extending Walmart's existing configurable forms platform instead of building a new app — integrated the insurer's APIs, auto-populated employee data from LDAP, and turned a manual multi-step process into a few-click experience. Recognizing reuse is a systems-thinking instinct, not a feature request.",
      ],
      highlights: [
        "Delivered a React + Node.js bulk-upload architecture for compliance workflows — 100% ops-team adoption",
        "Led cloud and database migration (Azure → WCNP, Azure MySQL → MSSQL)",
        "Built a real-time operational dashboard used by operations teams and leadership",
        "Created standardized frontend boilerplates and reusable components adopted across teams",
      ],
      metrics: [
        { value: 80, suffix: "%", label: "compliance submission time reduced" },
        { value: 30, suffix: "%", label: "application infrastructure cost cut" },
        { value: 50, suffix: "%", label: "operations time saved" },
      ],
    },
    {
      id: "uob",
      index: 3,
      company: "UOB Bank",
      role: "Senior Frontend Lead",
      period: "Jun 2022 – Present",
      location: "Singapore",
      kicker: "Chapter 03 — Embedded in the Fire",
      headline: "Production-critical, zero-downtime, regulated.",
      narrative: [
        "Lead frontend engineering for Web Service Management platforms supporting retail and wholesale banking — thousands of daily active users, zero-downtime release requirements, and a regulator watching.",
        "Drove a configurable multi-market platform transformation for Business Banking onboarding: replaced country-specific implementations with one scalable, configuration-driven solution — working end-to-end from discovery workshops through API design, pilot rollout, and production readiness, as the bridge between business stakeholders and multiple engineering teams.",
      ],
      highlights: [
        "Own frontend architecture and production stability for TypeScript/React platforms serving thousands of daily users",
        "Led end-to-end response to a production OTP-abuse incident — detection, mitigation, and long-term hardening across four teams",
        "Partner with DevOps and infrastructure on observability, CI/CD, and zero-downtime release reliability",
        "Drive root cause analysis for frontend production incidents and preventive engineering",
        "Mentor engineers on advanced React patterns, performance tuning, and scalable UI architecture",
      ],
      timeline: [
        {
          phase: "T+0 · Detect",
          title: "Bot-driven SMS/OTP abuse identified",
          detail:
            "Spotted anomalous OTP traffic driving SMS cost and onboarding risk; confirmed bot-driven abuse targeting international destinations.",
        },
        {
          phase: "T+1 · Assess",
          title: "Impact quantified across teams",
          detail:
            "Worked across business, infrastructure, backend, and operations to size the cost exposure and customer impact.",
        },
        {
          phase: "T+2 · Mitigate",
          title: "Short-term containment",
          detail:
            "Coordinated with the SMS provider to block targeted international destinations, stopping the bleed within hours.",
        },
        {
          phase: "T+3 · Harden",
          title: "Long-term fixes shipped",
          detail:
            "Drove IP tracking and rate limiting, OTP retry limits, stronger session validation, and CAPTCHA into production.",
        },
        {
          phase: "T+4 · Monitor",
          title: "Post-deployment verification",
          detail:
            "Coordinated rollout and monitored post-deployment results until abuse traffic flatlined.",
        },
      ],
    },
  ],

  fdeCompetencies: [
    {
      competency: "Client-facing engineering",
      evidence:
        "Live demos to international clients with real-time feature changes; pre-sales technical advisor",
      chapterId: "tcs",
    },
    {
      competency: "Rapid prototyping to production",
      evidence:
        "One-click deployment automation (~80% faster rollouts); prototype-to-production ownership",
      chapterId: "tcs",
    },
    {
      competency: "Full-stack systems ownership",
      evidence:
        "Node.js + React end-to-end delivery; cloud/database migration cutting costs ~30%",
      chapterId: "walmart",
    },
    {
      competency: "Systems thinking & platform reuse",
      evidence:
        "Extended an internal forms platform to solve COVID insurance enrollment instead of building new",
      chapterId: "walmart",
    },
    {
      competency: "Production incident command",
      evidence:
        "OTP-abuse incident: detection → mitigation → hardening across four teams",
      chapterId: "uob",
    },
    {
      competency: "Stakeholder bridging",
      evidence:
        "Multi-market platform transformation from discovery workshops to production readiness",
      chapterId: "uob",
    },
  ],

  skills: [
    {
      group: "Frontend",
      items: [
        "React",
        "TypeScript",
        "React Native",
        "Frontend Architecture",
        "Performance Optimization",
        "Accessibility",
      ],
    },
    {
      group: "Full-Stack & Infra",
      items: [
        "Node.js",
        "REST API Design",
        "CI/CD",
        "Observability",
        "Cloud Migration (Azure, WCNP)",
        "MySQL / MSSQL",
      ],
    },
    {
      group: "AI & Tooling",
      items: [
        "Model Context Protocol (MCP)",
        "Prompt Engineering",
        "Vertex AI",
        "AI-assisted Engineering",
      ],
    },
    {
      group: "Leadership",
      items: [
        "Technical Mentorship",
        "Incident Response",
        "Stakeholder Management",
        "Training at Scale (500+/batch)",
      ],
    },
  ],

  certifications: [
    {
      name: "AI Engineer for Developers Associate",
      issuer: "DataCamp",
      year: "2026",
    },
    { name: "Google AI Professional Certificate", issuer: "Google", year: "2026" },
    {
      name: "AI Fluency: Framework & Foundations",
      issuer: "Anthropic",
      year: "2026",
    },
    {
      name: "Model Context Protocol (MCP) Mastery",
      issuer: "Fractal Analytics",
      year: "2025",
    },
    {
      name: "MCP: Hands-On with Agentic AI",
      issuer: "LinkedIn Learning",
      year: "2025",
    },
    {
      name: "Prompt Design in Vertex AI",
      issuer: "Google",
      year: "2024",
    },
    { name: "Google AI Essentials", issuer: "Google", year: "2024" },
  ],

  lookingFor: [
    "Forward Deployed Engineer roles",
    "Open to relocation outside Singapore and remote anywhere",
    "$150K–$300K base + equity",
    "Prefers face-to-face client work; comfortable with travel",
  ],
};
