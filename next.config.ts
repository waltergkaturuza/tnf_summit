import type { NextConfig } from "next";

/** Single `node` process deploy (cPanel, VPS, etc.) — produces `.next/standalone`. */
const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
