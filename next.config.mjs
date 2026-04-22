/** @type {import('next').NextConfig} */
const nextConfig = {
  // Single `node` process deploy (cPanel, VPS, etc.) — produces `.next/standalone`.
  // Plain JS so `next build` does not require the `typescript` package in production installs.
  output: "standalone",
};

export default nextConfig;
