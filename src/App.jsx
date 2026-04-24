import { useState } from "react";

// ─────────────────────────────────────────────────────────────
//  DASHBOARD DATA
//  To add a screenshot: drop the image file into /public/images/
//  then set the `image` field below to the filename, e.g. "csd-wallboard.png"
//  Leave as null to show the placeholder.
// ─────────────────────────────────────────────────────────────
const projects = [
  {
    id: "csd",
    title: "CSD Wallboard",
    tags: ["Live Operations", "DirectQuery"],
    domain: "Clinical Contact Centre",
    accent: "#007A6A",
    accentLight: "#E8F5F3",
    image: "CSD Wallboard Main.png",
    problem:
      "The Clinical Contact Centre had no live visibility of call volumes across its three clinical queues — Screening, Rapid Assessment, and Specialist Desk. Supervisors were managing up to 250 simultaneous calls without a consolidated view.",
    built:
      "A DirectQuery Power BI wallboard polling the CAD every 60 seconds, displaying live call counts, MPDS priority order, and time-in-queue per call across all three desks. Required engagement with the CAD vendor to decode undocumented internal call status parameters before a reliable query could be constructed.",
    audience: "Clinical desk supervisors and central management, in use 24/7.",
    technical: [
      "DirectQuery at 60-second refresh — no import-mode latency or scheduled refresh dependency",
      "MPDS priority sort derived from a hardcoded inline lookup (no reference table existed in the source system)",
      "Active vs. Waiting status logic built from multi-condition CASE expressions across two CAD event tables",
      "Specialist Desk queue added post-launch, requiring a new CAD marker, additional SQL branch, and dashboard restructure",
      "Vendor collaboration required to confirm CAD parameter behaviour before production deployment",
    ],
  },
  {
    id: "ems",
    title: "EMS Clinical Flow",
    tags: ["New Methodology", "ETL Pipeline"],
    domain: "Emergency Medical Services",
    accent: "#B84A0E",
    accentLight: "#FDF1EC",
    image: null,
    problem:
      "No report existed to track a 999 call as it moved through the clinical queue — from initial screening through specialist escalation to closure. Clinical managers could not determine whether call types had predictable outcomes or identify where flow was breaking down.",
    built:
      "The organisation's first end-to-end clinical flow report, covering call entry, level transitions, clinician activity, and final disposition. The underlying ETL — new stored procedures and materialised tables replacing an unreliable event stream — became the data foundation for almost all subsequent clinical performance reporting at WAST.",
    audience: "Clinical leadership, senior operations team.",
    technical: [
      "New SQL tables built to materialise and clean the CAD level-change event stream",
      "Incremental 7-day MERGE load; TRUNCATE used for reference data layers",
      "Clinician-level event identification required deep understanding of CAD audit table structure",
      "Influenced clinical management policy for 999 call handling across the organisation",
      "ETL architecture subsequently reused by Screening Flow, Falls Desk, and Urgent Community Response reports",
    ],
  },
  {
    id: "screening",
    title: "Screening Flow",
    tags: ["Clinical KPI", "Process Analysis"],
    domain: "Clinical Contact Centre",
    accent: "#3D2FA0",
    accentLight: "#EFEDFA",
    image: null,
    problem:
      "Clinical screening — the first stage of a 999 call — was a new process introduced without a performance baseline or any reporting. Leadership needed to understand throughput, duration, and outcome patterns from day one of go-live.",
    built:
      "A dedicated screening flow dashboard built on the clinical level event infrastructure developed for EMS Clinical Flow, adapted for the screening stage. Enabled leadership to observe how volume, speed, and outcomes varied by call type, time of day, and clinician — establishing the first performance baseline for the process.",
    audience: "Clinical leaders, senior operations team.",
    technical: [
      "Extended and reused the EMS_CSD_Audit_Level_Changes table from the EMS Clinical Flow build",
      "Screening-specific KPIs: Time to Start Triage Protocol, Screening Duration, outcome classification",
      "Percentile and median DAX measures for distribution analysis across clinician cohorts",
      "Page-level filter indicator pattern to surface active filter state without cluttering the canvas",
      "Visual design and semantic model aligned to the existing clinical dashboard suite",
    ],
  },
];

function Tag({ label, accent, accentLight, neutral }) {
  return (
    <span style={{
      fontFamily: "'Lato', sans-serif",
      fontSize: "0.62rem",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: neutral ? "#9AA0A6" : accent,
      background: neutral ? "#F4F4F0" : accentLight,
      border: `1px solid ${neutral ? "#E2E4DC" : accent + "30"}`,
      borderRadius: 3,
      padding: "4px 10px",
      display: "inline-block",
    }}>
      {label}
    </span>
  );
}

