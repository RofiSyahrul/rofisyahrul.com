/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    '@remix-run/eslint-config',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    node: true,
  },
  plugins: ['prettier', 'import'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            group: 'external',
            pattern: '{react,react-dom/**,react-dom}',
            position: 'before',
          },
          {
            pattern: '~/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/prefer-default-export': 0,
    'prettier/prettier': ['error'],
  },
};
