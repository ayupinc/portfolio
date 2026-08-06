import { ArrowIcon, DownloadIcon } from "./components";

const capabilities = [
  {
    number: "01",
    title: "Understand the service",
    text: "Clarify the operational question, map how work really moves and agree definitions that make sense to the people running the service.",
  },
  {
    number: "02",
    title: "Create a trusted picture",
    text: "Bring fragmented operational information together into a clear account of demand, queues, activity, capacity and performance.",
  },
  {
    number: "03",
    title: "Put it into use",
    text: "Deliver practical reporting and decision support that teams can use for live oversight, performance review and service improvement.",
  },
];

const questions = [
  "Where is demand arriving, and how is it changing?",
  "Where are queues, delays or hand-off problems forming?",
  "Does available capacity match the pressure on the service?",
  "Which performance measures can leaders rely on?",
  "How is work moving through pathways and teams?",
  "What evidence is needed before changing the service?",
];

const studies = [
  {
    meta: "Clinical operations · 24/7 service",
    title: "Creating a live, trusted view of clinical queues",
    challenge:
      "A clinical contact centre could not reliably see how many cases were waiting, how long they had waited or where pressure was building.",
    response:
      "Maple Leaf reconstructed the service's queue history and turned it into one near-live operational view for team leaders.",
    outcome:
      "Manual checks were replaced by a shared view of waiting demand, active work and the longest waits across the service.",
    fact: "Continuous operational use",
    href: "/downloads/clinical-queue-intelligence-case-study.pdf",
  },
  {
    meta: "Contact centre · Demand and workforce",
    title: "Building one account of calls, service and workforce activity",
    challenge:
      "High-volume call and workforce information was difficult to reconcile, leaving operational teams without one dependable account of demand and delivery.",
    response:
      "Maple Leaf rebuilt the reporting around the organisation's own records and created a consistent view from service demand to individual activity.",
    outcome:
      "Five reports now support demand planning, service performance, workload review and detailed operational investigation.",
    fact: "2.5m calls represented annually",
    href: "/downloads/telephony-demand-workforce-case-study.pdf",
  },
  {
    meta: "Performance management · Waiting time",
    title: "Defining a waiting-time measure the service could trust",
    challenge:
      "A seemingly simple waiting-time question produced different answers depending on which workflow events were used.",
    response:
      "Maple Leaf worked back from the operational meaning of the measure, agreed the right start and end points and made exceptions visible.",
    outcome:
      "Leaders gained a transparent measure that showed typical waits, variation and the cases behind the headline performance.",
    fact: "One governed definition",
    href: "/downloads/waiting-time-kpi-case-study.pdf",
  },
];

