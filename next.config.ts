import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: false, // ⛔ تعطيل Turbopack نهائيًا
  },
};

export default nextConfig;
