import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactBand, RelatedStudies } from "../../components";
import { caseStudies, getCaseStudy } from "../../site-data";

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
    title: study.title,
    description: study.summary,
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
    <>
      <article>
        <header className="case-hero shell">
          <Link className="back-link" href="/portfolio">← Portfolio</Link>
          <p className="eyebrow">{study.eyebrow}</p>
          <h1>{study.title}</h1>
          <p className="lede">{study.summary}</p>
          <div className="case-hero__image">
            <Image
              src={study.image}
              alt={study.imageAlt}
              width={1800}
              height={1000}
              priority
            />
          </div>
        </header>

        <section className="case-facts shell" aria-label="Project summary">
          {study.facts.map((fact) => (
            <div key={fact.label}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </section>

        <section className="case-section shell">
          <div className="case-section__label">
            <p>The challenge</p>
          </div>
          <div className="case-section__body prose">
            <h2>Building the operational view from source activity.</h2>
            {study.challenge.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="case-section shell">
          <div className="case-section__label">
            <p>The approach</p>
          </div>
          <div className="case-section__body">
            <div className="approach-list">
              {study.approach.map((step, index) => (
                <article key={step.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {study.evidence.length > 0 && (
          <section className="evidence-section">
            <div className="shell">
              <div className="case-section__label">
                <p>Technical evidence</p>
              </div>
              <div className="evidence-grid">
                {study.evidence.map((item) => (
                  <figure key={item.src}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                    />
                    <figcaption>{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="case-section shell">
          <div className="case-section__label">
            <p>Outcome</p>
          </div>
          <div className="case-section__body prose">
            <h2>From reconstructed data to operational use.</h2>
            {study.outcome.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="tag-list" aria-label="Technologies and methods">
              {study.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </div>
        </section>
      </article>
      <RelatedStudies current={study.slug} />
      <ContactBand />
    </>
  );
}
