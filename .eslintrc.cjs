/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:astro/recommended',
    'plugin:svelte/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        extraFileExtensions: ['.astro'],
        parser: '@typescript-eslint/parser',
      },
      rules: {
        '@typescript-eslint/await-thenable': 0,
        '@typescript-eslint/no-base-to-string': 0,
        '@typescript-eslint/no-redundant-type-constituents': 0,
        '@typescript-eslint/no-unnecessary-type-assertion': 0,
        '@typescript-eslint/no-unsafe-argument': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/no-unsafe-return': 0,
        '@typescript-eslint/restrict-plus-operands': 0,
        '@typescript-eslint/restrict-template-expressions': 0,
        'import/namespace': 0,
      },
    },
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      rules: {
        '@typescript-eslint/await-thenable': 0,
        '@typescript-eslint/no-base-to-string': 0,
        '@typescript-eslint/no-redundant-type-constituents': 0,
        '@typescript-eslint/no-unnecessary-type-assertion': 0,
        '@typescript-eslint/no-unsafe-argument': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/no-unsafe-return': 0,
        '@typescript-eslint/restrict-plus-operands': 0,
        '@typescript-eslint/restrict-template-expressions': 0,
        'import/namespace': 0,
      },
    },
    {
      files: ['*.cjs'],
      rules: {
        '@typescript-eslint/no-unsafe-return': 0,
      },
    },
  ],
  plugins: [
    'prettier',
    '@typescript-eslint',
    'import',
    'astro',
    // 'svelte3',
    'import-alias',
  ],
  parserOptions: {
    ecmaFeatures: {
      arrowFunctions: true,
      jsx: true,
    },
    ecmaVersion: 'latest',
    extraFileExtensions: ['.svelte'],
    parser: '@typescript-eslint/parser',
    project: 'tsconfig.json',
    sourceType: 'module',
    tsConfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unsafe-enum-comparison': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/unbound-method': 0,
    'import-alias/import-alias': [
      'error',
      {
        relativeDepth: 1,
      },
    ],
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': [
      2,
      {
        amd: true,
        commonjs: true,
        ignore: ['\\.astro$', 'astro:*'],
      },
    ],
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
            pattern: '{@/**}',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['svelte'],
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
          {
            name: '~/lib/analytics/*',
            message: `Let's only import from '~/lib/analytics'.`,
          },
        ],
      },
    ],
    'no-unused-vars': 0,
    'prettier/prettier': ['error'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.js', '.mjs', '.cjs'],
        moduleDirectory: ['node_modules', 'src/'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    svelte: {
      ignoreWarnings: [
        '@typescript-eslint/no-unsafe-assignment',
        '@typescript-eslint/no-unsafe-member-access',
      ],
    },
  },
};
