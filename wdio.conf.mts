import path from 'node:path';
export const config: WebdriverIO.Config = {
  runner: 'local', framework: 'mocha', specs: ['./test/e2e/*.e2e.ts'], maxInstances: 1,
  capabilities: [{ browserName: 'obsidian', 'wdio:obsidianOptions': {
    appVersion: '1.13.7', installerVersion: '1.13.7',
    plugins: (process.env.OBSIDIAN_TEST_PLUGINS || '.').split(','), vault: 'test/vault'
  }}],
  services: ['obsidian'], reporters: ['obsidian'],
  mochaOpts: { ui: 'bdd', timeout: 90000 }, waitforTimeout: 10000, logLevel: 'warn',
  cacheDir: process.env.OBSIDIAN_TEST_CACHE || path.resolve('.obsidian-cache')
};
