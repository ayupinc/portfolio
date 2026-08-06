import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "../../components";
import { caseStudies, getCaseStudy } from "../../case-study-data";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.title + " | Maple Leaf Intelligence",
    description: study.summary,
    alternates: {
      canonical: "/case-studies/" + study.slug + "/",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <article className="case-page">
      <header className="case-page__hero shell">
        <Link className="back-link" href="/#case-studies">
          <span aria-hidden="true">←</span> All case studies
        </Link>
        <p className="eyebrow">{study.meta}</p>
        <h1>{study.title}</h1>
        <p className="case-page__summary">{study.summary}</p>
      </header>

      <section className="case-page__facts shell" aria-label="At a glance">
        {study.facts.map((fact) => (
          <div key={fact.label}>
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </div>
        ))}
      </section>

      <figure className="case-page__visual shell">
        <div>
          <Image
            src={study.image}
            alt={study.imageAlt}
            width={1800}
            height={1000}
            priority
          />
        </div>
        <figcaption>{study.imageCaption}</figcaption>
      </figure>

      <div className="case-page__body shell">
        <section className="case-page__challenge">
          <p className="case-label">The reporting need</p>
          <h2>What the organisation needed to understand.</h2>
          {study.challenge.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className="case-page__response">
          <p className="case-label">Work undertaken</p>
          <h2>How the reporting requirement was addressed.</h2>
          <ol className="case-response-flow">
            {study.response.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="case-outcome">
        <div className="shell case-outcome__inner">
          <div>
            <p className="case-label">Operational use</p>
            <h2>{study.highlight}</h2>
          </div>
          <ul>
            {study.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="case-page__next shell">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Reporting enquiries.</h2>
        </div>
        <a
          className="button"
          href="mailto:enquiry@mapleintel.uk?subject=NHS%20reporting%20enquiry"
        >
          enquiry@mapleintel.uk <ArrowIcon />
        </a>
      </section>
    </article>
  );
}
