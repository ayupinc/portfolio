import Image from "next/image";
import {
  BarChart3,
  FileCheck2,
  GitBranch,
  MonitorCheck,
  Search,
  Target,
} from "lucide-react";
import { caseStudies } from "./case-study-data";
import { ArrowIcon } from "./components";

const capabilities = [
  {
    icon: Search,
    title: "Understand the service",
    text: "Clarify the operational question, review how demand moves through the service and agree definitions with the people who use them.",
  },
  {
    icon: BarChart3,
    title: "Develop consistent reporting",
    text: "Bring operational information together into a consistent account of demand, queues, activity, capacity and performance.",
  },
  {
    icon: MonitorCheck,
    title: "Support operational use",
    text: "Deliver reporting that can support routine oversight, performance review and service improvement, with definitions and limitations kept visible.",
  },
];

const questions = [
  "Where is demand arriving, and how is it changing?",
  "Where are queues, delays or hand-off problems forming?",
  "Does available capacity match the pressure on the service?",
  "Which performance measures can leaders rely on?",
  "How is demand moving through pathways and teams?",
  "What evidence is needed before changing the service?",
];

const process = [
  {
    icon: Target,
    title: "Scope",
    text: "Agree the operational question and the intended use of the reporting.",
  },
  {
    icon: GitBranch,
    title: "Understand",
    text: "Review how the service works, where the information comes from and how terms are used.",
  },
  {
    icon: BarChart3,
    title: "Develop",
    text: "Create the reporting and test it with the people who understand the operation.",
  },
  {
    icon: FileCheck2,
    title: "Hand over",
    text: "Document definitions and support routine use and maintenance.",
  },
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

      <section className="hero-stage" id="top">
        <Image
          className="hero-stage__background"
          src="/images/emergency-department-ambulance-pressure.png"
          alt="Several emergency ambulances outside a busy hospital emergency department."
          fill
          priority
          sizes="100vw"
        />
        <div className="hero shell">
          <div className="hero__panel">
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
          </div>
        </div>
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
            We combine operational understanding, analysis and reporting with
            strong technical capability, so that the underlying data is
            dependable and the resulting reports are clear and useful in
            operational practice.
          </p>
        </div>
        <div className="capability-grid">
          {capabilities.map(({ icon: Icon, title, text }) => (
            <article key={title} className="capability-card">
              <span className="capability-card__icon" aria-hidden="true">
                <Icon strokeWidth={1.7} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="reporting-summary">
          <div>
            <p className="eyebrow">Operational reporting</p>
            <h3>A clear view of performance and variation.</h3>
          </div>
          <p>
            Reporting brings measures, trends and supporting detail together
            so that the operational position can be reviewed consistently.
          </p>
        </div>
      </section>

      <section className="questions-section">
        <Image
          className="questions-section__background"
          src="/images/emergency-operations-control-room.png"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="shell questions-layout">
          <div className="questions-intro">
            <p className="eyebrow">The questions behind the work</p>
            <h2>Reporting organised around operational questions.</h2>
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
            {process.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <div className="process-flow__node">
                  <Icon aria-hidden="true" strokeWidth={1.7} />
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
              relevant timescale.
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
