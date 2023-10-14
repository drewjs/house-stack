/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
module.exports = {
  arrowParens: 'avoid',
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  useTabs: false,
  importOrder: ['<THIRD_PARTY_MODULES>', '', '^~/(.*)$', '', '^[.]'],
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
}
