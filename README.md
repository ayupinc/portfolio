# Maple Intel Website

Strategy, content and—after the design is agreed—the production website for Maple Intel, Stephen Clinton’s operational analytics, analytics engineering and Power BI consultancy.

The first production version is implemented with Next-compatible React pages built through Vinext for Cloudflare Workers/Sites. The original static portfolio remains preserved under `public/portfolio-original/`, while its strongest material has been reorganised into the new client-focused case studies.

## Current strategic principle

The website should guide potential clients through five beliefs:

1. Maple Intel understands the operational problem I have.
2. This is a credible specialist consultancy.
3. The case studies demonstrate genuine technical and delivery depth.
4. Maple Intel could deliver this project or assignment.
5. I’d like to discuss it.

Recruiters and other intermediaries are a secondary audience. The same evidence should allow them to recognise that Maple Intel can undertake suitable contract, interim or embedded assignments without making the site resemble a job-seeking portfolio.

The primary market focus is ambulance services and other operational NHS environments. Wider health and customer-service operations are adjacent markets connected by the same underlying need: making complex logistical and operational data useful for analysis, visualisation and performance reporting.

The technical work—Power BI reports, data models, SQL/data-flow diagrams and workflow illustrations—will be the visual focus.

## Project structure

```text
docs/
  brand.md
  content-plan.md
  case-study-template.md
  style-guide.md
  roadmap.md
src/
public/
  images/
  icons/
  downloads/
assets/
  original-screenshots/
  diagrams/
```

See `docs/roadmap.md` for the decision gates that must be completed before implementation.

## Preserved resources

The original resources remain available separately:

- `/portfolio-original/index.html` — original Power BI and analytics engineering portfolio
- `/rate-calculator.html` — contract rate calculator
- `/non-nhs/` — non-NHS pay calculator

## Local validation

```text
npm run dev
npm test
npm run deploy:static
```

`npm run deploy:static` generates the static site and copies its routes into `public/`. The exported files are committed there because `public/` remains the deployment directory used by the existing Cloudflare site connected to `mapleintel.uk`.

---
