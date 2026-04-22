/**
 * OFFLINE cPanel deploy (run on your PC, GitHub Actions, or any machine with Node):
 * 1) npm ci
 * 2) npm run build
 * 3) node scripts/package-cpanel-deploy.cjs   (or: npm run pack:cpanel)
 * 4) Upload cpanel-standalone-upload.zip to cPanel; extract into .next/standalone/
 *
 * Do NOT run this on cPanel – shared hosting has no `npm` in the default shell and
 * may not be able to build. If you must run a Node tool on cPanel, use the full
 * venv path, e.g.: ~/nodevenv/tnf_summit/20/bin/npm
 */

const fs = require("fs");
const path = require("path");
const { execFileSync, execSync, spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");
const outZip = path.join(root, "cpanel-standalone-upload.zip");

function findStandaloneEntry(standalone) {
  for (const name of ["server.js", "server.mjs", "server.cjs"]) {
    const p = path.join(standalone, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function main() {
  const entry = findStandaloneEntry(standalone);
  if (!entry) {
    console.error("Missing Next standalone server in .next/standalone/ (expected server.js) — run: npm run build");
    process.exit(1);
  }
  console.log("Using: " + path.relative(root, entry));

  if (fs.existsSync(outZip)) {
    fs.unlinkSync(outZip);
  }

  if (process.platform === "win32") {
    const relStand = path.relative(root, standalone).replace(/\\/g, "/");
    const relOut = path.relative(root, outZip).replace(/\\/g, "/");
    const ps = [
      "Set-Location -LiteralPath $root",
      "$stand = Join-Path $root '" + relStand + "'",
      "$out  = Join-Path $root '" + relOut + "'",
      "Get-ChildItem -LiteralPath $stand | Compress-Archive -DestinationPath $out -CompressionLevel Fastest -Force",
    ].join("; ");
    const r = spawnSync(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", `$root = '${root.replace(/'/g, "''")}'; ${ps}`],
      { stdio: "inherit" }
    );
    if (r.status !== 0) process.exit(r.status === null ? 1 : r.status);
  } else {
    try {
      execSync(`cd "${standalone}" && zip -r -q "${outZip}" .`, { stdio: "inherit" });
    } catch {
      try {
        execFileSync("zip", ["-r", "-q", outZip, "."], { cwd: standalone, stdio: "inherit" });
      } catch (e) {
        console.error("zip not found. Install zip, or on Windows use Node from a PowerShell environment.");
        console.error(e);
        process.exit(1);
      }
    }
  }

  const stat = fs.statSync(outZip);
  console.log("\n=== Created: " + outZip);
  console.log("Size: " + (stat.size / 1024 / 1024).toFixed(1) + " MB\n");
  printInstructions();
}

function printInstructions() {
  const base = "tnf_summit";
  const remotePath = `~/${base}/.next/standalone/`;
  console.log("=== Upload to cPanel (offline deploy, no build on server) ===\n");
  console.log("1. In File Manager (or SFTP), go to: " + remotePath.replace("~", "/home/USERNAME"));
  console.log("2. Back up the existing `standalone` folder if you want, then delete its contents.");
  console.log("3. Upload and extract `cpanel-standalone-upload.zip` **into** `.next/standalone/`");
  console.log("   so `server.js` ends up at: .../tnf_summit/.next/standalone/server.js\n");
  console.log("4. cPanel → Setup Node.js App:");
  console.log("   - Application root:  " + base);
  console.log("   - Startup file:     .next/standalone/server.js");
  console.log("   - Or root = " + base + "/.next/standalone  and  Startup = server.js\n");
  console.log("5. Set env vars in the app (Supabase, NEXT_PUBLIC_SITE_URL, IVERI_*, etc.).");
  console.log("6. Restart the Node app. You do not need to run `npm run build` on the server.\n");
}

main();
