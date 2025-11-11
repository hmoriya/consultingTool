import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLintを有効化（主要なエラーは修正済み）
    ignoreDuringBuilds: false,
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development', // 本番では最適化有効
    domains: ['localhost'], // 必要なドメインを追加
  },
  
  // Vercel最適化設定
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@prisma/client', 'lucide-react'],
  },
  
  // パフォーマンス最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
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
