/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  plugins: ["@typescript-eslint", "unused-imports"],
  extends: ["plugin:@typescript-eslint/recommended", "prettier", "turbo"],
  rules: {
    "no-console": "off",
    "prefer-const": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
  },
  ignorePatterns: ["node_modules", "dist", "coverage"],
};
