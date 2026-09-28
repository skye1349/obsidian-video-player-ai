export type Product = "combined" | "video" | "translator";
declare const __READER_PRODUCT__: Product;
export const PRODUCT: Product = typeof __READER_PRODUCT__ === "undefined" ? "combined" : __READER_PRODUCT__;
export const HAS_VIDEO = PRODUCT !== "translator";
export const HAS_TRANSLATOR = PRODUCT !== "video";
export const PRODUCT_NAME = PRODUCT === "video" ? "Video Player (AI integrated)" : PRODUCT === "translator" ? "AI Translator" : "Read and Watch with AI";

/** Only reading/AI preferences cross into the new plugin, never video history or audio credentials. */
export function translatorSettings(source: unknown): Record<string, unknown> {
  if (!source || typeof source !== "object" || Array.isArray(source)) return {};
  const allowed = new Set([
    "modelSelection", "aiBackend", "autoTranslate", "batchChunkChars", "claudeCommand", "claudeModel", "codexCommand", "customPrompt",
    "debounceMs", "excerptFilePath", "includeTranslationInExcerpt", "minSelectionChars", "model", "openExcerptAfterSave",
    "openaiApiKey", "openaiBaseUrl", "openaiModel", "anthropicApiKey", "anthropicBaseUrl", "anthropicModel",
    "reasoningEffort", "requireCommandForAutoTranslate", "singleShotMaxChars", "speechLanguage", "speechRate",
    "sourceLanguage", "targetLanguage", "timeoutSeconds", "vocabularyCache", "sharedMemoryCommand", "sharedMemoryEnabled"
  ]);
  return Object.fromEntries(Object.entries(source).filter(([key]) => allowed.has(key)));
}

export const VIDEO_VIEW_TYPE = PRODUCT === "video" ? "video-player-ai-view" : "contextual-ai-reader-youtube";
export const VIDEO_YOUTUBE_PROTOCOL = PRODUCT === "video" ? "video-player-ai-youtube" : "contextual-ai-reader-youtube";
export const VIDEO_LOCAL_PROTOCOL = PRODUCT === "video" ? "video-player-ai-local" : "contextual-ai-reader-local-video";
