# Maple Intel Content and Information Architecture

## Governing user journey

Every page and component should give an NHS operational reader a concise account
of:

1. **Focus:** intelligent reporting for NHS operations.
2. **Scope:** demand, flow, capacity, workforce and performance.
3. **Examples:** reporting requirements, work undertaken and operational use.
4. **Approach:** a measured account of how reporting is developed.
5. **Contact:** a straightforward route for reporting enquiries.

The site should not force every visitor through a rigid sequence. It should provide clear routes for fast-scanning decision-makers and deeper routes for technical readers.

Recruiters and other engagement intermediaries are a secondary audience. They should be able to infer suitability for contract, interim or embedded assignments from the same evidence, without the site adopting the language or structure of a job-seeking portfolio.

The primary and stated client context is NHS operations, including ambulance
services and other settings concerned with demand, queues, workflow, capacity,
workforce and performance.

## Content model

The site is an editorial and technical portfolio first, and a promotional business site second.

Its principal content objects are:

- capability;
- client context;
- operational problem;
- case study;
- technical method;
- evidence asset;
- outcome;
- contact route.

Each case study should connect these objects rather than operating as an isolated screenshot gallery.

## Proposed first-release information architecture

### Home

Purpose: establish relevance, differentiation and a route into evidence within the first screen and first short scroll.

Proposed sequence:

1. concise NHS and ambulance-focused proposition;
2. supporting explanation of the wider operational problems Maple Intel solves;
3. primary action: view selected work;
4. secondary action: discuss a project or analytics requirement;
5. selected case studies;
6. connected capability overview;
7. operational-background credibility statement;
8. contact prompt.

The home page should answer “What do you do?”, “Why should I believe you?” and “Where can I see the work?” without requiring an About-page visit.

The first screen should establish the NHS and ambulance specialism. Wider health and customer-service relevance should become apparent in the supporting copy and evidence rather than weakening the lead proposition with a long sector list.

### Work

Purpose: provide a visual, scannable index of evidence.

Each card should show:

- a problem-led title;
- one-sentence context;
- the relevant capability or domain;
- a carefully selected work image;
- an indication of technical depth;
- a link to the complete case study.

The Work index should allow useful filtering or grouping by operational problem only if the launch volume justifies it. Likely problem themes are:

- demand, volume and service patterns;
- queues, workflow and outcomes;
- workforce and agent activity;
- resource availability and utilisation;
- KPI design and performance reporting;
- data quality, transformation and governance.

Initial evidence already in the repository includes:

- telephony demand and agent activity;
- Cisco telephony analytics engineering;
- real-time clinical queue monitoring;
- queue activity analytics engineering;
- workflow and outcome analysis;
- operational KPI design and performance reporting;
- questionnaire workflow reporting and governance;
- questionnaire-response analytics engineering;
- resource availability and utilisation reporting.

## Launch case-study set

The existing portfolio is the agreed evidence source for the first release. Existing material should be rewritten and reorganised for the new user journey, not presented as newly invented work.

Five complementary case-study families should receive primary prominence:

### 1. Reconstructing and monitoring clinical queues

Combine:

- Clinical Queue Activity analytics engineering;
- Real-Time Clinical Queue Monitoring and Operational Wallboard.

Core story: raw audit events did not contain a stable queue episode or reliable current state. Maple Intel reconstructed validated operational states, created reusable analytical tables and delivered a near-live Power BI wallboard used continuously by operational teams.

Primary evidence:

- temporal event reconstruction;
- queue and workflow modelling;
- SQL transformation;
- DirectQuery semantic modelling;
- operational wallboard design;
- validation and governance;
- 24/7 operational use.

### 2. Telephony demand, service performance and workforce activity

Combine:

- Cisco Telephony analytics engineering;
- Telephony Demand and Agent Activity reporting;
- the associated anonymised SQL evidence.

Core story: unreliable third-party reporting was replaced with a governed analytical model built from native Cisco events, followed by a shared Power BI reporting platform covering demand, service performance, calls, sessions, activity and utilisation.

