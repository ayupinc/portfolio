import type { Metadata } from "next";
import { CaseCard, ContactBand, PageIntro } from "../components";
import { caseStudies } from "../site-data";

export const metadata: Metadata = {
  title: "Operational analytics portfolio",
  description:
    "Case studies in NHS operational analytics, Power BI, SQL, workflow modelling and contact-centre reporting.",
};

export default function Portfolio() {
  return (
    <>
      <PageIntro
        eyebrow="Selected work"
        title="From difficult operational data to decisions people can trust."
        text="These case studies show the full analytical path: understanding the service, reconstructing what the source systems do not provide, designing reliable models and delivering reporting for real operational use."
      />
      <section className="portfolio-index shell" aria-label="Case studies">
        {caseStudies.map((study, index) => (
          <CaseCard key={study.slug} study={study} featured={index === 0} />
        ))}
      </section>
      <section className="archive-note shell">
        <div>
          <p className="eyebrow">Preserved source material</p>
          <h2>The original technical portfolio remains available.</h2>
        </div>
        <p>
          The original report, analytics-engineering and sanitised SQL pages
          have been retained as a separate archive for readers who want to
          inspect the source presentation.
          <br />
          <a className="text-link" href="/portfolio-original/index.html">
            Open the original portfolio ↗
          </a>
        </p>
      </section>
      <ContactBand />
    </>
  );
}
