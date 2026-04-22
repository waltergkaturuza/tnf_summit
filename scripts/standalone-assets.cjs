/**
 * After `next build` with `output: "standalone"`, copy `public` and `.next/static`
 * into `.next/standalone` so the Node server can serve them.
 * Run: node scripts/standalone-assets.cjs
 */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  console.warn("[standalone-assets] .next/standalone not found — run `npm run build` first.");
  process.exit(0);
}

const publicSrc = path.join(root, "public");
if (fs.existsSync(publicSrc)) {
  const publicDest = path.join(standalone, "public");
  fs.rmSync(publicDest, { recursive: true, force: true });
  fs.cpSync(publicSrc, publicDest, { recursive: true });
  console.log("[standalone-assets] copied public/ → .next/standalone/public/");
} else {
  console.warn("[standalone-assets] no public/ directory, skipping");
}

const staticSrc = path.join(root, ".next", "static");
if (fs.existsSync(staticSrc)) {
  const staticDest = path.join(standalone, ".next", "static");
  fs.mkdirSync(path.join(standalone, ".next"), { recursive: true });
  fs.rmSync(staticDest, { recursive: true, force: true });
  fs.cpSync(staticSrc, staticDest, { recursive: true });
  console.log("[standalone-assets] copied .next/static/ → .next/standalone/.next/static/");
} else {
  console.warn("[standalone-assets] no .next/static, skipping (run `npm run build` first)");
}
