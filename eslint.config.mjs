import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import cypress from 'eslint-plugin-cypress';
import { rules as emotionRules } from '@emotion/eslint-plugin';

// @emotion/eslint-plugin only exports rules, so wrap it into a plugin object.
const emotion = { rules: emotionRules };

export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'coverage/**',
      'storybook-static/**',
      'public/**',
      'reports/**',
      'next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    plugins: {
      '@emotion': emotion,
      cypress,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2020,
        React: 'writable',
        cy: true,
        NodeJS: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-undef': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'warn',
      'no-empty-pattern': 'warn',
      // base rule disabled as it can report incorrect errors
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
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-filename-extension': [
        1,
        { extensions: ['.js', '.jsx', '.tsx'] },
      ],
      'react/no-unknown-property': [
        2,
        {
          ignore: ['jsx', 'global'],
        },
      ],
      'react/jsx-indent': 'off',
      'react/jsx-no-literals': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
        },
      ],
      // Successors of the `ban-types` rule that the old config switched off.
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // New in typescript-eslint v8 recommended; kept as a warning so the tooling upgrade does not turn existing code into CI failures.
      '@typescript-eslint/no-unused-expressions': 'warn',
      'react/display-name': 'off',
      'react/no-find-dom-node': 'off',
      '@emotion/jsx-import': 'error',
      '@emotion/no-vanilla': 'error',
      '@emotion/import-from-emotion': 'error',
      '@emotion/styled-import': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/assertion-before-screenshot': 'warn',
      'cypress/no-force': 'warn',
      'cypress/no-async-tests': 'error',
      'cypress/no-pause': 'error',
    },
  },
];
