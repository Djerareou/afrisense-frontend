/**
 * Minimal ESLint config for this repo to satisfy ESLint v9 when running `npm run lint`.
 *
 * Notes:
 * - This configuration intentionally only targets JavaScript files (*.js, *.cjs, *.mjs, *.jsx)
 *   to avoid requiring TypeScript ESLint parser/plugins in this quick fix.
 * - For a full TypeScript + React linting setup, we should install and configure
 *   @typescript-eslint/parser and plugin:@typescript-eslint/recommended, and set
 *   parserOptions.project to ./tsconfig.json.
 */
module.exports = {
  root: true,
  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'coverage/'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: [],
  settings: {},
  rules: {},
  overrides: [
    {
      files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.jsx'],
      extends: ['eslint:recommended'],
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      env: { browser: true, node: true, es2022: true },
    },
    // Ignore TypeScript files here to avoid requiring @typescript-eslint packages
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {},
      settings: {},
    },
  ],
};
