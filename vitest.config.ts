import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['apps/api/test/**/*.test.ts', '**/node_modules/**', '**/dist/**']
  }
});
