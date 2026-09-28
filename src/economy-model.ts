import { readFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";
export type ModelBackend = "codex" | "claude" | "openai" | "anthropic";
export type ModelSelection = "economy" | "manual";
export interface ModelOptions {
  backend: ModelBackend; model: string; modelSelection?: ModelSelection;
  apiKey?: string; baseUrl?: string;
}
export type ModelHttp = (request: { url: string; method: string; headers: Record<string, string>; throw: boolean }) => Promise<{ status: number; json: unknown }>;
const record = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);
// Policy references: https://developers.openai.com/api/docs/models
// https://platform.claude.com/docs/en/models/overview
// Reviewed economy candidates, in preference order. Never infer cost/vision from an arbitrary model name.
// Update this small policy as providers introduce new families; IDs are not persisted as users' defaults.
const candidates: Record<ModelBackend, string[]> = {
  codex: ["gpt-5.6-luna"],
  claude: ["haiku"],
  openai: ["gpt-4.1-mini", "gpt-5.4-mini", "gpt-5.6-luna"],
  anthropic: ["claude-haiku-4-5", "claude-haiku-4-5-20251001"]
};
export function selectionMode(data: unknown): ModelSelection {
  if (record(data) && (data.modelSelection === "economy" || data.modelSelection === "manual")) return data.modelSelection;
  // Existing installations may have deliberately pinned a model. Never reinterpret those choices.
  return record(data) && ["model", "claudeModel", "openaiModel", "anthropicModel", "videoChatCodexModel"].some(k => typeof data[k] === "string" && data[k]) ? "manual" : "economy";
}
export function isUnavailableModel(error: unknown): boolean {
  const text = error instanceof Error ? error.message : String(error);
  if (/quota|rate.limit|unauthorized|invalid.api.key|authentication|timed.out|network/i.test(text)) return false;
  return /model[^\n]*(?:not supported|not found|does not exist|unavailable|deprecated|retired)|(?:unknown|unsupported|invalid) model/i.test(text);
}
export function eligibleModels(backend: ModelBackend, available?: string[]): string[] {
  if (backend === "codex" && available) {
    // Codex publishes modality metadata. Track its lightweight Luna family rather than a frozen version.
    return available.filter(id => /^gpt-\d+(?:\.\d+)?-luna$/.test(id))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  }
  return candidates[backend].filter(id => available === undefined || available.includes(id));
}
export class EconomyModels {
  private cached = new Map<string, { time: number; models: string[] }>();
  current = "";
  async run<T>(options: ModelOptions, http: ModelHttp, execute: (model: string) => Promise<T>): Promise<T> {
    if (options.modelSelection !== "economy") return execute(options.model);
    const key = JSON.stringify([options.backend, options.baseUrl, options.apiKey]);
    const get = async (refresh = false) => {
      const old = this.cached.get(key);
      if (!refresh && old && Date.now() - old.time < 3_600_000) return old.models;
      const models = await this.discover(options, http);
      this.cached.set(key, { time: Date.now(), models });
      return models;
    };
    const first = (await get())[0];
    if (!first) throw new Error("No supported economy model is available. Select a model manually in settings; no premium model was selected.");
    this.current = first;
    try { return await execute(first); }
    catch (error) {
      if (!isUnavailableModel(error)) throw error;
      const remaining = (await get(true)).filter(id => id !== first);
      if (!remaining.length) throw new Error(`${error instanceof Error ? error.message : String(error)} No other supported economy model is available. Choose a model manually in settings.`);
      this.cached.set(key, { time: Date.now(), models: remaining });
      this.current = remaining[0];
      return execute(remaining[0]); // One retry, only for a definite model availability failure.
    }
  }
  private async discover(options: ModelOptions, http: ModelHttp): Promise<string[]> {
    if (options.backend === "claude") return eligibleModels("claude"); // CLI-managed economy alias.
    if (options.backend === "codex") {
      try {
        const data: unknown = JSON.parse(await readFile(join(process.env.CODEX_HOME || join(homedir(), ".codex"), "models_cache.json"), "utf8"));
        if (record(data) && Array.isArray(data.models)) {
          const ids = data.models.filter(record).filter(m => Array.isArray(m.input_modalities) && m.input_modalities.includes("image")).map(m => String(m.slug));
          const found = eligibleModels("codex", ids);
          if (found.length) return found;
        }
      } catch { /* CLI can refresh its own missing/stale cache on the first request. */ }
      return eligibleModels("codex");
    }
    if (!options.apiKey?.trim()) throw new Error("Configure an API key before selecting an economy model.");
    const anthropic = options.backend === "anthropic";
    const base = (options.baseUrl?.trim() || (anthropic ? "https://api.anthropic.com/v1" : "https://api.openai.com/v1")).replace(/\/+$/, "");
    const official = new URL(base).origin === (anthropic ? "https://api.anthropic.com" : "https://api.openai.com");
    // A gateway may remap IDs or prices; do not guess its economy tier from OpenAI naming.
    if (!official) throw new Error("Automatic economy selection supports official OpenAI/Anthropic endpoints. For this custom endpoint, choose Manual and specify a model.");
    const response = await http({ url: base + "/models", method: "GET", throw: false,
      headers: anthropic ? { "x-api-key": options.apiKey.trim(), "anthropic-version": "2023-06-01" } : { Authorization: `Bearer ${options.apiKey.trim()}` } });
    if (response.status === 404 || response.status === 405) return eligibleModels(options.backend);
    if (response.status < 200 || response.status >= 300) throw new Error(`Model discovery failed (HTTP ${response.status}). Check your API credentials and connection.`);
    if (!record(response.json) || !Array.isArray(response.json.data)) throw new Error("Invalid model catalog response. Choose a model manually.");
    return eligibleModels(options.backend, response.json.data.filter(record).map(m => String(m.id)));
  }
}
