/** @type {import('next').NextConfig} */
const nextConfig = {
  // Single `node` process deploy (cPanel, VPS, etc.) — produces `.next/standalone`.
  // Plain JS so `next build` does not require the `typescript` package in production installs.
  output: "standalone",

  // cPanel/CloudLinux: avoid pthread / process limit exhaustion (SIGABRT) on `next build`
  experimental: {
    // One worker for static generation: fewer child processes
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 1000,
  },

  webpack: (config) => {
    if (config.parallelism !== 0) config.parallelism = 1;
    return config;
  },
};

export default nextConfig;
