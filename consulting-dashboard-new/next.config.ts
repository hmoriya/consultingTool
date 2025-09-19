import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // 開発環境では画像最適化を無効化
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/Client',
        destination: '/dashboard/client',
      },
      {
        source: '/dashboard/Executive',
        destination: '/dashboard/executive',
      },
      {
        source: '/dashboard/PM',
        destination: '/dashboard/pm',
      },
      {
        source: '/dashboard/Consultant',
        destination: '/dashboard/consultant',
      },
    ]
  },
};

export default nextConfig;