Primary evidence:

- high-volume contact-centre data;
- call and agent-event reconstruction;
- ownership and attribution logic;
- reusable analytical tables;
- semantic modelling and Power Query;
- KPI and utilisation design;
- more than forty report pages across five reports;
- reporting across approximately 2 million inbound and 500,000 outbound calls annually.

### 3. Designing a trustworthy operational waiting-time KPI

Use:

- Operational KPI Design and Performance Reporting;
- relevant queue-engineering evidence where it explains the underlying event model.

Core story: a seemingly simple waiting-time measure had no authoritative source timestamp. Maple Intel defined the operational meaning, engineered the start and end logic, handled workflow edge cases and delivered governed performance reporting.

Primary evidence:

- operational requirements interpretation;
- workflow and event modelling;
- KPI definition;
- averages, medians, percentiles and distributions;
- semantic modelling;
- validation, caveats and governance.

### 4. Questionnaire data engineering, workflow analysis and governance

Combine:

- Questionnaire Responses analytics engineering;
- Questionnaire Workflow Reporting and Governance;
- the associated anonymised SQL evidence.

Core story: response-level data from changing, branching clinical questionnaires was transformed into stable episodes and governed analytical structures that supported pathway, quality, outcome and workflow reporting.

Primary evidence:

- episode-key construction;
- branching and loop-back logic;
- re-opened-session detection;
- response standardisation and classification;
- reusable SQL transformation;
- Power BI workflow analysis;
- configuration governance and maintainability.

### 5. Resource availability and utilisation

Use:

- Specific Resource Availability and Utilisation Reporting.

Core story: event and time data was converted into a dedicated view of resource availability, activity, episode length and utilisation, with both summary analysis and exception-level investigation.

Primary evidence:

- time and event modelling;
- operational utilisation measures;
- area and resource segmentation;
- detailed investigation routes;
- metric definitions and report governance.

### Additional supporting study

Workflow and Outcome Analysis should remain available in the Work index and may be promoted if its final evidence is stronger than one of the five featured studies. It reinforces the service-flow and outcome-analysis proposition but should not displace a more technically complete launch study without a content review.

The existing SQL pages should become technical evidence linked from or embedded within their parent case studies, rather than appearing as equal top-level portfolio entries. This preserves technical depth while keeping the Work index focused on client problems and delivered outcomes.

### Case study

Purpose: prove technical and operational capability through a coherent account of a real problem.

Each study should work at two levels:

- a concise narrative for clients and operational decision-makers;
- optional technical depth for assessors and peers.

The standard structure is defined in `case-study-template.md`.

### Expertise

Purpose: explain how capabilities work together, not reproduce a CV keyword list.

Recommended capability groups:

1. **Operational problem definition**  
   Requirements discovery, KPI design, workflow interpretation and stakeholder engagement.
2. **Analytics engineering**  
   SQL Server, Power Query and M, data cleaning, transformation and reproducible pipelines.
3. **Data and semantic modelling**  
   Dimensional modelling, event and state modelling, measure design and DAX.
4. **Power BI delivery**  
   Information design, interactive analysis, operational monitoring and performance reporting.
5. **Reliability and adoption**  
   Validation, data quality, governance, documentation and delivery.

Each group should link to case-study evidence.

Capability copy should remain grounded in the operational questions Maple Intel addresses:

- What demand is the service receiving, and when?
- Where are queues or delays forming?
- How are cases, calls or work items progressing?
- What resources are available and how are they being used?
- Which performance measures are trustworthy and useful?
- What data-engineering work is needed before those questions can be answered reliably?

### About

Purpose: explain the perspective behind the work and establish personal trust.

It should cover:

- Stephen Clinton as the practitioner behind Maple Intel;
- senior operational leadership experience;
- direct experience extracting, modelling, reporting and using operational data;
- the connection between operational judgement and technical design;
- a restrained professional biography;
- a LinkedIn route if appropriate.

