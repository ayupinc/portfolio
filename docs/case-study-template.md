# Maple Intel Case Study Template

## Editorial purpose

A case study is evidence, not a project description or screenshot gallery. It should show how an operational question became a trustworthy analytical product and make Stephen’s contribution unambiguous.

Not every section needs equal length. Use only detail that helps the reader assess relevance, judgement, technical depth or outcome.

---

## Metadata

- **Working title:**
- **One-line summary:**
- **Status:** Draft / reviewed / ready
- **Capability groups:**
- **Operational domain:**
- **Tools used:**
- **Primary audience:**
- **Confidentiality treatment:**
- **Hero/lead asset:**
- **Related studies:**

## Title

Use a problem- or outcome-led title where possible.

Prefer:

> Reconstructing real-time clinical queue activity

Over:

> Queue Dashboard

## Summary

In two or three sentences, state:

- the operational problem;
- the nature of the source data or complexity;
- what was designed or delivered.

This summary should allow a potential client to judge relevance without reading further. It should also give an intermediary enough context to recognise suitability for a specific assignment.

## At a glance

- **Context:** [environment and operational need]
- **My role:** [specific ownership]
- **Data:** [source types and relevant scale, if publishable]
- **Methods:** [modelling and engineering approach]
- **Output:** [report, model, pipeline or process]
- **Outcome:** [measured result or responsible qualitative result]

## Context

Explain:

- the operational environment;
- who needed the analysis;
- what decision, workflow or performance question was involved;
- why the existing information was insufficient.

Remove or generalise confidential organisational details without making the problem so vague that it loses meaning.

## The analytical challenge

Describe the difficult parts of the problem, such as:

- fragmented or inconsistent sources;
- event histories that did not directly represent state;
- ambiguous operational definitions;
- incomplete identifiers or timestamps;
- many-to-many relationships;
- changing workflow or business rules;
- performance, refresh or governance constraints.

This section should demonstrate complexity through facts rather than adjectives.

## My responsibility

State Stephen’s contribution in direct terms:

- what he discovered;
- what he designed;
- what he built;
- what he validated;
- whom he worked with;
- what he delivered or governed.

Distinguish personal work from team or organisational outcomes.

## Approach

Present a short, understandable sequence from source to decision:

1. requirements and operational definitions;
2. source assessment and profiling;
3. transformation or reconstruction;
4. data/semantic modelling;
5. measure and report design;
6. validation and iteration;
7. delivery and use.

Use a diagram when the relationships are clearer visually than in prose.

## Data engineering and modelling

Include only the technical decisions that demonstrate judgement:

- source-system characteristics;
- cleaning and transformation strategy;
- dimensional, event, state or snapshot modelling;
- grain and relationship decisions;
- treatment of dates, time zones, duration or status;
- reusable SQL, M, DAX or model patterns;
- performance considerations.

Explain why important choices were made. A tool name without its role is weak evidence.

## Report and interaction design

Explain:

- the questions each report view answers;
- the hierarchy of information;
- KPI definitions;
- filtering and navigation decisions;
- real-time or operational-display constraints;
- accessibility and legibility considerations.

Use carefully cropped, anonymised screenshots with captions that tell readers what to inspect.

## Validation and governance

Cover relevant checks:

- reconciliation with source totals;
- sampling against operational records;
- edge-case testing;
- definition review with stakeholders;
- refresh and failure checks;
- data-quality warnings;
- access, privacy or anonymisation;
- documentation and ownership.

Validation is a core part of the Maple Intel proposition and should not be treated as an afterthought.

## Outcome and use

State what changed:

- decisions enabled;
- manual work reduced;
- visibility improved;
- definitions standardised;
- risks identified;
- adoption or operational use;
- measurable time, quality or performance effects.

Use numbers only when accurate, attributable and safe to publish. When a quantified claim is unavailable, describe the verified operational use without inflating it.

## Reflection

Optional. Briefly state:

- an important lesson;
- a limitation;
- what would be developed next;
- how the method transfers to another environment.

This can demonstrate mature judgement, particularly where confidentiality limits the visible outcome.

## Related evidence and next step

Offer one or two relevant routes:

- a related case study;
- a connected Expertise section;
- a selected technical detail;
- contact to discuss a similar problem.

## Asset checklist

- [ ] Lead image has a clear purpose
- [ ] Screenshots are anonymised
- [ ] Screenshots remain legible at intended display sizes
- [ ] Diagrams use consistent notation
- [ ] Captions explain what the evidence demonstrates
- [ ] Alternative text conveys the image’s purpose
- [ ] Code is sanitised and short enough to interpret
- [ ] No client, patient, employee or operationally sensitive data is exposed

## Editorial checklist

- [ ] The problem is understandable before tools are mentioned
- [ ] Stephen’s personal contribution is explicit
- [ ] Technical claims are supported by evidence
- [ ] Important modelling decisions include their rationale
- [ ] Validation is described
- [ ] Outcomes are accurate and proportionate
- [ ] Acronyms are expanded on first use
- [ ] The page serves both scanning and deep-reading routes
- [ ] The next step is relevant and restrained
