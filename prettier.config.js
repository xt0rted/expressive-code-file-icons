/** @type {import("prettier").Config} */
export default {
  printWidth: 120,
  proseWrap: "preserve",
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  htmlWhitespaceSensitivity: "css",
  endOfLine: "auto",
  plugins: ["prettier-plugin-packagejson"],
};
