import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, "..");
const repoRoot = resolve(appRoot, "..", "..");

const sourcePath = resolve(
  repoRoot,
  ".plans",
  "20260430-cargo-order-admin",
  "wireframes",
  "final-handoff",
  "baseline",
  "html",
  "cargo-order-admin-hifi-master.html"
);
const targetPath = resolve(appRoot, "index.html");

async function sha256(path) {
  const content = await readFile(path);
  return createHash("sha256").update(content).digest("hex");
}

await stat(sourcePath);
await mkdir(appRoot, { recursive: true });
await copyFile(sourcePath, targetPath);

const [sourceHash, targetHash] = await Promise.all([
  sha256(sourcePath),
  sha256(targetPath)
]);

if (sourceHash !== targetHash) {
  throw new Error("Copied file hash mismatch.");
}

console.log(JSON.stringify({
  copied: true,
  sourcePath,
  targetPath,
  bytes: (await stat(targetPath)).size,
  sha256: targetHash
}, null, 2));
