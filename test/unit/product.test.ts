import assert from "node:assert/strict";
import test from "node:test";
import { translatorSettings } from "../../src/product";

test("translator migration preserves AI and reading preferences without video history or audio credentials", () => {
  const settings = translatorSettings({ aiBackend: "anthropic", anthropicApiKey: "fixture", excerptFilePath: "My notes.md", vocabularyCache: { word: { word: "word" } }, targetLanguage: "zh-CN", videoChats: { old: {} }, videoChatNoteTargets: { old: "note.md" }, youtubeCache: {}, transcriptionApiKey: "audio", youtubeGroqApiKey: "audio", unknownField: true });
  assert.equal(settings.aiBackend, "anthropic");
  assert.equal(settings.anthropicApiKey, "fixture");
  assert.equal(settings.excerptFilePath, "My notes.md");
  assert.deepEqual(Object.keys(settings).sort(), ["aiBackend", "anthropicApiKey", "excerptFilePath", "targetLanguage", "vocabularyCache"]);
  assert.deepEqual(translatorSettings(null), {});
  assert.deepEqual(translatorSettings([]), {});
});
