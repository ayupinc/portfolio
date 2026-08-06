import Image from "next/image";
import Link from "next/link";

export function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Maple Leaf Intelligence home">
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
        <small>Intelligent reporting for NHS operations</small>
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Brand />
        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/#what-we-do">What we do</Link>
          <Link href="/#case-studies">Case studies</Link>
          <Link href="/#how-we-work">How we work</Link>
        </nav>
        <a
          className="button button--small header-action"
          href="mailto:enquiry@mapleintel.uk?subject=NHS%20reporting%20enquiry"
        >
          Contact <ArrowIcon />
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
          Reporting for NHS teams working with demand, flow, capacity and
          performance.
        </p>
        <a href="mailto:enquiry@mapleintel.uk">
          enquiry@mapleintel.uk <ArrowIcon />
        </a>
      </div>
      <div className="shell site-footer__base">
        <span>© {new Date().getFullYear()} Maple Leaf Intelligence</span>
        <span>Intelligent reporting for NHS operations.</span>
      </div>
    </footer>
  );
}
