const anchorScrollOffset = 112;

function scrollToSection(hash, updateHistory = true) {
  const target = document.querySelector(hash);
  if (!target) return;

  const targetTop = target.getBoundingClientRect().top + window.pageYOffset - anchorScrollOffset;
  window.scrollTo({ top: targetTop, behavior: "smooth" });

  if (updateHistory) {
    history.pushState(null, "", hash);
  }
}

const siteNavSections = [
  {
    title: "Power BI Reports",
    href: "index.html",
    ariaLabel: "Power BI reports",
    items: [
      {
        id: "telephony-demand-agent-activity",
        title: "Telephony & Agent Activity",
        href: "telephony-demand-agent-activity.html",
        sublistLabel: "Telephony page contents",
        links: [
          ["What I did", "#what-i-did"],
          ["Context", "#context"],
          ["Data model", "#data-model"],
          ["Report design", "#report-design"],
          ["Outcome and usage", "#outcome-and-usage"],
          ["Additional screenshots", "#additional-screenshots"]
        ]
      },
      {
        id: "real-time-queue-monitoring",
        title: "Real-Time Queue Monitoring",
        href: "real-time-queue-monitoring.html",
        sublistLabel: "Wallboard page contents",
        links: [
          ["What I did", "#what-i-did"],
          ["Context", "#context"],
          ["Data model", "#data-model"],
          ["Power BI design", "#power-bi-design"],
          ["Outcome", "#outcome"]
        ]
      },
      {
        id: "call-flow-analysis",
        title: "Case Flow Analysis",
        href: "call-flow-analysis.html",
        sublistLabel: "Case Flow page contents",
        links: [
          ["What I did", "#what-i-did"],
          ["Context", "#context"],
          ["Data model", "#data-model"],
          ["Report design", "#report-design"],
          ["Outcome", "#outcome"]
        ]
      }
    ]
  },
  {
    title: "Analytics Engineering",
    href: "analytics-engineering.html",
    ariaLabel: "Analytics engineering studies",
    items: [
      {
        id: "cisco-telephony-analytics-engineering",
        title: "Cisco Telephony",
        href: "cisco-telephony-analytics-engineering.html",
        sublistLabel: "Cisco telephony page contents",
        links: [
          ["Context", "#context"],
          ["What I did", "#what-i-did"],
          ["Data engineering process", "#data-engineering-process"],
          ["Outcome", "#outcome"]
        ]
      },
      {
        id: "questionnaire-analytics-engineering",
        title: "Questionnaire Responses",
        href: "questionnaire-analytics-engineering.html",
        sublistLabel: "Questionnaire analytics page contents",
        links: [
          ["Context", "#context"],
          ["What I did", "#what-i-did"],
          ["Data engineering process", "#data-engineering-process"],
          ["Output model", "#output-model"],
          ["Outcome", "#outcome"]
        ]
      },
      {
        id: "clinical-queue-activity-monitoring-engineering",
        title: "Queue Activity",
        href: "clinical-queue-activity-monitoring-engineering.html",
        sublistLabel: "Queue activity page contents",
        links: [
          ["Context", "#context"],
          ["What I did", "#what-i-did"],
          ["Data engineering process", "#data-engineering-process"],
          ["Output model", "#output-model"],
          ["Outcome", "#outcome"]
        ]
      }
    ]
  }
];

function createSublist(item) {
  const sublist = document.createElement("ul");
  sublist.className = "side-nav-sublist";
  sublist.setAttribute("aria-label", item.sublistLabel);

  item.links.forEach(([label, href]) => {
    const entry = document.createElement("li");
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToSection(href);
    });
    entry.appendChild(link);
    sublist.appendChild(entry);
  });

  return sublist;
}

function createNavItem(item, currentPage) {
  const entry = document.createElement("li");

  if (item.id === currentPage) {
    const current = document.createElement("span");
    current.className = "side-nav-current";
    current.textContent = item.title;
    entry.appendChild(current);
    if (item.links && item.links.length) entry.appendChild(createSublist(item));
    return entry;
  }

  const link = document.createElement("a");
  link.href = item.href;
  link.textContent = item.title;
  entry.appendChild(link);
  return entry;
}

function renderSiteNav(container) {
  const currentPage = container.dataset.currentPage;
  container.setAttribute("aria-label", "Portfolio structure");

  siteNavSections.forEach((section) => {
    const nav = document.createElement("nav");
    nav.className = "side-nav-group";
    nav.setAttribute("aria-label", section.ariaLabel);

    const title = document.createElement("a");
    title.className = "side-nav-title";
    title.href = section.href;
    title.textContent = section.title;
    nav.appendChild(title);

    const list = document.createElement("ul");
    list.className = "side-nav-list";
    section.items.forEach((item) => list.appendChild(createNavItem(item, currentPage)));
    nav.appendChild(list);
    container.appendChild(nav);
  });
}

document.querySelectorAll("[data-site-nav]").forEach(renderSiteNav);

if (window.location.hash) {
  window.addEventListener("load", () => {
    scrollToSection(window.location.hash, false);
  });
}

function formatReturnText(text) {
  return text.startsWith("\u2190") ? text : `\u2190 ${text}`;
}

document.querySelectorAll("[data-return-link]").forEach((link) => {
  const defaultHref = link.dataset.defaultHref || "analytics-engineering.html";
  const defaultText = link.dataset.defaultText || "Return to Analytics Engineering";
  const sourcePage = new URLSearchParams(window.location.search).get("from");

  link.href = defaultHref;
  link.textContent = formatReturnText(defaultText);

  if (sourcePage && sourcePage === link.dataset.sourcePage) {
    link.href = link.dataset.referrerHref;
    link.textContent = formatReturnText(link.dataset.referrerText);
  }
});
