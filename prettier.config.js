/** @type {import('prettier').Config} */
module.exports = {
  plugins: [
    require("prettier-plugin-tailwindcss"),
    require("prettier-plugin-solidity"),
  ],
  printWidth: 80,
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  bracketSpacing: true,
};
