import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  logging: {
    fetches: {
      fullUrl: true,
    },
    browserToTerminal: true,
  },
};

export default nextConfig;
