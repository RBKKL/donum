/* eslint-disable @typescript-eslint/no-var-requires */
// fix for https://github.com/vercel/turbo/issues/665
const withTM = require("next-transpile-modules")(["contracts"]);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withTM(config);
