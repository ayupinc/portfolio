# Maple Intel Website Roadmap

## Working method

The project will move through explicit decision gates. Technology selection follows strategy, content and design requirements; it does not lead them.

Codex will build the production site end to end, prioritising delivery speed and quality rather than using implementation as a teaching exercise. Architectural choices and routine maintenance will still be documented so that the site is not unnecessarily dependent on its original build process.

## Phase 0 — Preserve and inventory

Status: in progress

Objectives:

- preserve the existing static portfolio as source material;
- inventory pages, screenshots, diagrams and code samples;
- identify confidential or weak assets;
- distinguish reusable content from legacy presentation.

Outputs:

- content inventory;
- asset and confidentiality audit;
- list of candidate case studies.

Exit decision:

- agree which existing materials are authoritative enough to inform the new site.

## Phase 1 — Strategy and information architecture

Status: in progress

Objectives:

- confirm the NHS and ambulance client focus, adjacent markets and secondary engagement routes;
- confirm positioning;
- validate the five-stage user journey;
- agree the first-release page structure;
- define conversion goals and credibility signals.

Outputs:

- `brand.md`;
- `content-plan.md`;
- approved site map;
- audience journey and success criteria.

Exit decision:

- approve which operational problems within the agreed market focus the first release should prioritise.

No implementation code should be written before this decision.

## Phase 2 — Content and evidence

Objectives:

- develop the five featured case-study families selected from the existing portfolio;
- write case studies using the shared template;
- map expertise claims to evidence;
- draft Home, Expertise, About and Contact content;
- audit screenshots, diagrams, code and downloadable assets;
- anonymise sensitive material.

Outputs:

- page-level content briefs;
- launch-ready copy;
- approved evidence assets;
- gap list for diagrams or new screenshots.

Exit decision:

- confirm that the content can establish relevance, credibility, evidence and intent without relying on visual polish.

## Phase 3 — Visual system and page design

Objectives:

- review any existing Maple Intel identity assets;
- establish typography, palette, spacing and image treatment;
- create content-led wireframes;
- design representative Home, Work and case-study pages;
- test desktop and mobile reading;
- define accessibility requirements.

Outputs:

- approved visual direction;
- page wireframes;
- core design tokens;
- component inventory;
- representative high-fidelity designs.

Exit decision:

- confirm that technical work is the visual focus and that both scanning and deep-reading journeys are clear.

## Phase 4 — Technical requirements and stack selection

Objectives:

- translate approved content and design into requirements;
- assess content update frequency and authoring needs;
- decide whether a static approach, content collections or a CMS is justified;
- assess image handling, forms, analytics, SEO and Cloudflare Pages deployment;
- choose the smallest maintainable stack that satisfies the requirements.

Evaluation criteria:

- maintainability by Stephen;
- transparent project structure;
- accessibility;
- content and image performance;
- case-study authoring experience;
- minimal operational complexity;
- compatibility with Cloudflare Pages;
- testing and deployment workflow;
- low dependency burden.

Potential technologies should not be shortlisted until this phase. Astro, Next.js or plain HTML/CSS/JavaScript are possibilities, not prior commitments.

Exit decision:

- record the selected architecture and the reasons for choosing it.

## Phase 5 — Implementation

Objectives:

- create the approved project architecture;
- implement the design system and page templates;
- migrate approved content;
- optimise images and technical assets;
- add accessible navigation and interactions;
- implement metadata, structured data, sitemap and contact route;
- add focused automated checks.

Outputs:

- maintainable production source;
- documented content workflow;
- test coverage proportionate to the site;
- deployable Cloudflare Pages build.

## Phase 6 — Quality assurance and launch

Objectives:

- verify content and links;
- test keyboard and assistive-technology fundamentals;
- test responsive layouts on representative devices;
- check performance and image quality;
- verify metadata, social previews and search indexing controls;
- complete confidentiality review;
- deploy and verify the production domain.

Outputs:

- launch checklist;
- production deployment;
- rollback and update notes.

## Phase 7 — Measure and improve

Objectives:

- review which case studies attract qualified attention;
- inspect movement from evidence to contact;
- collect client feedback and relevant feedback from engagement intermediaries;
- refine weak propositions or navigation;
- add new work selectively.

Avoid expanding the site solely to increase page count. New content should strengthen a known audience need, search need or evidence gap.

## Immediate decisions

The next strategic decisions, in order, are:

1. Confirm the ordering of the five proposed featured case-study families drawn from the existing portfolio.
2. Which operational problems should receive the greatest prominence within the agreed market focus?
3. What outcomes and operational context can be stated publicly?
4. What existing Maple Intel brand assets or constraints must be retained?

## Planned platform separation

Status: Energy and Car are split (2026-08-06) — ahead of the sequencing
originally planned here, at explicit request. `energy-dashboard` and
`car-dashboard` are now independent repositories
(`ayupinc/energy-dashboard`, `ayupinc/car-dashboard`), each with its own
Cloudflare Worker, D1 database and Pages project. The `vehicles` and
`vehicle_status_snapshots` data was migrated across and verified before the
source tables were dropped. See `car-dashboard/docs/decisions.md` #001 and
`energy-dashboard/docs/decisions.md` #005 for the detail.

Not yet done: folding Maple Leaf, Rate Calculator and TV into the single
`maple-leaf-platform/` monorepo layout below, and giving Energy/Car their
own Cloudflare Access applications (car-dashboard's API is not yet behind
Access at all; energy-dashboard's existing Access setup currently redirects
even the Pages-to-Worker service call and needs checking in the dashboard).

The products should remain separate applications with a shared backend and
small shared packages:

    maple-leaf-platform/
      apps/
        maple-leaf/          # public company landing page and case studies
        energy/              # private responsive desktop/mobile dashboard
        car/                 # private mobile-first application
        rate-calculator/     # public client-side utility
        tv/                  # publicly reachable Simkl-powered TV application
      workers/
        api/
          energy/
          car/
          simkl/
      packages/
        shared-ui/
        shared-types/

Deployment and access principles:

- Maple Leaf and the Rate Calculator remain public.
- Energy and Car use separate Cloudflare Pages projects and separate
  Cloudflare Access applications and policies.
- Sensitive Energy and Car API routes are protected independently.
- TV can remain publicly reachable, while Simkl OAuth and tokens stay behind
  the Worker.
- Each Cloudflare Pages project uses its own application subdirectory and
  build settings.
- Complete the website first, then perform one controlled repository
  reorganisation and update the Cloudflare deployments together.
