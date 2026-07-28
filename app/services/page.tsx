import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, ContactBand, PageIntro } from "../components";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Operational analytics, analytics engineering and Power BI delivery for ambulance services, NHS teams and customer-service operations.",
};

const services = [
  {
    number: "01",
    title: "Operational analytics",
    intro:
      "Frame the question around how the service works, what people need to decide and which definition can be defended.",
    items: [
      "Operational requirements and workflow discovery",
      "Demand, queue, flow and outcome analysis",
      "KPI definition and performance methodology",
      "Capacity, activity and utilisation analysis",
    ],
  },
  {
    number: "02",
    title: "Analytics engineering",
    intro:
      "Create stable analytical structures that translate operational events, transactions and technical states into usable business concepts.",
    items: [
      "T-SQL transformation and reusable reporting layers",
      "Event, state and episode reconstruction",
      "Data cleaning, classification and validation",
      "Dimensional and temporal modelling",
    ],
  },
  {
    number: "03",
    title: "Power BI delivery",
    intro:
      "Build semantic models and reports that make complex activity clear, with the evidence and data limitations presented openly.",
    items: [
      "Semantic modelling, Power Query and DAX",
      "Operational monitoring and wallboards",
      "Performance reporting and investigation workflows",
      "Report optimisation, navigation and documentation",
    ],
  },
  {
    number: "04",
    title: "Validation and governance",
    intro:
      "Make the reporting trustworthy enough to use by documenting meaning, checking outputs and keeping operational change visible.",
    items: [
      "Source reconciliation and edge-case testing",
      "Metric definitions and known caveats",
      "Data-quality monitoring and reporting controls",
      "Versioning, guidance and maintainable ownership",
    ],
  },
];

export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="A connected service from operational question to governed reporting."
        text="Maple Leaf Intelligence can deliver a defined analytics project, advise on a difficult reporting problem or work as an embedded specialist within an operational or analytical team."
      />

      <section className="service-story shell">
        <figure className="service-visual">
          <Image
            src="/images/emergency-operations-control-room.png"
            alt="An illustrative, unbranded emergency-services control room with staff coordinating operational activity."
            width={1536}
            height={1024}
            priority
          />
          <figcaption>Operational context, service coordination and performance.</figcaption>
        </figure>
        <div className="service-pair">
          {services.slice(0, 2).map((service) => (
            <article key={service.number} className="service-feature">
              <span>{service.number}</span>
              <h2>{service.title}</h2>
              <p>{service.intro}</p>
              <ul>
                {service.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <figure className="service-visual service-visual--reverse">
          <Image
            src="/images/analytics-engineering-workspace.png"
            alt="An illustrative analyst workspace showing a data model, operational dashboard and validation checks."
            width={1536}
            height={1024}
          />
          <figcaption>Engineering, modelling, reporting and validation.</figcaption>
        </figure>
        <div className="service-pair">
          {services.slice(2).map((service) => (
            <article key={service.number} className="service-feature">
              <span>{service.number}</span>
              <h2>{service.title}</h2>
              <p>{service.intro}</p>
              <ul>
                {service.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="engagement shell">
        <div className="engagement__heading">
          <p className="eyebrow">Ways to work together</p>
          <h2>Scoped around the requirement.</h2>
        </div>
        <div className="engagement__grid">
          <article>
            <span>Project</span>
            <h3>Defined delivery</h3>
            <p>
              A focused piece of analysis, engineering or reporting with an
              agreed operational outcome.
            </p>
          </article>
          <article>
            <span>Advisory</span>
            <h3>Problem definition</h3>
            <p>
              Short, senior support to clarify a metric, model, workflow or
              reporting direction before delivery begins.
            </p>
          </article>
          <article>
            <span>Embedded</span>
            <h3>Contract or interim</h3>
            <p>
              Hands-on delivery within an existing NHS, operational or
              analytics team for a defined period.
            </p>
          </article>
        </div>
        <Link className="text-link" href="/portfolio">
          See these capabilities in practice <ArrowIcon />
        </Link>
      </section>

      <ContactBand />
    </>
  );
}
