import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  //testDir: './tests',
  timeout: 90 * 1000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : 12,

  reporter: 'html',

  use: {
    //baseURL: 'https://www.automationexercise.com',
    trace: 'on-first-retry',
    screenshot: { mode: 'on', fullPage: true },
    video: 'retain-on-failure',
    launchOptions:{
      //slowMo: 200
    }

  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] 
        //, storageState: '.auth/linkedin-user.json',
      },
    },
  ],


});