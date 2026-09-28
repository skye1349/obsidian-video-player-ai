import assert from "node:assert/strict";
import test from "node:test";
import { compactProcessError, spawnProcess } from "../../src/process-runner";

test("process adapter streams stdin and returns captured output", async () => {
  const handle = spawnProcess(
    process.execPath,
    ["-e", "process.stdin.setEncoding('utf8'); let s=''; process.stdin.on('data', c => s += c); process.stdin.on('end', () => process.stdout.write(s.toUpperCase()));"],
    "lingua",
    2_000
  );

  const result = await handle.promise;
  assert.equal(result.code, 0);
  assert.equal(result.stdout, "LINGUA");
  assert.equal(result.stderr, "");
});

test("process adapter compacts verbose failures", () => {
  assert.equal(compactProcessError("one\ntwo\nthree\nfour\nfive\n"), "two three four five");
});

test("structured terminal failure takes precedence over unrelated stderr warnings", () => {
  const message = "The 'gpt-5.4-mini' model is not supported when using Codex with a ChatGPT account.";
  const stdout = [
    JSON.stringify({ type: "error", message: "Retrying..." }),
    JSON.stringify({ type: "turn.failed", error: { message: JSON.stringify({ error: { message } }) } })
  ].join("\n");
  assert.equal(compactProcessError("ERROR cache: missing field base_instructions", stdout), message);
  assert.equal(compactProcessError("", JSON.stringify({ type: "error", message: "Connection failed" })), "Connection failed");
  assert.equal(compactProcessError("CLI failed", "not json"), "CLI failed");
});
