/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@remix-run/eslint-config',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', 'import-alias'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    'import-alias/import-alias': [
      'error',
      {
        relativeDepth: 1,
      },
    ],
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        groups: ['builtin', 'external', 'internal'],
        'newlines-between': 'always',
        pathGroups: [
          {
            group: 'external',
            pattern: '{react,react-dom/**,react-dom}',
            position: 'before',
          },
          {
            group: 'external',
            pattern: '~/**',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
      },
    ],
    'import/prefer-default-export': 0,
    'no-console': 'warn',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '~/lib/spotify/auth.server',
            message: `It is used for spotify lib only and couldn't be imported in other modules`,
          },
          {
            name: '~/lib/spotify/fetcher.server',
            message: `It is used for spotify lib only and couldn't be imported in other modules`,
          },
        ],
      },
    ],
    'prettier/prettier': ['error'],
  },
};
