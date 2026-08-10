import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function rendered(pathname) {
  const file =
    pathname === "/" ? "../out/index.html" : "../out" + pathname + "/index.html";
  return readFile(new URL(file, import.meta.url), "utf8");
}

test("renders the public, company-focused landing page", async () => {
  const html = await rendered("/");

  assert.match(html, /Intelligent reporting for NHS operations/);
  assert.match(html, /What Maple Leaf does/);
  assert.match(html, /Reporting shaped around operational requirements/);
  assert.match(html, /Examples of reporting in operational use/);
  assert.match(html, /Reporting organised around operational questions/);
  assert.match(html, /We combine operational understanding/);
  assert.match(html, /how demand moves through the service/);
  assert.match(html, /How is demand moving through pathways and teams/);
  assert.match(html, /enquiry@mapleintel\.uk/);
  assert.match(html, /emergency-department-ambulance-pressure\.png/);
  assert.match(html, /emergency-operations-control-room\.png/);
  assert.match(html, /class="hero-stage"/);
  assert.match(html, /class="hero__panel"/);
  assert.match(html, /class="reporting-summary"/);
  assert.match(html, /class="questions-section__background"/);
  assert.match(html, /class="process-flow"/);
  assert.match(html, /name="robots" content="index, follow"/);
  assert.doesNotMatch(html, /Private preview/);
  assert.doesNotMatch(html, /About Stephen/);
  assert.doesNotMatch(html, /href="\/about/);
  assert.doesNotMatch(html, /href="\/portfolio/);
  assert.doesNotMatch(html, /\.pdf/);
  assert.doesNotMatch(html, /stephen@mapleintel\.uk/);
  assert.doesNotMatch(html, /health-service/i);
  assert.doesNotMatch(html, /Please do not include/);
  assert.doesNotMatch(html, /class="reporting-feature"/);
  assert.doesNotMatch(html, /clinical-information-review\.jpg/);
  assert.doesNotMatch(html, /screenshots\/kpi\.png/);
  assert.doesNotMatch(html, /screenshots\/queue-wallboard\.png/);
  assert.doesNotMatch(html, /screenshots\/agent-summary\.png/);
});

test("links to three concise web case studies", async () => {
  const cases = [
    ["clinical-queue-intelligence", "Continuous operational use"],
    ["telephony-demand-workforce", "2.5m calls represented annually"],
    ["waiting-time-kpi", "One documented definition"],
  ];
  const home = await rendered("/");

  for (const [slug, outcome] of cases) {
    assert.match(home, new RegExp("/case-studies/" + slug + "/"));
    const html = await rendered("/case-studies/" + slug);
    assert.match(html, /The reporting need/);
    assert.match(html, /Work undertaken/);
    assert.match(html, /Operational use/);
    assert.match(html, /enquiry@mapleintel\.uk/);
    assert.match(html, new RegExp(outcome));
  }
});

test("does not export the retired website routes", async () => {
  await Promise.all(
    ["/about", "/contact", "/portfolio", "/services"].map((pathname) =>
      assert.rejects(() => rendered(pathname)),
    ),
  );
});
