import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  outputDir: '/tmp/presidentialfunfacts-test-results',
  workers: 1,
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:4173/presidentialfunfacts/', ...devices['Desktop Chrome'] },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4173/presidentialfunfacts/',
    reuseExistingServer: false,
    timeout: 60000,
  },
  reporter: 'list',
});
