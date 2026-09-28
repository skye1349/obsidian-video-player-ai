import test from "node:test";
import assert from "node:assert/strict";
import { EconomyModels, eligibleModels, selectionMode } from "../../src/economy-model";
const options = { backend: "openai" as const, model: "pinned", modelSelection: "economy" as const, apiKey: "fixture" };
const catalog = async () => ({ status: 200, json: { data: [{ id: "gpt-4.1-mini" }, { id: "gpt-5.4-mini" }, { id: "gpt-6-astra" }] } });
test("fresh installs use economy while legacy explicit settings remain manual", () => {
  assert.equal(selectionMode(null), "economy");
  assert.equal(selectionMode({}), "economy");
  assert.equal(selectionMode({ model: "custom" }), "manual");
  assert.equal(selectionMode({ model: "custom", modelSelection: "economy" }), "economy");
});
test("economy catalog excludes premium and unknown models", () => {
  assert.deepEqual(eligibleModels("openai", ["gpt-6-astra", "cheap-unknown", "gpt-4.1-mini"]), ["gpt-4.1-mini"]);
});
test("refreshes catalog and retries once on a retired model, retaining replacement", async () => {
  const resolver = new EconomyModels(); const attempts: string[] = []; let lists = 0;
  const http = async () => { lists++; return catalog(); };
  assert.equal(await resolver.run(options, http, async model => {
    attempts.push(model);
    if (model === "gpt-4.1-mini") throw new Error("model does not exist");
    return "ok";
  }), "ok");
  await resolver.run(options, http, async model => { attempts.push(model); return "ok"; });
  assert.equal(lists, 2);
  assert.deepEqual(attempts, ["gpt-4.1-mini", "gpt-5.4-mini", "gpt-5.4-mini"]);
});
test("manual model never discovers or switches on failure", async () => {
  let calls = 0;
  await assert.rejects(new EconomyModels().run({ ...options, modelSelection: "manual" }, async () => { throw Error("must not discover"); },
    async model => { calls++; assert.equal(model, "pinned"); throw Error("unknown model"); }), /unknown model/);
  assert.equal(calls, 1);
});
test("quota, authentication and network errors do not switch models", async () => {
  for (const message of ["quota exceeded", "invalid API key", "network error", "rate limit exceeded"]) {
    let calls = 0;
    await assert.rejects(new EconomyModels().run(options, catalog, async () => { calls++; throw Error(message); }), new RegExp(message));
    assert.equal(calls, 1);
  }
});
test("no economy model and custom gateways stop rather than upgrade", async () => {
  await assert.rejects(new EconomyModels().run(options, async () => ({ status: 200, json: { data: [{ id: "gpt-6-astra" }] } }), async () => "wrong"), /No supported economy/);
  await assert.rejects(new EconomyModels().run({ ...options, baseUrl: "https://gateway.example/v1" }, catalog, async () => "wrong"), /custom endpoint/);
});
test("model failure retries at most once", async () => {
  let calls = 0;
  await assert.rejects(new EconomyModels().run(options, catalog, async () => { calls++; throw Error("unknown model"); }), /unknown model/);
  assert.equal(calls, 2);
});
test("Codex tracks newer Luna generations without promoting to flagship", () => {
  assert.deepEqual(eligibleModels("codex", ["gpt-5.6-luna", "gpt-6-astra", "gpt-6-luna"]), ["gpt-6-luna", "gpt-5.6-luna"]);
});

test("video image and text requests use economy models through the actual API adapter", async () => {
  const { runVideoChatAI } = await import("../../src/video-chat-backend");
  for (const backend of ["openai", "anthropic"] as const) {
    const expected = backend === "openai" ? "gpt-4.1-mini" : "claude-haiku-4-5";
    const methods: string[] = [];
    let selected = "";
    const answer = await runVideoChatAI({ ...options, backend, timeoutMs: 1000, onModelSelected: m => { selected = m; } },
      "Describe the frame", [{ seconds: 0, png: new Uint8Array([1, 2]) }], new AbortController().signal, async request => {
        methods.push(request.method);
        if (request.method === "GET") return { status: 200, json: { data: [{ id: expected }] } };
        const body = JSON.parse(request.body!) as { model: string; messages: { content: { type: string }[] }[] };
        assert.equal(body.model, expected);
        assert.ok(body.messages[0].content.some(x => x.type === "image" || x.type === "image_url"));
        return { status: 200, json: backend === "openai" ? { choices: [{ message: { content: "frame answer" } }] } : { content: [{ type: "text", text: "frame answer" }] } };
      });
    assert.equal(answer, "frame answer");
    assert.equal(selected, expected);
    assert.deepEqual(methods, ["GET", "POST"]);
  }
});
