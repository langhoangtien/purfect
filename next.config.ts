import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["cdn.shopify.com", "img.thesitebase.net"], // 👈 Thêm Shopify CDN vào đây
  },
  output: "standalone",
};

export default nextConfig;
