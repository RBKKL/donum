/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "@donum/custom"],
  env: {
    browser: true,
  },
};
