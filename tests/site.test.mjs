import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function rendered(pathname) {
  const file =
    pathname === "/" ? "../out/index.html" : "../out" + pathname + "/index.html";
  return readFile(new URL(file, import.meta.url), "utf8");
}

test("renders one public, company-focused landing page", async () => {
  const html = await rendered("/");

  assert.match(html, /See the operational picture/);
  assert.match(html, /What Maple Leaf does/);
  assert.match(html, /organisation&#x27;s challenge/);
  assert.match(html, /Operational problems, resolved in practice/);
  assert.match(html, /name="robots" content="index, follow"/);
  assert.doesNotMatch(html, /Private preview/);
  assert.doesNotMatch(html, /About Stephen/);
  assert.doesNotMatch(html, /href="\/about/);
  assert.doesNotMatch(html, /href="\/portfolio/);
});

test("links to three one-page case-study PDFs", async () => {
  const html = await rendered("/");
  const files = [
    "clinical-queue-intelligence-case-study.pdf",
    "telephony-demand-workforce-case-study.pdf",
    "waiting-time-kpi-case-study.pdf",
  ];

  for (const filename of files) {
    assert.match(html, new RegExp("/downloads/" + filename));
    const pdf = await readFile(
      new URL("../out/downloads/" + filename, import.meta.url),
    );
    assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
  }
});

test("does not export the retired website routes", async () => {
  await Promise.all(
    ["/about", "/contact", "/portfolio", "/services"].map((pathname) =>
      assert.rejects(() => rendered(pathname)),
    ),
  );
});

test("retains the archive and standalone public tools", async () => {
  await Promise.all([
    access(new URL("../out/portfolio-original/index.html", import.meta.url)),
    access(new URL("../out/rate-calculator.html", import.meta.url)),
    access(new URL("../out/non-nhs/index.html", import.meta.url)),
    access(new URL("../out/simkltv/index.html", import.meta.url)),
  ]);

  const archived = await readFile(
    new URL("../out/portfolio-original/index.html", import.meta.url),
    "utf8",
  );
  assert.match(archived, /Power BI/);
});
