import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  setupFiles: ['./tests/setupTests.ts'],
    include: ['tests/**/*.test.*'],
    reporters: 'default',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
