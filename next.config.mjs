import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Parent repo may have extra lockfiles; pin the app root for Turbopack (dev + build).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
