// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';
import { getEnvironment } from './src/environment/environment';

const env = getEnvironment();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    screenshotsFolder: '../../dist/cypress/lk-zup/screenshots',
    videosFolder: '../../dist/cypress/lk-zup/video',
    video: true,
    fileServerFolder: 'src',
    supportFile: 'src/support/e2e.ts',
    fixturesFolder: 'src/fixtures',
    chromeWebSecurity: false,
    env,
    defaultCommandTimeout: 10000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
