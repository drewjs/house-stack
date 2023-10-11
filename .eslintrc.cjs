/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    '@remix-run/eslint-config/jest-testing-library',
  ],
  plugins: ['prefer-let'],
  rules: {
    'prefer-let/prefer-let': 'error',
  },
  settings: {
    jest: {
      version: 28,
    },
  },
}
