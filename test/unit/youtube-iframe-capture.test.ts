import assert from "node:assert/strict";
import test from "node:test";
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";

const bundle = buildSync({
  entryPoints: ["src/youtube.ts"], bundle: true, write: false,
  platform: "node", format: "cjs", external: ["obsidian"]
}).outputFiles[0].text;
const module = { exports: {} as any };
const nativeRequire = createRequire(import.meta.url);
runInNewContext(bundle, {
  module, exports: module.exports, console,
  require: (name: string) => name === "obsidian"
    ? { ItemView: class {}, Modal: class {}, Component: class {} }
    : nativeRequire(name)
});

test("embedded YouTube captures the displayed frame without falling through to a 403-prone stream URL", async () => {
  const png = Buffer.from("fixture PNG");
  const calls: any[] = [];
  const win = {
    innerWidth: 1000, innerHeight: 800,
    require: (name: string) => {
      assert.equal(name, "@electron/remote");
      return { getCurrentWebContents: () => ({
        getZoomFactor: () => 1.25,
        capturePage: async (rect: unknown) => {
          calls.push(rect);
          return { isEmpty: () => false, toPNG: () => png };
        }
      }) };
    }
  };
  const view = Object.create(module.exports.YouTubeLearningView.prototype);
  view.containerEl = { win };
  view.iframeEl = {
    ownerDocument: { defaultView: win },
    getBoundingClientRect: () => ({ left: 20, top: 40, right: 660, bottom: 400, width: 640, height: 360 })
  };
  const result = await view.captureDisplayedVideoFrame();
  assert.ok(result, "iframe capture must not fall through to external stream extraction");
  assert.deepEqual(Buffer.from(result), png);
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [{ x: 25, y: 50, width: 800, height: 450 }]);
});

test("a clipped or hidden iframe falls back instead of copying an incomplete frame", async () => {
  for (const bounds of [
    { left: -1, top: 0, right: 600, bottom: 360, width: 601, height: 360 },
    { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }
  ]) {
    const view = Object.create(module.exports.YouTubeLearningView.prototype);
    const win = { innerWidth: 1000, innerHeight: 800, require: () => assert.fail("must not capture") };
    view.iframeEl = { ownerDocument: { defaultView: win }, getBoundingClientRect: () => bounds };
    assert.equal(await view.captureDisplayedVideoFrame(), undefined);
  }
});
