# Maple Intel Website

The production website for Maple Leaf Intelligence, an operational analytics
and decision-support consultancy for NHS and health-service teams.

The current production version is a public, single-page Next.js site. It
explains the company through the operational questions it helps services answer
and links to concise A4 case-study PDFs. The original technical portfolio
remains preserved under `public/portfolio-original/` as source material, but is
not part of the public site journey.

## Current public structure

- `/` - company landing page
- `/downloads/clinical-queue-intelligence-case-study.pdf`
- `/downloads/telephony-demand-workforce-case-study.pdf`
- `/downloads/waiting-time-kpi-case-study.pdf`
- `/rate-calculator.html` - preserved standalone public utility
- `/simkltv/` - preserved standalone TV application

## Current strategic principle

The website should guide potential clients through five beliefs:

1. Maple Intel understands the operational problem I have.
2. This is a credible specialist consultancy.
3. The case studies show a recognisable organisational problem and a credible
   operational response.
4. Maple Intel could deliver this project or assignment.
5. I’d like to discuss it.

Technical recruiters are not a target audience for the public website.
Technical detail remains available in the preserved source material where it
is useful for future content work.

The primary market focus is ambulance services and other operational NHS environments. Wider health and customer-service operations are adjacent markets connected by the same underlying need: making complex logistical and operational data useful for analysis, visualisation and performance reporting.

The company proposition and the operational usefulness of the work are the
focus. Tools and technical methods are supporting detail.

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

See `docs/roadmap.md` for the planned separation of Maple Leaf, Energy, Car,
Rate Calculator and TV into independent applications.

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
