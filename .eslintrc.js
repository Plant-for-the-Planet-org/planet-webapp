const MAX_PARAMS = 4;
const JSX_INDENT_SIZE = 2;

module.exports = {
  env: {
    node: true,
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:storybook/recommended',
    'plugin:import/recommended', // Add this line to include recommended rules from eslint-plugin-import
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', '@emotion', 'cypress', 'import'], // Add 'import' here
  rules: {
    // General JavaScript/TypeScript
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'warn',
    'no-var': 'error',
    'consistent-return': 'warn',
    eqeqeq: ['error', 'always'],
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn',

    // React Best Practices
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/jsx-curly-brace-presence': [
      'warn',
      { props: 'never', children: 'never' },
    ],

    // Code Quality
    complexity: ['warn', { max: 10 }],
    'max-lines': [
      'warn',
      { max: 300, skipBlankLines: true, skipComments: true },
    ],
    'max-params': ['warn', MAX_PARAMS],
    'no-magic-numbers': ['warn', { ignore: [0, 1] }],

    // Security
    'no-eval': 'error',
    'no-new-func': 'error',

    // Existing Rules
    'no-undef': 'warn',
    'no-unsafe-optional-chaining': 'warn',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'warn',
    'no-empty-pattern': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'warn',
    'react/jsx-filename-extension': [
      'warn',
      { extensions: ['.js', '.jsx', '.tsx'] },
    ],
    'react/no-unknown-property': [
      'error',
      {
        ignore: ['jsx', 'global'],
      },
    ],
    'react/jsx-indent': ['warn', JSX_INDENT_SIZE],
    'import/extensions': [
      'warn',
      'always',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-unresolved': 'warn', // should be error
    'import/named': 'warn', // should be error
    'react/jsx-no-literals': 'off',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    'react/display-name': 'off',
    'react/no-find-dom-node': 'off',
    '@emotion/jsx-import': 'error',
    '@emotion/no-vanilla': 'error',
    '@emotion/import-from-emotion': 'error',
    '@emotion/styled-import': 'error',
    '@typescript-eslint/no-var-requires': 'warn',
    'react/prop-types': 'warn',
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-unnecessary-waiting': 'error',
    'cypress/assertion-before-screenshot': 'warn',
    'cypress/no-force': 'error',
    'cypress/no-async-tests': 'error',
    'cypress/no-pause': 'error',
  },
  globals: {
    React: 'writable',
    cy: true,
    NodeJS: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
