import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`https://mapleintel.uk${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the consultancy home page", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Operational analytics for services where/);
  assert.match(html, /View selected work/);
  assert.match(html, /Evidence, not broad claims/);
  assert.doesNotMatch(html, /codex-preview/);
});

test("renders the portfolio and a complete case study", async () => {
  const portfolio = await render("/portfolio");
  assert.equal(portfolio.status, 200);
  assert.match(await portfolio.text(), /From difficult operational data/);

  const study = await render("/portfolio/clinical-queue-intelligence");
  assert.equal(study.status, 200);
  const html = await study.text();
  assert.match(html, /Reconstructing a live clinical queue/);
  assert.match(html, /The challenge/);
  assert.match(html, /Technical evidence/);
});

test("retains original portfolio and calculators as static resources", async () => {
  await Promise.all([
    access(new URL("../dist/client/portfolio-original/index.html", import.meta.url)),
    access(new URL("../dist/client/rate-calculator.html", import.meta.url)),
    access(new URL("../dist/client/non-nhs/index.html", import.meta.url)),
  ]);

  const archived = await readFile(
    new URL("../dist/client/portfolio-original/index.html", import.meta.url),
    "utf8",
  );
  assert.match(archived, /Power BI/);
});
