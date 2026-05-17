import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-926ed65dd91042b6b22b5febad36316f.r2.dev",
        pathname: "/**",
      },
      // Add custom domain here when you set one up, e.g.:
      // { protocol: "https", hostname: "images.antoinecancook.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
