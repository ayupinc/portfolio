# Maple Intel Website

The production website for Maple Leaf Intelligence, focused on intelligent
reporting for NHS operations.

The current production version is a public, single-page Next.js site. It
explains the company through the operational questions it helps services answer
and links to concise, responsive case-study pages. The original technical portfolio
remains preserved under `public/portfolio-original/` as source material, but is
not part of the public site journey.

## Current public structure

- `/` - company landing page
- `/case-studies/clinical-queue-intelligence/`
- `/case-studies/telephony-demand-workforce/`
- `/case-studies/waiting-time-kpi/`
- `/rate-calculator.html` - preserved standalone public utility
- `/simkltv/` - preserved standalone TV application

## Current strategic principle

The website should give NHS operational readers a concise account of:

1. the reporting work Maple Leaf undertakes;
2. the operational contexts in which it works;
3. examples of reporting requirements and work completed;
4. how to make an enquiry.

Technical recruiters are not a target audience for the public website.
Technical detail remains available in the preserved source material where it
is useful for future content work.

The primary focus is NHS operations, including ambulance services and other
settings concerned with demand, flow, capacity, workforce and performance.

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
