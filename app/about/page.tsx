import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, ContactBand, PageIntro } from "../components";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Stephen Clinton and Maple Leaf Intelligence—operational leadership experience combined with hands-on analytics engineering and Power BI delivery.",
};

export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="About Maple Leaf Intelligence"
        title="Operational judgement and technical delivery, in the same conversation."
        text="Maple Leaf Intelligence is an independent consultancy led by Stephen Clinton, specialising in operational analytics for ambulance services, the wider NHS and related service environments."
      />

      <section className="about-story shell">
        <div className="about-story__aside">
          <p className="eyebrow">Stephen Clinton</p>
          <div className="monogram" aria-hidden="true">SC</div>
          <p>
            Operational analytics consultant
            <br />
            Power BI · SQL · Data modelling
          </p>
        </div>
        <div className="prose">
          <h2>I have used operational reporting from both sides.</h2>
          <p>
            My background includes senior operational leadership as well as
            extracting data, designing models, building reports and working
            directly with the people who depend on them.
          </p>
          <p>
            That combination matters. Operational systems rarely store a clean
            version of the concept a service wants to measure. A queue may
            exist only as a sequence of audit events. A waiting-time KPI may
            have several technically valid timestamps but only one defensible
            operational meaning. A utilisation figure can be mathematically
            correct and still mislead the people using it.
          </p>
          <p>
            Maple Leaf Intelligence was created to work on that intersection: understand
            the service, engineer a reliable analytical model and present the
            result clearly enough to support real decisions.
          </p>

          <h2>Where the experience is strongest</h2>
          <p>
            Ambulance and urgent-care operations are the primary specialism,
            including clinical contact centres, queues, telephony, workforce
            activity, pathways, resource utilisation and performance
            reporting. The same methods transfer naturally to wider health and
            customer-service operations with complex demand and workflow data.
          </p>

          <h2>How I work</h2>
          <p>
            I favour clear definitions, visible assumptions and evidence that
            can be investigated. I am comfortable moving between an
            operational conversation, a SQL transformation, a semantic model
            and the final Power BI experience because they are parts of the
            same delivery problem.
          </p>
          <Link className="text-link" href="/portfolio">
            Explore selected work <ArrowIcon />
          </Link>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
