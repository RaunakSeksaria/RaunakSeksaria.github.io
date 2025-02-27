import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: "out", // Ensures build output goes to 'out'
  /* config options here */
};

module.exports = nextConfig
export default nextConfig;
