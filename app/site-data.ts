export type CaseStudy = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  facts: { label: string; value: string }[];
  challenge: string[];
  approach: { title: string; text: string }[];
  outcome: string[];
  evidence: { src: string; alt: string; caption: string }[];
  tags: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "clinical-queue-intelligence",
    eyebrow: "Clinical operations · Queue intelligence",
    title: "Creating a live, trusted view of clinical queue activity",
    summary:
      "A validated operational model and near-live Power BI wallboard that brings case-management events together into a trustworthy view of waiting demand, active work and queue pressure.",
    image: "/screenshots/queue-wallboard.png",
    imageAlt:
      "An anonymised Power BI wallboard showing clinical queue volumes, priorities and waiting times.",
    facts: [
      { label: "Environment", value: "24/7 clinical contact centre" },
      { label: "Delivery", value: "SQL model, semantic model and wallboard" },
      { label: "Refresh", value: "Near-live DirectQuery" },
      { label: "Use", value: "Primary operational queue view" },
    ],
    challenge: [
      "The case-management system recorded movements and actions as a sequence of audit events. A reliable operational view required those events to be organised into persistent queue episodes and current states.",
      "Cases could move between teams, change priority, leave and return to a queue, or progress through activity recorded in several systems. Team leaders needed one timely view that brought those movements together.",
    ],
    approach: [
      {
        title: "Create the missing analytical entity",
        text: "I generated a stable identifier for every queue or team placement, preserving its sequence, timestamp, priority and classification. Validation logic separated genuine operational episodes from duplicates, housekeeping events and routing artefacts.",
      },
      {
        title: "Reconstruct state through time",
        text: "SQL logic ordered related events chronologically and attributed actions to the active validated placement. Start, end and current states were inferred from subsequent movements, removals, activity and outcomes.",
      },
      {
        title: "Design for continuous operational use",
        text: "A deliberately lightweight DirectQuery model supported live queue volumes, active workload, elapsed time, longest-waiting cases and active clinician counts. The wallboard prioritised at-a-glance interpretation while retaining case-level drill-through.",
      },
    ],
    outcome: [
      "The wallboard was deployed for continuous use across operational teams and became the organisation’s primary view of live queue demand.",
      "It replaced manual checks with a shared, governed account of waiting pressure and active workload. The reusable episode model also supported case-flow, KPI and investigative reporting.",
    ],
    evidence: [
      {
        src: "/screenshots/queue-data-flow.png",
        alt: "A data-flow diagram from case-management events through SQL transformations to Power BI.",
        caption:
          "The operational view is the final layer of a controlled path from raw audit events to validated queue states.",
      },
      {
        src: "/screenshots/queue-engineering.png",
        alt: "A technical model showing queue placement and action tables.",
        caption:
          "Validated placement and action tables provide one consistent home for the temporal logic used across reports.",
      },
    ],
    tags: ["T-SQL", "Power BI", "DirectQuery", "DAX", "Event modelling"],
  },
  {
    slug: "telephony-demand-workforce",
    eyebrow: "Contact-centre operations · Telephony",
    title: "One governed view of demand, service and workforce activity",
    summary:
      "A native Cisco event model and Power BI reporting platform spanning millions of annual calls, from call reconstruction and agent attribution to demand, performance and utilisation reporting.",
    image: "/screenshots/agent-summary.png",
    imageAlt:
      "An anonymised Power BI report summarising agent activity and utilisation.",
    facts: [
      { label: "Scale", value: "2m inbound and 500k outbound calls annually" },
      { label: "Source", value: "Native Cisco event data" },
      { label: "Model", value: "Calls, agent calls, sessions and activities" },
      { label: "Output", value: "Five reports, 40+ pages" },
    ],
    challenge: [
      "A switchboard change created the opportunity to build a transparent reporting model directly from native Cisco data, where each call and agent lifecycle is represented by multiple low-level events.",
      "Operational teams needed a consistent view from organisation-level demand through to individual calls, sessions and agent activity, supported by shared models and clearly defined measures.",
    ],
    approach: [
      {
        title: "Rebuild from native events",
        text: "I classified routing, ringing, answering, talking, transfer, monitoring and internal-call segments before reconstructing complete calls. Agent login, logout and status events were combined into continuous sessions and activity periods.",
      },
      {
        title: "Resolve attribution",
        text: "Ownership rules assigned transferred, monitored and internal calls to the correct agent perspective. Calls and activity could then be analysed consistently within each logged-in session.",
      },
      {
        title: "Translate platform data into operational measures",
        text: "A shared semantic model connected demand, calls, sessions and activities. Governed definitions for assignment, contact, active, waiting and not-ready time made utilisation meaningful to operational users.",
      },
    ],
    outcome: [
      "All telephony and agent reporting moved to the new model, providing a reusable single source for demand, answer and abandonment, handling time, workforce planning and agent-level analysis.",
      "The reporting platform removed dependence on externally generated outputs and created a sustainable base for both routine management and detailed investigation.",
    ],
    evidence: [
      {
        src: "/screenshots/telephony-data-flow.png",
        alt: "A data-flow diagram from native Cisco sources through analytical tables to Power BI.",
        caption:
          "Low-level events are reconstructed once into shared analytical tables before they reach reporting.",
      },
      {
        src: "/screenshots/cisco-engineering.png",
        alt: "An analytical model for calls, agent calls, sessions and agent activity.",
        caption:
          "The model preserves the relationships between organisational demand and individual agent activity.",
      },
    ],
    tags: ["Cisco", "T-SQL", "Power Query", "Power BI", "DAX"],
  },
  {
    slug: "operational-kpi-design",
    eyebrow: "Performance management · KPI governance",
    title: "Designing a waiting-time KPI that reflects operational reality",
    summary:
      "A governed performance measure derived from operational workflow events—combining service interpretation, event logic, semantic modelling and distribution-based reporting.",
    image: "/screenshots/kpi.png",
    imageAlt:
      "An anonymised Power BI operational KPI report with trends and performance distributions.",
    facts: [
      { label: "Question", value: "How long did cases wait for assessment?" },
      { label: "Method", value: "Workflow-derived start and end events" },
      { label: "Analysis", value: "Trend, percentile and distribution" },
      { label: "Control", value: "Definitions, caveats and validation" },
    ],
    challenge: [
      "Cases could change priority, move between assessment levels, leave and later return to the workflow. Several technically plausible start and end points produced materially different performance results.",
      "The requirement combined duration calculation with a clear operational definition that teams recognised, applied consistently and could interpret alongside edge cases and process changes.",
    ],
    approach: [
      {
        title: "Define the operational event",
        text: "I mapped the operational workflow to the underlying event data, selecting the most relevant assignment immediately before assessment and the first valid assessment-initiation action.",
      },
      {
        title: "Engineer explicit edge-case rules",
        text: "The method accounted for movement between levels, re-entry, missing markers, different initiation methods and historical process changes. Business rules and known limitations were documented alongside the calculation.",
      },
      {
        title: "Report the shape of performance",
        text: "The Power BI model included averages, medians, percentiles and distributions so leaders could see variation and pressure hidden by a single headline figure.",
      },
    ],
    outcome: [
      "The solution established a transparent, governed KPI used across teams and workflows to monitor waiting pressure and investigate operational variation.",
      "Its definition and documentation became a reference approach for other performance measures derived from complex workflow events.",
    ],
    evidence: [],
    tags: ["KPI design", "DAX", "Power Query", "Power BI", "Governance"],
  },
  {
    slug: "questionnaire-workflow",
    eyebrow: "Clinical quality · Workflow analysis",
    title: "Turning branching questionnaire responses into stable analytical episodes",
    summary:
      "A reusable SQL and Power BI layer that made changing clinical questionnaires suitable for pathway, quality, outcome and workflow reporting.",
    image: "/screenshots/question-powerbi.png",
    imageAlt:
      "An anonymised Power BI report analysing questionnaire pathways and responses.",
    facts: [
      { label: "Source grain", value: "One row per question response" },
      { label: "Challenge", value: "Branching, versions and re-opened sessions" },
      { label: "Output", value: "Episodes and cleaned responses" },
      { label: "Use", value: "Pathway, quality and outcome reporting" },
    ],
    challenge: [
      "The source represented each assessment as dozens of individual response rows. Stable completed episodes were created across branching, wording changes, spelling variants and re-opened sessions.",
      "Operational users needed to analyse complete workflow episodes and compare consistent clinical concepts across changing questionnaire versions.",
    ],
    approach: [
      {
        title: "Construct stable episodes",
        text: "I derived readable episode keys and sequencing within each call, turning response streams into completed analytical units.",
      },
      {
        title: "Investigate source behaviour",
        text: "Row-number logic corrected a branch loop-back issue, while explicit donor and re-open flags prevented copied timestamps from distorting duration analysis.",
      },
      {
        title: "Govern change",
        text: "Question and response variants were standardised through controlled mappings. Configuration reporting exposed new or changed content so the model could evolve through a simple governed maintenance process.",
      },
    ],
    outcome: [
      "Clinical teams could analyse completed episodes, pathway use, outcomes and consistent questions across versions for the first time.",
      "Centralised cleaning and classification created an auditable shared foundation for quality, outcome and workflow reporting.",
    ],
    evidence: [
      {
        src: "/screenshots/new-question-engineering.png",
        alt: "A technical data model for questionnaire episodes and classified responses.",
        caption:
          "The transformation layer separates stable episodes from cleaned, classified response detail.",
      },
      {
        src: "/screenshots/questionnaire-review-times.png",
        alt: "A Power BI report showing questionnaire review-time analysis.",
        caption:
          "The same governed model supports workflow duration and operational review.",
      },
    ],
    tags: ["T-SQL", "Power BI", "Data quality", "Workflow modelling", "Governance"],
  },
  {
    slug: "resource-utilisation",
    eyebrow: "Operational capacity · Resource analysis",
    title: "Making specialist resource availability and utilisation visible",
    summary:
      "A focused Power BI model that converted event and time data into an accessible view of resource activity, episode length, availability and utilisation.",
    image: "/screenshots/utilisation-1.png",
    imageAlt:
      "An anonymised Power BI report showing resource availability and utilisation.",
    facts: [
      { label: "Focus", value: "Availability, activity and utilisation" },
      { label: "Model", value: "Time and event based" },
      { label: "Views", value: "Summary through to exceptions" },
      { label: "Control", value: "Definitions, help and version history" },
    ],
    challenge: [
      "A specialist operational staff group needed a dedicated account of when resources were available, how they were used and where individual activity required investigation.",
      "The model supported comparisons across area, resource type and operational grouping while retaining the episode-level evidence behind each measure.",
    ],
    approach: [
      {
        title: "Model activity through time",
        text: "I designed the semantic model and measures around availability windows, activity episodes, duration and utilisation percentage.",
      },
      {
        title: "Support both oversight and investigation",
        text: "Highly filterable summary pages connected to detailed views for individual resources and exception cases.",
      },
      {
        title: "Make definitions visible",
        text: "Help, metric-information and version pages ensured users could understand how measures were calculated and when the report changed.",
      },
    ],
    outcome: [
      "The report gave operational leaders a consistent view of specialist resource supply and use while retaining the detail needed to investigate variation.",
      "Its controlled definitions made utilisation a transparent operational measure with a clear relationship to underlying activity.",
    ],
    evidence: [],
    tags: ["Power BI", "DAX", "Time modelling", "Utilisation", "Operations"],
  },
];

export const featuredStudies = caseStudies.slice(0, 3);

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
