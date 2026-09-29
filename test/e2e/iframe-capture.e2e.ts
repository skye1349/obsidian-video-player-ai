import { browser, expect } from "@wdio/globals";

describe("Embedded player screenshots", () => {
  it("copies the visible iframe without requesting a forbidden media stream", async () => {
    await browser.executeObsidian(async ({ app }) => {
      const plugin = app.plugins.plugins["video-player-ai"];
      const videoId = "clipboard1A";
      plugin.settings.youtubeCache[videoId] = {
        embedAllowed: true, requestedSourceLanguage: "en", sourceLanguage: "en",
        segments: [{ start: 0, duration: 10, text: "Screenshot fixture" }],
        title: "Screenshot fixture", translations: {}, updatedAt: Date.now(), videoId
      };
      await plugin.openYouTubePlayer(videoId);
      const view = app.workspace.getLeavesOfType("video-player-ai-view")[0].view;
      view.iframeEl.srcdoc = '<body style="margin:0;background:rgb(20,180,80)"></body>';
    });
    await browser.waitUntil(() => browser.executeObsidian(({ app }) => {
      const view = app.workspace.getLeavesOfType("video-player-ai-view")[0].view;
      return view.iframeEl.contentDocument?.body?.style.backgroundColor === "rgb(20, 180, 80)";
    }));
    const result = await browser.executeObsidian(async ({ app }) => {
      // Wait for the loaded fixture to reach the compositor before taking a screenshot.
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      const plugin = app.plugins.plugins["video-player-ai"];
      const view = app.workspace.getLeavesOfType("video-player-ai-view")[0].view;
      const oldRun = plugin.runTrackedProcess;
      const oldCopy = plugin.copyPngToClipboard;
      const oldInsert = plugin.settings.youtubeCaptureInsertIntoActiveNote;
      let processes = 0;
      let captured: any;
      plugin.runTrackedProcess = async () => { processes++; throw new Error("403 Forbidden"); };
      plugin.copyPngToClipboard = (png) => {
        const image = window.require("electron").nativeImage.createFromBuffer(png);
        const size = image.getSize();
        const pixel = image.crop({ x: Math.floor(size.width / 2), y: Math.floor(size.height / 2), width: 1, height: 1 }).toBitmap();
        captured = { size, pixel: Array.from(pixel) };
      };
      plugin.settings.youtubeCaptureInsertIntoActiveNote = false;
      try { await plugin.captureYouTubeFrame(view); }
      finally {
        plugin.runTrackedProcess = oldRun;
        plugin.copyPngToClipboard = oldCopy;
        plugin.settings.youtubeCaptureInsertIntoActiveNote = oldInsert;
      }
      return { processes, captured };
    });
    expect(result.processes).toBe(0);
    expect(result.captured.size.width).toBeGreaterThan(100);
    // Chromium/macOS color conversion can round a channel by one level.
    for (const [index, expected] of [80, 180, 20].entries()) {
      expect(Math.abs(result.captured.pixel[index] - expected)).toBeLessThanOrEqual(2);
    }
  });
});
