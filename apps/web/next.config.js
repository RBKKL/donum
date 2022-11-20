/* eslint-disable @typescript-eslint/no-var-requires */
// fix for https://github.com/vercel/turbo/issues/665

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enables hot-reload and easy integration for local packages
    transpilePackages: ["@donum/contracts", "@donum/shared", "@donum/prisma"],
  },
  // We already do linting on GH actions
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
  images: {
    domains: ["localhost"],
  },
};
