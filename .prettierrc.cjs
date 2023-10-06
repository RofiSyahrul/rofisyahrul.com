/** @type {import('prettier').Options} */
module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 70,
  arrowParens: 'avoid',
  useTabs: false,
  tabWidth: 2,
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
        singleQuote: true,
        jsxSingleQuote: true,
      },
    },
  ],
  plugins: [
    require.resolve('prettier-plugin-astro'),
    require.resolve('prettier-plugin-svelte'),
  ],
};
