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
import config from './eslint.config.mjs';

// Re-export the ESM config so ESLint can load it whether it tries .js or .mjs
export default config;
