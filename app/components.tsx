import Image from "next/image";

export function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export function DownloadIcon() {
  return <span aria-hidden="true">↓</span>;
}

export function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Maple Leaf Intelligence home">
      <span className="brand__mark" aria-hidden="true">
        <Image
          src="/assets/maple-leaf.png"
          alt=""
          width={48}
          height={46}
          priority
        />
      </span>
      <span className="brand__copy">
        <strong>Maple Leaf Intelligence</strong>
        <small>Operational intelligence for health services</small>
      </span>
    </a>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Brand />
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#what-we-do">What we do</a>
          <a href="#case-studies">Case studies</a>
          <a href="#how-we-work">How we work</a>
        </nav>
        <a
          className="button button--small header-action"
          href="mailto:stephen@mapleintel.uk?subject=Operational%20analytics%20enquiry"
        >
          Discuss a challenge <ArrowIcon />
        </a>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__main">
        <Brand />
        <p>
          Helping NHS and health-service teams understand demand, flow,
          capacity and performance.
        </p>
        <a href="mailto:stephen@mapleintel.uk">
          stephen@mapleintel.uk <ArrowIcon />
        </a>
      </div>
      <div className="shell site-footer__base">
        <span>© {new Date().getFullYear()} Maple Leaf Intelligence</span>
        <span>Operational clarity. Evidence that holds up.</span>
      </div>
    </footer>
  );
}
