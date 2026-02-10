import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  turbopack: {
    root: dirname,
  },
} as NextConfig;

export default nextConfig;
