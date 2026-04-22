import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Single `node` process deploy (cPanel, VPS, etc.) — produces `.next/standalone`.
  // Plain JS so `next build` does not require the `typescript` package in production installs.
  output: "standalone",
  // Parent folders may contain another package-lock.json; without this, Next can infer
  // the wrong workspace root and omit or misplace `.next/standalone/server.js`.
  outputFileTracingRoot: __dirname,

  // cPanel/CloudLinux: avoid pthread / process limit exhaustion (SIGABRT) on `next build`
  experimental: {
    // One worker for static generation: fewer child processes
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 1000,
  },

  webpack: (config) => {
    if (config.parallelism !== 0) config.parallelism = 1;
    // Explicit @ → src (some Linux/cPanel + symlinked node_modules breaks tsconfig paths only)
    const src = path.join(__dirname, "src");
    config.resolve = config.resolve ?? {};
    const prev = config.resolve.alias;
    config.resolve.alias =
      Array.isArray(prev)
        ? [...prev, { name: "@", alias: src }]
        : { ...(prev && typeof prev === "object" ? prev : {}), "@": src };
    return config;
  },
};

export default nextConfig;
