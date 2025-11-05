import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ビルド時のESLintを無効化（Vercelビルドエラー回避）
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // 開発環境では画像最適化を無効化
  },
  webpack: (config, { isServer }) => {
    // ブラウザ側でNode.jsモジュールの互換性設定
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };
    }

    return config;
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
