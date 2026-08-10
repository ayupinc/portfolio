# Maple Intel Website

The production website for Maple Leaf Intelligence, focused on intelligent
reporting for NHS operations.

The current production version is a public, single-page Next.js site. It
explains the company through the operational questions it helps services answer
and links to concise, responsive case-study pages.

The original technical portfolio, the rate calculator, the salary calculator
and the TV application were split out of this repo on 2026-08-10 into their
own independent repos/deployments (`portfolio-archive`, `rate-calculator`,
`salary-calculator`, `SimklApp`). This repo now only contains the mapleintel.uk
company site itself. See "Split-out applications" below.

## Current public structure

- `/` - company landing page
- `/case-studies/clinical-queue-intelligence/`
- `/case-studies/telephony-demand-workforce/`
- `/case-studies/waiting-time-kpi/`

## Split-out applications

These used to live under `public/` in this repo (served as subpaths of
mapleintel.uk) and are now separate, independently deployable projects.
None of them were linked from this site's navigation, so nothing here
changed as a result of the split — but each will need its own Cloudflare
Pages project and domain/subdomain (e.g. `rate.mapleintel.uk`) to go live
again where it left off:

- `../portfolio-archive/` — original Power BI and analytics-engineering portfolio (was `/portfolio-original/`, plus a duplicate loose copy at `public/` root that has been deleted rather than carried over)
- `../rate-calculator/` — contract day-rate calculator (was `/rate/`)
- `../salary-calculator/` — NHS/non-NHS take-home pay calculator (was `/salary/`)
- `../SimklApp/web/` — TV application (was `/simkltv/`); note its `next.config.ts` still has `basePath: "/simkltv"` and `app/layout.tsx`/`app/simkl-app.tsx` still hardcode `/simkltv` URLs — these need updating before it can be deployed at its own domain root

## Current strategic principle

The website should give NHS operational readers a concise account of:

1. the reporting work Maple Leaf undertakes;
2. the operational contexts in which it works;
3. examples of reporting requirements and work completed;
4. how to make an enquiry.

Technical recruiters are not a target audience for the public website.
Technical detail remains available in `../portfolio-archive/` where it is
useful for future content work.

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

See `docs/roadmap.md` for the platform separation history — Energy and Car
split first, Rate Calculator/Salary Calculator/portfolio archive/TV split
out of this repo on 2026-08-10.

## Local validation

```text
npm run dev
npm test
npm run deploy:static
```

`npm run deploy:static` generates the static site and copies its routes into `public/`. The exported files are committed there because `public/` remains the deployment directory used by the existing Cloudflare site connected to `mapleintel.uk`.

---
