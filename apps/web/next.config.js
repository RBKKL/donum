/* eslint-disable @typescript-eslint/no-var-requires */
// fix for https://github.com/vercel/turbo/issues/665

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  // Enables hot-reload and easy integration for local packages
  transpilePackages: ["@donum/contracts", "@donum/shared", "@donum/prisma"],
  // We already do linting on GH actions
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
  images: {
    domains: ["localhost", "bvizuwjbhqlyqyoggyys.supabase.co"],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};
