/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  plugins: ["solid"],
  extends: ["@donum/custom", "plugin:solid/typescript"],
  env: {
    browser: true,
  },
};
