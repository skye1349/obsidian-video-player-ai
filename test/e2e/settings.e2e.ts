import { mkdtemp, writeFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { browser, expect } from '@wdio/globals';

describe('Searchable product settings and isolated translation', () => {
  it('indexes product-specific settings without creating controls during indexing', async () => {
    const results = await browser.executeObsidian(({ app }) => {
      const tabs = (app.setting as any).pluginTabs;
      return ['ai-translator-by-taoye', 'video-player-ai'].filter(id => app.plugins.plugins[id]).map(id => {
        const tab = tabs.find((item: any) => item.id === id);
        const definitions = tab.getSettingDefinitions();
        return { id, names: definitions.map((item: any) => item.name), indexed: tab.settingItems.length };
      });
    });
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.names).toContain('AI backend');
      expect(result.indexed).toBeGreaterThan(10);
      expect(result.names.includes('Chat note folder')).toBe(result.id === 'video-player-ai');
      expect(result.names.includes('Excerpt file')).toBe(result.id === 'ai-translator-by-taoye');
    }
  });

  it('renders controls, switches providers and persists edited values', async () => {
    const ids = await browser.executeObsidian(({ app }) => ['ai-translator-by-taoye', 'video-player-ai'].filter(id => app.plugins.plugins[id]));
    for (const id of ids) {
      const main = await browser.getWindowHandle();
      const before = await browser.getWindowHandles();
      await browser.executeObsidian(({ app }, pluginId) => { app.setting.open(); app.setting.openTabById(pluginId); }, id);
      await browser.waitUntil(async () => (await browser.getWindowHandles()).length > before.length || await browser.$('div=AI backend').isExisting());
      const settings = (await browser.getWindowHandles()).find(handle => !before.includes(handle));
      if (settings) await browser.switchToWindow(settings);
      const backend = browser.$('div=AI backend');
      await expect(backend).toExist();
      await browser.execute(() => {
        const rows = [...document.querySelectorAll('.setting-item')];
        const row = rows.find(el => el.querySelector('.setting-item-name')?.textContent === 'AI backend')!;
        const select = row.querySelector('select')!;
        select.value = 'openai'; select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await expect(browser.$('div=API key')).toExist();
      await expect(browser.$('div=Test API connection')).toExist();
      await browser.execute(() => {
        const row = [...document.querySelectorAll('.setting-item')].find(el => el.querySelector('.setting-item-name')?.textContent === 'API model')!;
        const input = row.querySelector('input')!; input.value = 'regression-model'; input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      if (settings) { await browser.closeWindow(); await browser.switchToWindow(main); }
      else await browser.executeObsidian(({ app }) => app.setting.close());
      const value = await browser.executeObsidian(({ app }, pluginId) => app.plugins.plugins[pluginId].settings.openaiModel, id);
      expect(value).toBe('regression-model');
    }
  });
  it('runs Claude text tasks without tools or MCP, outside the vault, then removes the workspace', async () => {
    const fixture = await mkdtemp(join(tmpdir(), 'claude-permissions-test-'));
    const command = join(fixture, 'fake-claude');
    try {
      await writeFile(command, `#!/usr/bin/env node
let input='';process.stdin.on('data',c=>input+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify({result:JSON.stringify({args:process.argv.slice(2),cwd:process.cwd(),input})})));`, { mode: 0o700 });
      const outputs = await browser.executeObsidian(async ({ app }, command) => {
        const outputs = [];
        for (const id of ['ai-translator-by-taoye', 'video-player-ai']) {
          const plugin = app.plugins.plugins[id]; if (!plugin) continue;
          plugin.settings.claudeCommand = command;
          outputs.push(JSON.parse(await plugin.runClaudePrompt('Translate only this sentence.', undefined, 'test-model')));
        }
        return outputs;
      }, command);
      for (const output of outputs) {
        for (const flag of ['--tools', '--setting-sources']) {
          expect(output.args).toContain(flag);
          expect(output.args[output.args.indexOf(flag) + 1]).toBe('');
        }
        expect(output.args).toContain('--strict-mcp-config');
        expect(output.args).toContain('--disable-slash-commands');
        expect(output.args[output.args.indexOf('--mcp-config') + 1]).toBe('{"mcpServers":{}}');
        expect(output.input).toBe('Translate only this sentence.');
        expect(output.cwd).toContain('obsidian-translation-');
        let exists = true; try { await stat(output.cwd); } catch { exists = false; }
        expect(exists).toBe(false);
      }
    } finally { await rm(fixture, { recursive: true, force: true }); }
  });

  it('uses the active window DOM helpers for translation popups', async () => {
    const result = await browser.executeObsidian(({ app }) => {
      const plugin = app.plugins.plugins['ai-translator-by-taoye']; if (!plugin) return true;
      plugin.showPopupLoading('Test', new DOMRect(100, 100, 100, 20), () => {});
      const popup = document.querySelector('.contextual-ai-reader-popover');
      const valid = popup?.querySelector('.ai-reader-status-label')?.textContent?.includes('Test');
      plugin.hidePopup(); return valid;
    });
    expect(result).toBe(true);
  });

});
