import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    ...(isDev ? { unoptimized: true } : {}),
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "strapi-project-gray.vercel.app",
        port: "443",
      },
    ],
  },
};

export default nextConfig;
