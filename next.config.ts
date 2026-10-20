import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/refund-cancellation", destination: "/refund-policy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
    ];
  },
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
