import { browser, expect } from '@wdio/globals';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';

describe('Web Viewer integration', () => {
  let server: Server;
  let url: string;
  before(async function () {
    const installed = await browser.executeObsidian(({ app }) => Boolean(app.plugins.plugins['ai-translator-by-taoye'] && app.plugins.plugins['video-player-ai']));
    if (!installed) this.skip();
    server = createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<title>Web Viewer fixture</title><p id="text">A complete sentence selected in a separate web guest.</p><video controls style="width:600px;height:300px"></video><script>
        const v = document.querySelector('video'); const t = v.addTextTrack('subtitles', 'English', 'en');
        t.addCue(new VTTCue(0, 3, 'First subtitle.')); t.addCue(new VTTCue(3, 6, 'Second subtitle.')); t.mode = 'showing';
      </script>`);
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;
  });
  after(async () => { if (!server) return; await new Promise<void>(resolve => server.close(() => resolve())); });

  it('reads guest selection and captions, translates and controls the original video', async () => {
    await browser.executeObsidian(async ({ app }, url) => {
      await app.internalPlugins.plugins.webviewer.enable();
      const leaf = app.workspace.getLeaf('tab');
      await leaf.setViewState({ type: 'webviewer', active: true, state: { url } });
      await app.workspace.revealLeaf(leaf);
      const translator = app.plugins.plugins['ai-translator-by-taoye'];
      Object.assign(translator.settings, { autoTranslate: true, requireCommandForAutoTranslate: true, debounceMs: 30 });
      (window as any).__webSelection = '';
      translator.translateSelectionToPopup = async (text: string) => { (window as any).__webSelection = text; };
    }, url);
    await browser.waitUntil(async () => browser.executeObsidian(async ({ app }) => {
      const guest = app.workspace.getLeavesOfType('webviewer')[0]?.view.containerEl.querySelector('webview') as any;
      try { return Boolean(await guest?.executeJavaScript('Boolean(window.__contextualReaderSelection)')); } catch { return false; }
    }), { timeout: 20000 });
    await browser.executeObsidian(async ({ app }) => {
      const guest = app.workspace.getLeavesOfType('webviewer')[0].view.containerEl.querySelector('webview') as any;
      await guest.executeJavaScript(`document.dispatchEvent(new KeyboardEvent('keydown', {metaKey:true})); const r = document.createRange(); r.selectNodeContents(document.querySelector('#text')); getSelection().removeAllRanges(); getSelection().addRange(r);`);
    });
    await browser.waitUntil(async () => (await browser.execute(() => (window as any).__webSelection)) === 'A complete sentence selected in a separate web guest.');
    const result = await browser.executeObsidian(async ({ app }) => {
      const plugin = app.plugins.plugins['video-player-ai'];
      await plugin.connectWebViewerVideo();
      const view = app.workspace.getLeavesOfType('video-player-ai-view')[0].view as any;
      view.host.translateSegments = async () => ['第一句字幕。', '第二句字幕。'];
      await view.translateTranscript();
      await view.webConnection.command('seekTo', 4);
      return { data: view.getVideoData(), time: await view.webConnection.time(), text: view.containerEl.textContent, hasPlaceholder: Boolean(view.containerEl.querySelector('.youtube-reader-player')), hasResizer: Boolean(view.containerEl.querySelector('.youtube-reader-resizer')) };
    });
    expect(result.data.webUrl).toBe(url);
    expect(result.data.segments.length).toBe(2);
    expect(result.data.segments[0].translation).toBe('第一句字幕。');
    expect(result.time).toBe(4);
    expect(result.hasPlaceholder).toBe(false);
    expect(result.hasResizer).toBe(false);
    expect(result.text).toContain('第一句字幕。');
    await browser.executeObsidian(async ({ app }) => {
      const guest = app.workspace.getLeavesOfType('webviewer')[0].view.containerEl.querySelector('webview') as any;
      await guest.executeJavaScript('document.querySelector("video").remove()');
    });
    await browser.waitUntil(async () => browser.executeObsidian(({ app }) => app.workspace.getLeavesOfType('video-player-ai-view')[0].view.containerEl.textContent?.includes('closed or changed') ?? false));
  });
});
