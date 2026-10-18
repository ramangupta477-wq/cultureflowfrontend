import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/about",
        destination: "/about-us",
      },
      {
        source: "/about%20us",
        destination: "/about-us",
      },
    ];
  },
};

export default nextConfig;
