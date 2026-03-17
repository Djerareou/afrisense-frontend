// Minimal flat ESLint config (ESM) for ESlint v9+ in a `type: module` project.
// This intentionally keeps rules minimal to avoid requiring @typescript-eslint.
export default [
  // Global ignores
  {
    // Ignore compiled output, test coverage and all TypeScript files so ESLint
    // doesn't attempt to parse TS/TSX without the TypeScript parser.
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '**/*.ts', '**/*.tsx'],
  },
  // JS/JSX files
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    // Keep rules minimal for now
    rules: {},
  },
  // Keep TS/TSX entries empty so ESLint doesn't try to parse them without TS parser
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
];