The page should not become a full chronological CV.

### Contact

Purpose: remove friction from starting a relevant conversation.

Recommended routes:

- direct email;
- LinkedIn;
- a short, spam-protected enquiry form only if it improves convenience.

Suggested prompt categories may include:

- NHS or ambulance-service analytics project;
- operational or logistical reporting problem;
- Power BI or analytics engineering requirement;
- health or customer-service performance reporting;
- contract, interim or embedded assignment;
- general professional enquiry.

## Navigation

Recommended primary navigation:

- Work
- Expertise
- About
- Contact

The Maple Intel identity links to Home. A persistent but restrained contact action may be used on larger screens.

Do not add separate top-level pages for individual tools unless evidence later shows a search or audience need. Tools belong within Expertise and case studies.

## Audience routes

### Potential client

Home → recognisable operational problem → relevant case study → method and outcome → Contact

Support evaluation with:

- visible understanding of NHS, ambulance and related operational environments;
- the types of problems solved;
- a legible engagement-level explanation of the approach;
- evidence of validation and governance;
- honest handling of confidential details;
- a low-pressure invitation to discuss the problem.

### Recruiter or engagement intermediary

Home → selected work or Expertise → one case study → About → Contact/LinkedIn

This is a secondary route, supported through:

- explicit capabilities;
- short case-study summaries;
- clear ownership of work;
- visible technical terms used in context;
- clear availability for suitable contract, interim or embedded assignments.

It should not require a recruiter-specific landing page or job-seeking calls to action.

### Technical assessor

Work → case study → model, transformation and validation detail → related case study

Support scrutiny with:

- diagrams and annotated screenshots;
- explained design choices;
- selected, sanitised code where it materially proves the approach;
- limitations and validation notes;
- meaningful cross-links rather than duplicated copy.

## Content depth and disclosure

Use progressive disclosure:

- lead with problem, responsibility and outcome;
- follow with the analytical approach;
- offer deeper model, SQL, DAX or validation detail where useful.

Technical material should remain accessible without hiding all substance behind accordions. The page must still make sense when printed, linked to a section, or read without interaction.

## Visual content strategy

The technical work is the visual focus. Priority assets are:

1. Power BI report views;
2. semantic or dimensional models;
3. data-flow and workflow diagrams;
4. annotated transformation or validation examples;
5. restrained illustrations created only when they explain an otherwise invisible process.

Avoid:

- stock photography;
- generic dashboard mockups;
- decorative charts without analytical meaning;
- screenshots that are too dense to interpret;
- confidential data or identifiable operational information.

Every image should have a communicative purpose, a caption and appropriate alternative text. Mobile crops may differ from desktop crops when necessary.

## Conversion strategy

The primary conversion is a relevant professional conversation, not a newsletter signup or immediate sales transaction.

Calls to action should match the reader’s stage:

- early: **View selected work**
- after capability content: **See how this was applied**
- after evidence: **Discuss a project**
- final: **Contact Stephen**

Avoid repeating an identical high-pressure call to action after every section.

## Initial content priorities

Before visual design:

1. review the five proposed featured case-study families and confirm their ordering;
2. prioritise the operational problems within the agreed NHS, health and customer-service focus;
3. draft the home-page proposition and supporting paragraph;
4. establish what outcomes can be stated publicly;
5. audit all screenshots for legibility and confidentiality;
6. map every Expertise claim to at least one piece of evidence.

## Success criteria

The first release should enable a visitor to:

- identify the service and specialism within seconds;
- recognise the primary NHS and ambulance-service focus without excluding relevant adjacent operations;
- find a relevant case study without understanding the site structure;
- distinguish operational analytics from generic dashboard development;
- verify technical depth without reading every page;
- identify Stephen as the practitioner responsible for the work;
- make contact easily from any primary route.

Analytics measures can be defined later, but useful signals may include case-study entrances, depth of case-study reading, movement from case studies to contact, and successful contact actions. Raw page views alone will not demonstrate success.
