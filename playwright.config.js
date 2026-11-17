
const { defineConfig } = require('@playwright/test');

const yandexBrowser =
  'C:/Users/timse/AppData/Local/Yandex/YandexBrowser/Application/browser.exe';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,

  use: {
    baseURL: process.env.SITE_URL || 'http://127.0.0.1:8765',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'yandex-desktop',
      use: {
        browserName: 'chromium',
        launchOptions: {
          executablePath: yandexBrowser
        },
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'reduce'
      }
    },
    {
      name: 'yandex-mobile',
      use: {
        browserName: 'chromium',
        launchOptions: {
          executablePath: yandexBrowser
        },
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        reducedMotion: 'reduce'
      }
    }
  ]
});
