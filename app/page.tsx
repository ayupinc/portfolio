import Image from "next/image";
import Link from "next/link";
import {
  ArrowIcon,
  CaseCard,
  ContactBand,
} from "./components";
import { featuredStudies } from "./site-data";

export default function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero__copy">
          <p className="eyebrow">Independent analytics consultancy</p>
          <h1>
            Operational analytics for services where{" "}
            <em>the detail matters.</em>
          </h1>
          <p className="hero__lede">
            Maple Intel helps ambulance services, NHS teams and customer-service
            operations turn complex logistical data into reliable analysis,
            Power BI reporting and better operational decisions.
          </p>
          <div className="button-row">
            <Link className="button" href="/portfolio">
              View selected work <ArrowIcon />
            </Link>
            <Link className="text-link" href="/services">
              Explore services <ArrowIcon />
            </Link>
          </div>
        </div>
        <div className="hero__evidence" aria-label="Example operational report">
          <div className="hero__frame">
            <Image
              src="/screenshots/queue-wallboard.png"
              alt="An anonymised Power BI clinical queue wallboard."
              width={1698}
              height={954}
              priority
            />
          </div>
          <div className="hero__note">
            <span>01</span>
            <p>
              Near-live queue intelligence
              <small>Built for continuous 24/7 operational use</small>
            </p>
          </div>
        </div>
      </section>

      <section className="proof-strip">
        <div className="shell proof-strip__grid">
          <p>From operational question to governed reporting</p>
          <div><strong>2.5m</strong><span>annual calls modelled</span></div>
          <div><strong>24/7</strong><span>queue visibility delivered</span></div>
          <div><strong>40+</strong><span>report pages in one platform</span></div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading section-heading--wide">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2>Evidence, not broad claims.</h2>
          </div>
          <p>
            Real projects showing how difficult operational data was
            reconstructed, modelled, validated and made useful.
          </p>
        </div>
        <div className="featured-list">
          {featuredStudies.map((study, index) => (
            <CaseCard
              key={study.slug}
              study={study}
              featured={index === 0}
            />
          ))}
        </div>
        <div className="section-end">
          <Link className="button button--outline" href="/portfolio">
            Explore the full portfolio <ArrowIcon />
          </Link>
        </div>
      </section>

      <section className="services-preview">
        <div className="shell">
          <div className="section-heading section-heading--wide">
            <div>
              <p className="eyebrow">How Maple Intel helps</p>
              <h2>Technical delivery grounded in operational reality.</h2>
            </div>
            <p>
              The work connects requirements, engineering, modelling, report
              design and governance. Each discipline strengthens the next.
            </p>
          </div>
          <div className="service-grid">
            {[
              ["01", "Operational analysis", "Define the real question, workflow and performance measure before choosing the visual."],
              ["02", "Analytics engineering", "Turn fragmented source data into stable, reusable analytical structures."],
              ["03", "Power BI delivery", "Build semantic models and reports that work for monitoring and investigation."],
              ["04", "Validation & governance", "Make definitions, limitations and quality controls visible and maintainable."],
            ].map(([number, title, text]) => (
              <article key={title} className="service-card">
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <Link className="text-link" href="/services">
            See the complete service model <ArrowIcon />
          </Link>
        </div>
      </section>

      <section className="perspective shell">
        <div className="perspective__statement">
          <p className="eyebrow">A different starting point</p>
          <blockquote>
            “Good operational reporting begins with how the service actually
            works—not with the fields that happen to be easiest to query.”
          </blockquote>
        </div>
        <div className="perspective__copy">
          <h2>Built from both sides of the decision.</h2>
          <p>
            Maple Intel is led by Stephen Clinton, combining senior operational
            leadership experience with hands-on SQL, modelling and Power BI
            delivery.
          </p>
          <p>
            That means understanding the pressures behind a metric, the
            weaknesses hidden in source systems and what a report must do when
            people rely on it during live operations.
          </p>
          <Link className="text-link" href="/about">
            About Stephen and Maple Intel <ArrowIcon />
          </Link>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