const process = [
  ["01", "Frame", "Start with the decision, not the dashboard."],
  ["02", "Understand", "Follow the service, its pressures and its information."],
  ["03", "Build", "Create a dependable view and test it with the people who know the work."],
  ["04", "Embed", "Make the result clear, maintainable and useful in practice."],
];

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Maple Leaf Intelligence",
    url: "https://mapleintel.uk",
    email: "stephen@mapleintel.uk",
    areaServed: "United Kingdom",
    description:
      "Operational analytics and decision support for NHS and health-service teams.",
    serviceType: [
      "Operational analytics",
      "Performance reporting",
      "Demand and capacity analysis",
      "Power BI delivery",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="hero shell" id="top">
        <div className="hero__copy">
          <p className="eyebrow">Operational intelligence for health services</p>
          <h1>
            See the operational picture.{" "}
            <span>Make the next decision with confidence.</span>
          </h1>
          <p className="hero__lede">
            Maple Leaf Intelligence helps NHS and health-service teams turn
            complex operational information into a clear view of demand, flow,
            capacity and performance.
          </p>
          <div className="button-row">
            <a
              className="button"
              href="mailto:stephen@mapleintel.uk?subject=Operational%20analytics%20enquiry"
            >
              Discuss an operational challenge <ArrowIcon />
            </a>
            <a className="text-link" href="#case-studies">
              See the work <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <aside className="operational-card" aria-label="The operational picture">
          <div className="operational-card__head">
            <span>Operational picture</span>
            <strong><i aria-hidden="true" /> Decision-ready</strong>
          </div>
          <div className="signal-list">
            <div>
              <span className="signal-icon">D</span>
              <p><strong>Demand</strong><small>When, where and how it arrives</small></p>
              <span aria-hidden="true">→</span>
            </div>
            <div>
              <span className="signal-icon">F</span>
              <p><strong>Flow</strong><small>Where work waits or moves</small></p>
              <span aria-hidden="true">→</span>
            </div>
            <div>
              <span className="signal-icon">C</span>
              <p><strong>Capacity</strong><small>How resource meets pressure</small></p>
              <span aria-hidden="true">→</span>
            </div>
          </div>
          <div className="operational-card__foot">
            <span>One governed view</span>
            <div aria-hidden="true"><i /><i /><i /><i /><i /></div>
          </div>
        </aside>
      </section>

      <section className="scope-strip" aria-label="Areas of focus">
        <div className="shell scope-strip__inner">
          <span>Demand</span><i />
          <span>Queues &amp; flow</span><i />
          <span>Capacity &amp; workforce</span><i />
          <span>Performance</span><i />
          <span>Decision support</span>
        </div>
      </section>

      <section className="section shell" id="what-we-do">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">What Maple Leaf does</p>
            <h2>From a difficult operational question to a view the service can use.</h2>
          </div>
          <p>
            The work joins up operational understanding, careful analysis and
            practical reporting. The method stays in the background; the
            service question stays in view.
          </p>
        </div>
        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article key={capability.number} className="capability-card">
              <span>{capability.number}</span>
              <h3>{capability.title}</h3>
              <p>{capability.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="questions-section">
        <div className="shell questions-layout">
          <div className="questions-intro">
            <p className="eyebrow">The questions behind the work</p>
            <h2>Useful intelligence starts with how the service operates.</h2>
            <p>
              Maple Leaf is designed for environments where the answer is not
              sitting neatly in one system, one report or one definition.
            </p>
          </div>
          <ol className="question-list">
            {questions.map((question, index) => (
              <li key={question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{question}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section shell case-studies" id="case-studies">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Selected case studies</p>
            <h2>Operational problems, resolved in practice.</h2>
          </div>
          <p>
            Each one-page study is written for operational leaders: the
            organisation&apos;s challenge, what Maple Leaf did and what changed.
          </p>
        </div>
        <div className="study-list">
          {studies.map((study, index) => (
            <article key={study.title} className="study-card">
              <div className="study-card__number">0{index + 1}</div>
              <div className="study-card__main">
                <p className="study-card__meta">{study.meta}</p>
                <h3>{study.title}</h3>
                <div className="study-card__story">
                  <div><span>The challenge</span><p>{study.challenge}</p></div>
                  <div><span>Maple Leaf&apos;s response</span><p>{study.response}</p></div>
                  <div><span>What changed</span><p>{study.outcome}</p></div>
                </div>
              </div>
              <div className="study-card__action">
                <strong>{study.fact}</strong>
                <a href={study.href} target="_blank" rel="noreferrer">
                  Open one-page case study <DownloadIcon />
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="confidentiality-note">
          The studies are anonymised to protect confidential operational and
          organisational information.
        </p>
      </section>

      <section className="process-section" id="how-we-work">
        <div className="shell">
          <div className="process-heading">
            <p className="eyebrow eyebrow--light">How Maple Leaf works</p>
            <h2>A clear route from uncertainty to operational use.</h2>
          </div>
          <div className="process-grid">
            {process.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="expectation-grid">
            <div>
              <span>Built around the service</span>
              <p>Questions and definitions are grounded in operational reality.</p>
            </div>
            <div>
              <span>Evidence made transparent</span>
              <p>Assumptions, limitations and unusual cases stay visible.</p>
            </div>
            <div>
              <span>Designed to be used</span>
              <p>The result supports decisions, not simply presentation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="shell contact-section__inner">
          <div>
            <p className="eyebrow">Start with the problem</p>
            <h2>What does your service need to see more clearly?</h2>
          </div>
          <div className="contact-section__copy">
            <p>
              Describe the operational challenge, the decision it is holding
              up and the information currently available. Initial enquiries
              should not contain patient, employee or other sensitive data.
            </p>
            <a
              className="button"
              href="mailto:stephen@mapleintel.uk?subject=Operational%20analytics%20enquiry"
            >
              Start a conversation <ArrowIcon />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
