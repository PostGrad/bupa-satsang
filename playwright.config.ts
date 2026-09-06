import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './apps/client/e2e',
  use: {
    baseURL: 'http://127.0.0.1:8081'
  },
  webServer: {
    command: 'pnpm --dir apps/client exec expo start --web --port 8081',
    port: 8081,
    reuseExistingServer: !process.env.CI
  }
});
