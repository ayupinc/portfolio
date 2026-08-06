import { caseStudies } from "./case-study-data";
import { ArrowIcon } from "./components";

const capabilities = [
  {
    number: "01",
    title: "Understand the service",
    text: "Clarify the operational question, review how work moves through the service and agree definitions with the people who use them.",
  },
  {
    number: "02",
    title: "Develop consistent reporting",
    text: "Bring operational information together into a consistent account of demand, queues, activity, capacity and performance.",
  },
  {
    number: "03",
    title: "Support operational use",
    text: "Deliver reporting that can support routine oversight, performance review and service improvement, with definitions and limitations kept visible.",
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

const process = [
  ["01", "Scope", "Agree the operational question and the intended use of the reporting."],
  ["02", "Understand", "Review how the service works, where the information comes from and how terms are used."],
  ["03", "Develop", "Create the reporting and test it with the people who understand the operation."],
  ["04", "Hand over", "Document definitions and support routine use and maintenance."],
];

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Maple Leaf Intelligence",
    url: "https://mapleintel.uk",
    email: "enquiry@mapleintel.uk",
    areaServed: "United Kingdom",
    description:
      "Intelligent reporting for NHS operations.",
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
          <p className="eyebrow">Maple Leaf Intelligence</p>
          <h1>Intelligent reporting for NHS operations.</h1>
          <p className="hero__lede">
            Maple Leaf Intelligence develops operational reporting focused on
            demand, flow, capacity and performance. The work begins with how
            the service operates and how the information will be used.
          </p>
          <div className="button-row">
            <a
              className="button"
              href="#case-studies"
            >
              Case studies <span aria-hidden="true">↓</span>
            </a>
            <a
              className="text-link"
              href="mailto:enquiry@mapleintel.uk?subject=NHS%20reporting%20enquiry"
            >
              Reporting enquiries <ArrowIcon />
            </a>
          </div>
        </div>

        <aside className="operational-card" aria-label="The operational picture">
          <div className="operational-card__head">
            <span>Reporting context</span>
            <strong><i aria-hidden="true" /> In operational use</strong>
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
            <span>Defined consistently</span>
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
            <h2>Reporting shaped around operational requirements.</h2>
          </div>
          <p>
            The work combines operational understanding, analysis and
            reporting. Technical methods support the work, but are not the
            focus of the service.
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
            <h2>The reporting is organised around operational questions.</h2>
            <p>
              This is particularly relevant where the information is spread
              across systems, reports or operational definitions.
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
            <h2>Examples of reporting in operational use.</h2>
          </div>
          <p>
            Each study summarises the organisation&apos;s reporting need, the
            work undertaken and how the resulting reporting was used.
          </p>
        </div>
        <div className="study-list">
          {caseStudies.map((study, index) => (
            <article key={study.title} className="study-card">
              <div className="study-card__number">0{index + 1}</div>
              <div className="study-card__main">
                <p className="study-card__meta">{study.meta}</p>
                <h3>{study.title}</h3>
                <div className="study-card__story">
                  <div><span>Reporting need</span><p>{study.challenge[0]}</p></div>
                  <div><span>Work undertaken</span><p>{study.response[0]}</p></div>
                  <div><span>Operational use</span><p>{study.outcomes[0]}</p></div>
                </div>
              </div>
              <div className="study-card__action">
                <strong>{study.highlight}</strong>
                <a href={"/case-studies/" + study.slug + "/"}>
                  Read case study <ArrowIcon />
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
            <h2>A typical reporting engagement.</h2>
          </div>
          <div className="process-flow" aria-label="Four connected stages">
            {process.map(([number, title, text]) => (
              <article key={number}>
                <div className="process-flow__node">
                  <span>{number}</span>
                </div>
                <div className="process-flow__card">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="expectation-grid">
            <div>
              <span>Operational context</span>
              <p>Questions and definitions are based on how the service works.</p>
            </div>
            <div>
              <span>Transparent definitions</span>
              <p>Assumptions, limitations and unusual cases stay visible.</p>
            </div>
            <div>
              <span>Maintainable reporting</span>
              <p>Documentation and ownership are considered as part of delivery.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="shell contact-section__inner">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Reporting enquiries.</h2>
          </div>
          <div className="contact-section__copy">
            <p>
              An initial email can simply outline the service area, the
              reporting question, the information currently available and any
              relevant timescale. Please do not include patient, employee or
              other sensitive data.
            </p>
            <a
              className="button"
              href="mailto:enquiry@mapleintel.uk?subject=NHS%20reporting%20enquiry"
            >
              enquiry@mapleintel.uk <ArrowIcon />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
