import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

const forbiddenGlobals = [
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
  'localStorage',
  'sessionStorage',
  'indexedDB',
].map((name) => ({
  name,
  message: 'No network calls and no persistent storage are allowed in this app.',
}));

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-restricted-globals': ['error', ...forbiddenGlobals],
      'no-restricted-properties': [
        'error',
        ...['fetch', 'localStorage', 'sessionStorage', 'indexedDB'].map((property) => ({
          object: 'window',
          property,
          message: 'No network calls and no persistent storage are allowed in this app.',
        })),
      ],
    },
  },
  {
    files: ['src/**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    // The core must stay framework-free.
    files: ['src/lib/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react/*',
                'react-*',
                'preact',
                'preact/*',
                'vue',
                'svelte',
                'svelte/*',
                'solid-js',
                'solid-js/*',
                '@angular/*',
                'lit',
                'lit/*',
                '@emotion/*',
                'styled-components',
              ],
              message: 'src/lib must not import React or any other UI framework.',
            },
          ],
        },
      ],
    },
  },
);
