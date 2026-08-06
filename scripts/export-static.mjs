import { cp, mkdtemp, rename, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const project = process.cwd();
const generatedAssets = resolve(project, "public/_next");
const temporaryDirectory = await mkdtemp(join(tmpdir(), "mapleintel-export-"));
const assetBackup = join(temporaryDirectory, "_next");
let hadGeneratedAssets = false;
const managedRoutes = [
  "about",
  "case-studies",
  "contact",
  "portfolio",
  "services",
  "_not-found",
];
const routeBackups = [];

try {
  try {
    await rename(generatedAssets, assetBackup);
    hadGeneratedAssets = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  for (const route of managedRoutes) {
    const source = resolve(project, "public", route);
    const backup = join(temporaryDirectory, route);
    try {
      await rename(source, backup);
      routeBackups.push({ source, backup });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  const build = spawnSync(
    process.execPath,
    [resolve(project, "node_modules/next/dist/bin/next"), "build"],
    { cwd: project, stdio: "inherit" },
  );

  if (build.status !== 0) {
    throw new Error(`Static export failed with status ${build.status}`);
  }

  await cp(resolve(project, "out"), resolve(project, "public"), {
    recursive: true,
    force: true,
  });
} catch (error) {
  if (hadGeneratedAssets) {
    await rm(generatedAssets, { recursive: true, force: true });
    await rename(assetBackup, generatedAssets);
  }
  for (const { source, backup } of routeBackups) {
    await rm(source, { recursive: true, force: true });
    await rename(backup, source);
  }
  throw error;
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
