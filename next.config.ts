import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Optimize for production
  poweredByHeader: false,
  // Experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
};

export default nextConfig;
