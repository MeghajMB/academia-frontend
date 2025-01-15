import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* reactStrictMode: false, */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nextui.org', 
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', 
      },
    ],
  }
  
};

export default nextConfig;