function SectionLabel({ text }) {
  return (
    <p style={{
      fontFamily: "'Lato', sans-serif",
      fontSize: "0.62rem",
      fontWeight: 700,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#B0B8C1",
      marginBottom: 12,
    }}>
      {text}
    </p>
  );
}

function Screenshot({ project }) {
  if (project.image) {
    return (
      <img
        src={`/images/${project.image}`}
        alt={project.title}
        style={{
          width: "100%",
          borderRadius: 6,
          border: "1px solid #E2E4DC",
          display: "block",
          marginBottom: 44,
        }}
      />
    );
  }
  return (
    <div style={{
      background: "#F4F4F0",
      border: "1px solid #E2E4DC",
      borderRadius: 6,
      height: 260,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 44,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle at 30% 50%, ${project.accentLight} 0%, transparent 60%)`,
      }} />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: project.accentLight,
          border: `1px solid ${project.accent}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px", fontSize: "1.1rem",
        }}>📊</div>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#B0B8C1",
        }}>
          Screenshot · {project.title}
        </p>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("csd");
  const p = projects.find((x) => x.id === active);

  return (
    <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", background: "#FAFAF8", minHeight: "100vh", color: "#1A2640" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; }
      `}</style>

      <header style={{
        background: "#fff", borderBottom: "1px solid #E2E4DC",
        padding: "36px 56px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        flexWrap: "wrap", gap: 24,
      }}>
        <div>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9AA0A6", marginBottom: 10 }}>
            Power BI · SQL Server · NHS
          </p>
          <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.1, color: "#1A2640", letterSpacing: "-0.02em" }}>
            Stephen Clinton
          </h1>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.95rem", color: "#6B7280", marginTop: 6, fontWeight: 300 }}>
            Senior Power BI Developer &amp; SQL Data Engineer
          </p>
        </div>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.72rem", color: "#B0B8C1", textAlign: "right", lineHeight: 1.9 }}>
          <div style={{ fontWeight: 700, color: "#9AA0A6" }}>Welsh Ambulance Services NHS Trust</div>
          <div>Selected portfolio · 2024 / 2025</div>
        </div>
      </header>

      <nav style={{ background: "#fff", borderBottom: "1px solid #E2E4DC", padding: "0 56px", display: "flex", overflowX: "auto" }}>
        {projects.map((proj) => (
          <button key={proj.id} onClick={() => setActive(proj.id)} style={{
            background: "transparent", border: "none",
            borderBottom: active === proj.id ? `3px solid ${proj.accent}` : "3px solid transparent",
            color: active === proj.id ? "#1A2640" : "#9AA0A6",
            fontFamily: "'Lato', sans-serif", fontSize: "0.82rem",
            fontWeight: active === proj.id ? 700 : 400,
            padding: "16px 28px", whiteSpace: "nowrap", marginBottom: "-1px",
            transition: "color 0.2s, border-color 0.2s",
          }}>
            {proj.title}
          </button>
        ))}
      </nav>

      <main style={{ display: "grid", gridTemplateColumns: "1fr 320px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ padding: "48px 56px 64px", borderRight: "1px solid #E2E4DC" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {p.tags.map((tag, i) => <Tag key={i} label={tag} accent={p.accent} accentLight={p.accentLight} />)}
            <Tag label={p.domain} neutral />
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#1A2640", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 10 }}>
            {p.title}
          </h2>
          <div style={{ height: 3, width: 48, background: p.accent, borderRadius: 2, marginBottom: 36 }} />
          <Screenshot project={p} />
          <div style={{ marginBottom: 32 }}>
            <SectionLabel text="The Problem" />
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", fontSize: "1rem", lineHeight: 1.75, color: "#374151" }}>{p.problem}</p>
          </div>
          <div>
            <SectionLabel text="What Was Built" />
            <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.8, color: "#4B5563" }}>{p.built}</p>
          </div>
        </div>

        <div style={{ padding: "48px 40px 64px" }}>
          <SectionLabel text="Audience" />
          <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", fontSize: "0.88rem", lineHeight: 1.7, color: "#6B7280", paddingBottom: 32, marginBottom: 32, borderBottom: "1px solid #E2E4DC" }}>
            {p.audience}
          </p>
          <SectionLabel text="Technical Detail" />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {p.technical.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 6px", borderRadius: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.accent, marginTop: 6, flexShrink: 0 }} />
                <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: "0.8rem", lineHeight: 1.65, color: "#6B7280" }}>{item}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, height: 2, background: `linear-gradient(90deg, ${p.accent}50, transparent)`, borderRadius: 1 }} />
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #E2E4DC", padding: "24px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: "#fff" }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.7rem", color: "#C5CAD0" }}>Stephen Clinton · Senior Power BI Developer</p>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.7rem", color: "#C5CAD0" }}>Welsh Ambulance Services NHS Trust · 2024–2025</p>
      </footer>
    </div>
  );
}
