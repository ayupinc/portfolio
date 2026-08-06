export type CaseStudy = {
  slug: string;
  meta: string;
  title: string;
  summary: string;
  facts: { label: string; value: string }[];
  challenge: string[];
  response: string[];
  outcomes: string[];
  highlight: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "clinical-queue-intelligence",
    meta: "Clinical operations · 24/7 service",
    title: "Providing a live view of clinical queues",
    summary:
      "A clinical contact centre needed one consistent view of waiting demand, active work and pressure across its queues.",
    facts: [
      { label: "Environment", value: "24/7 clinical contact centre" },
      { label: "Need", value: "Reliable view of current queues" },
      { label: "Result", value: "Near-live operational wallboard" },
    ],
    challenge: [
      "The organisation's case-management system recorded thousands of individual movements and actions, but did not provide a stable account of each period a case spent in a queue.",
      "Cases could move between teams, change priority, leave and return. Team leaders were relying on manual checks to understand what was waiting and where pressure was building.",
    ],
    response: [
      "Agreed what the service needed to see: current waiting demand, active work, priorities, elapsed time and the longest waits.",
      "Reconstructed the history of each queue placement so that movements and current states could be represented consistently.",
      "Delivered a near-live operational wallboard, with the detail needed to move from service-wide pressure to individual cases.",
    ],
    outcomes: [
      "A shared view replaced repeated manual checks across operational teams.",
      "Leaders could see emerging pressure and the longest waits in one place.",
      "The same consistent account supported wider flow and performance reporting.",
    ],
    highlight: "Continuous operational use",
    image: "/screenshots/queue-wallboard.png",
    imageAlt:
      "An anonymised operational wallboard showing clinical queue volumes and waiting times.",
    imageCaption: "An anonymised view of the operational queue wallboard.",
  },
  {
    slug: "telephony-demand-workforce",
    meta: "Contact centre · Demand and workforce",
    title: "Building one account of calls, service and workforce activity",
    summary:
      "A high-volume contact centre needed a consistent view of demand, service performance and the activity behind it.",
    facts: [
      { label: "Scale", value: "About 2.5m calls each year" },
      { label: "Need", value: "One consistent account" },
      { label: "Result", value: "Five connected reports" },
    ],
    challenge: [
      "Call and workforce information was spread across low-level platform records and externally produced outputs. Measures were difficult to reconcile and operational questions often required separate analysis.",
      "The organisation needed to understand overall demand and service, then move through calls, sessions and agent activity without changing the meaning of the measures along the way.",
    ],
    response: [
      "Started with the service questions: when demand arrived, what happened to each call and how workload related to available staff.",
      "Rebuilt the account of calls and activity around the organisation's own records, with consistent rules for transfers and ownership.",
      "Created five connected reports for demand, performance, workforce planning, operational review and detailed investigation.",
    ],
    outcomes: [
      "All telephony and agent reporting moved to one governed source.",
      "Operational teams could move from service trends to supporting detail.",
      "The work provided a reusable base for planning and investigation.",
    ],
    highlight: "2.5m calls represented annually",
    image: "/screenshots/agent-summary.png",
    imageAlt:
      "An anonymised operational report summarising contact-centre workforce activity.",
    imageCaption:
      "An anonymised workforce activity summary from the reporting suite.",
  },
  {
    slug: "waiting-time-kpi",
    meta: "Performance management · Waiting time",
    title: "Defining an operational waiting-time measure",
    summary:
      "An NHS team needed one repeatable measure of how long cases waited for assessment across a changing operational workflow.",
    facts: [
      { label: "Question", value: "How long did cases wait?" },
      { label: "Need", value: "One operational definition" },
      { label: "Result", value: "Transparent performance view" },
    ],
    challenge: [
      "Several timestamps could plausibly mark the start or end of a wait. Cases could also move between levels, leave and return, or follow different routes into assessment.",
      "Each interpretation produced a different answer. A useful measure had to reflect how the service understood the wait, deal openly with exceptions and remain stable when the workflow changed.",
    ],
    response: [
      "Mapped the operational journey and agreed the event that best represented the start and end of the wait.",
      "Set clear rules for movement, re-entry, missing markers and changes in the way assessments were started.",
      "Designed reporting that showed typical waits, long waits and the full shape of performance, with definitions and caveats kept visible.",
    ],
    outcomes: [
      "The reporting provided one transparent and repeatable waiting-time measure.",
      "Variation hidden by a single average became visible and investigable.",
      "The documented method became a reference for other complex measures.",
    ],
    highlight: "One documented definition",
    image: "/screenshots/kpi.png",
    imageAlt:
      "An anonymised operational report showing waiting-time trends and performance variation.",
    imageCaption:
      "An anonymised performance view showing trends and variation.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
