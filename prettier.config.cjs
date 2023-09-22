/** @type {import('prettier').Config} */
module.exports = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-solidity",
  ],
  printWidth: 80,
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  bracketSpacing: true,
  importOrder: [
    "<BUILTIN_MODULES>",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    // external packages
    "<THIRD_PARTY_MODULES>",
    // our packages
    "^@donum",
    // project root relative packages
    "^~/",
    // relative
    "^(?!.*.s?css$)(?!\\.\\/)(\\.\\.\\/.*$|\\.\\.$)", // Matches parent directory paths, e.g. "../Foo", or "../../Foo". or ".."
    "^(?!.*.s?css$)(\\.\\/.*$|\\.$)", // Matches sibling directory paths, e.g. "./Foo" or ".",
    ".*\\.s?css$", // (S)CSS imports. Note: This must be last to ensure predictable styling.
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.2.2",
};
