/** @type {import("prettier").Options} */
module.exports = {
  arrowParens: 'avoid',
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  useTabs: false,
  importOrder: ['<THIRD_PARTY_MODULES>', '^~/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
}
