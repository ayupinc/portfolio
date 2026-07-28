import Image from "next/image";
import Link from "next/link";
import { caseStudies, type CaseStudy } from "./site-data";

export function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Maple Leaf Intelligence home">
      <Image
        className="brand__leaf"
        src="/assets/maple-leaf.png"
        alt=""
        width={48}
        height={46}
        priority
      />
      <span>
        <strong>Maple Leaf Intelligence</strong>
        <small>Operational analytics</small>
      </span>
    </Link>
  );
}

const nav = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="button button--small" href="/contact">
            Discuss a project
          </Link>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/contact">Discuss a project</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <Brand />
          <p>
            Independent Power BI and analytics engineering consultancy for
            operational services.
          </p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <Link href="/services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/about">About Stephen</Link>
        </div>
        <div>
          <p className="footer-label">Resources</p>
          <a href="/portfolio-original/index.html">Original portfolio</a>
          <a href="/rate-calculator.html">Contract rate calculator</a>
          <a href="/non-nhs/">Non-NHS pay calculator</a>
        </div>
        <div>
          <p className="footer-label">Start a conversation</p>
          <Link href="/contact">Discuss a project <ArrowIcon /></Link>
          <a
            href="https://www.linkedin.com/in/stephenclinton"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <ArrowIcon />
          </a>
        </div>
      </div>
      <div className="shell site-footer__base">
        <span>© {new Date().getFullYear()} Maple Leaf Intelligence</span>
        <span>Built for clarity, evidence and operational use.</span>
      </div>
    </footer>
  );
}

export function PageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="page-intro shell">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lede">{text}</p>
    </section>
  );
}

export function CaseCard({
  study,
  featured = false,
}: {
  study: CaseStudy;
  featured?: boolean;
}) {
  return (
    <article className={`case-card ${featured ? "case-card--featured" : ""}`}>
      <Link href={`/portfolio/${study.slug}`} className="case-card__image">
        <Image
          src={study.image}
          alt={study.imageAlt}
          width={1600}
          height={900}
          sizes={featured ? "(max-width: 800px) 100vw, 68vw" : "(max-width: 800px) 100vw, 50vw"}
        />
      </Link>
      <div className="case-card__body">
        <p className="case-card__meta">
          <span>{study.index}</span>
          {study.eyebrow}
        </p>
        <h3>
          <Link href={`/portfolio/${study.slug}`}>{study.title}</Link>
        </h3>
        <p>{study.summary}</p>
        <Link className="text-link" href={`/portfolio/${study.slug}`}>
          Read case study <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

export function ContactBand() {
  return (
    <section className="contact-band">
      <div className="shell contact-band__inner">
        <div>
          <p className="eyebrow eyebrow--light">A useful first conversation</p>
          <h2>Bring the operational question. We can work back to the data.</h2>
        </div>
        <Link className="button button--light" href="/contact">
          Discuss your requirement <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

export function RelatedStudies({ current }: { current: string }) {
  return (
    <section className="section shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Continue exploring</p>
          <h2>Related operational work</h2>
        </div>
        <Link className="text-link" href="/portfolio">
          View all work <ArrowIcon />
        </Link>
      </div>
      <div className="case-grid">
        {caseStudies
          .filter((study) => study.slug !== current)
          .slice(0, 2)
          .map((study) => (
            <CaseCard key={study.slug} study={study} />
          ))}
      </div>
    </section>
  );
}
