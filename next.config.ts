import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    PORT: "3001"
  },
  // Ensure basePath is not set if you're not serving from a subdirectory
  // basePath: "",
};

export default nextConfig;
