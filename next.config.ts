import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* reactStrictMode: false, */
  images: {
    domains: ["nextui.org","picsum.photos"], // Add all the external domains you want to allow
  }
};

export default nextConfig;
