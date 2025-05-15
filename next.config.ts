import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["cdn.shopify.com", "img.thesitebase.net", "localhost"], // 👈 Thêm Shopify CDN vào đây
  },
  output: "standalone",
  i18n: {
    locales: ["en", "sv"],
    defaultLocale: "en",
  },
};

export default nextConfig;
