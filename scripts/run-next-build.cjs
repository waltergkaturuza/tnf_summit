/**
 * cPanel / shared hosting: SWC (Rust) uses Rayon. Low nproc/thread limits can cause:
 *   ThreadPoolBuildError ... Resource temporarily unavailable (EAGAIN)
 * Default RAYON_NUM_THREADS=1 keeps the global pool small.
 * Override: RAYON_NUM_THREADS=2 npm run build
 */
const { spawnSync } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const nextBin = require.resolve("next/dist/bin/next");

if (process.env.RAYON_NUM_THREADS === undefined || process.env.RAYON_NUM_THREADS === "") {
  process.env.RAYON_NUM_THREADS = "1";
}

const result = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
});

const code = result.status;
process.exit(code === null ? 1 : code);
