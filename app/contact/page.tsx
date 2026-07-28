import type { Metadata } from "next";
import { PageIntro } from "../components";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Discuss an NHS operational analytics, Power BI or analytics engineering requirement with Maple Leaf Intelligence.",
};

export default function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Start with the operational problem."
        text="If you are working to understand demand, queues, workflow, capacity, service performance or the data beneath them, describe the requirement and the operational view you want to create."
      />
      <section className="contact-layout shell">
        <div className="contact-primary">
          <p className="eyebrow">Direct enquiry</p>
          <h2>Speak with Stephen Clinton</h2>
          <p>
            Suitable conversations include defined Power BI or analytics
            engineering projects, advisory work, and contract or interim
            assignments within operational and analytical teams.
          </p>
          <a className="contact-link" href="mailto:stephen@mapleintel.uk">
            stephen@mapleintel.uk <span aria-hidden="true">↗</span>
          </a>
          <a
            className="contact-link"
            href="https://www.linkedin.com/in/stephenclinton"
            target="_blank"
            rel="noreferrer"
          >
            Connect on LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
        <aside className="contact-aside">
          <p className="eyebrow">Helpful context</p>
          <h2>What to include</h2>
          <ol>
            <li><span>01</span>The service or operational environment</li>
            <li><span>02</span>The operational question you want to answer</li>
            <li><span>03</span>Known systems, sources or reporting constraints</li>
            <li><span>04</span>The timescale or type of support required</li>
          </ol>
          <p className="small-note">
            Keep initial enquiries free of patient, employee or otherwise
            sensitive operational data.
          </p>
        </aside>
      </section>
    </>
  );
}
