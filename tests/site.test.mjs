import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function rendered(pathname) {
  const file =
    pathname === "/" ? "../out/index.html" : `../out${pathname}/index.html`;
  return readFile(new URL(file, import.meta.url), "utf8");
}

test("renders the consultancy home page", async () => {
  const html = await rendered("/");
  assert.match(html, /Operational analytics for services where/);
  assert.match(html, /View selected work/);
  assert.match(html, /Evidence, not broad claims/);
  assert.doesNotMatch(html, /codex-preview/);
});

test("renders the portfolio and a complete case study", async () => {
  const portfolio = await rendered("/portfolio");
  assert.match(portfolio, /From difficult operational data/);

  const html = await rendered("/portfolio/clinical-queue-intelligence");
  assert.match(html, /Reconstructing a live clinical queue/);
  assert.match(html, /The challenge/);
  assert.match(html, /Technical evidence/);
});

test("retains original portfolio and calculators as static resources", async () => {
  await Promise.all([
    access(new URL("../out/portfolio-original/index.html", import.meta.url)),
    access(new URL("../out/rate-calculator.html", import.meta.url)),
    access(new URL("../out/non-nhs/index.html", import.meta.url)),
  ]);

  const archived = await readFile(
    new URL("../out/portfolio-original/index.html", import.meta.url),
    "utf8",
  );
  assert.match(archived, /Power BI/);
});
