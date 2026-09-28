/** Small, read-only probes for Electron Web Viewer guests. No Node privileges are exposed. */
export interface WebViewerElement extends HTMLElement {
  executeJavaScript(code: string): Promise<unknown>;
}
export interface WebSelection {
  text: string; revision: number; modified: boolean;
  x: number; y: number; width: number; height: number;
  viewportWidth: number; viewportHeight: number;
}
export interface WebVideo {
  url: string; title: string; token: string; currentTime: number; sourceLanguage?: string;
  segments: Array<{ start: number; duration: number; text: string }>;
}

// Keep the modifier at selection time: focus moves out of the host into the guest.
export const WEB_SELECTION_PROBE = `(() => {
  const key = '__contextualReaderSelection';
  if (!window[key]) {
    const state = window[key] = { revision: 0, modified: false, until: 0, cleanups: [] };
    const listen = (name, handler) => { document.addEventListener(name, handler, true); state.cleanups.push(() => document.removeEventListener(name, handler, true)); };
    for (const name of ['pointerdown', 'pointerup', 'keydown', 'keyup']) listen(name, e => {
      state.modified = e.metaKey || e.ctrlKey;
      if (state.modified) state.until = Date.now() + 1000;
    });
    listen('selectionchange', () => { state.revision++; });
  }
  const state = window[key], selection = getSelection();
  const element = selection?.anchorNode?.parentElement;
  if (!selection?.rangeCount || element?.closest('input, textarea, [contenteditable]:not([contenteditable="false"])')) return null;
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  return { text: selection.toString().trim().slice(0, 50000), revision: state.revision,
    modified: state.modified || Date.now() < state.until,
    x: rect.x, y: rect.y, width: rect.width, height: rect.height,
    viewportWidth: innerWidth, viewportHeight: innerHeight };
})()`;
export const WEB_SELECTION_CLEANUP = `(() => { const s = window.__contextualReaderSelection; s?.cleanups.forEach(f => f()); delete window.__contextualReaderSelection; })()`;

// Includes same-origin frames; inaccessible cross-origin frames remain untouched.
export const WEB_VIDEO_PROBE = `(async () => {
  const documents = [document];
  for (let i = 0; i < documents.length && i < 50; i++) for (const frame of documents[i].querySelectorAll('iframe')) {
    try { if (frame.contentDocument) documents.push(frame.contentDocument); } catch {}
  }
  const videos = documents.flatMap(d => Array.from(d.querySelectorAll('video')));
  videos.sort((a,b) => Number(!b.paused) - Number(!a.paused) || b.clientWidth*b.clientHeight - a.clientWidth*a.clientHeight);
  const video = videos[0];
  if (!video) return null;
  const token = String(Date.now()) + Math.random();
  window.__contextualReaderVideo = { video, token, url: location.href, source: video.currentSrc };
  const tracks = Array.from(video.textTracks).filter(t => ['subtitles','captions'].includes(t.kind));
  tracks.sort((a,b) => Number(b.mode === 'showing') - Number(a.mode === 'showing'));
  let segments = [], language;
  for (const track of tracks) {
    const previous = track.mode;
    try {
      if (previous === 'disabled') track.mode = 'hidden';
      for (let i = 0; !track.cues?.length && i < 20; i++) await new Promise(r => setTimeout(r, 100));
      segments = Array.from(track.cues || []).slice(0, 20000).map(c => ({ start: c.startTime, duration: c.endTime-c.startTime, text: String(c.text || '').replace(/<[^>]*>/g, '').trim() })).filter(c => c.text && c.duration > 0);
      if (segments.length) { language = track.language; break; }
    } finally { track.mode = previous; }
  }
  return { url: location.href, title: document.title, token, currentTime: video.currentTime, sourceLanguage: language, segments };
})()`;

export function parseWebVideo(value: unknown): WebVideo | undefined {
  if (!value || typeof value !== 'object') return;
  const v = value as WebVideo;
  if (typeof v.url !== 'string' || !/^https?:\/\//.test(v.url) || typeof v.token !== 'string' || typeof v.title !== 'string' || !Number.isFinite(v.currentTime) || !Array.isArray(v.segments)) return;
  if (v.segments.length > 20000 || v.segments.some(s => !s || !Number.isFinite(s.start) || s.start < 0 || !Number.isFinite(s.duration) || s.duration <= 0 || typeof s.text !== 'string')) return;
  return { ...v, segments: v.segments.map(s => ({ start: s.start, duration: s.duration, text: s.text.slice(0, 20000) })).sort((a,b) => a.start-b.start) };
}

export function webVideoScript(token: string, action: 'time' | 'playVideo' | 'pauseVideo' | 'seekTo', seconds = 0): string {
  if (!Number.isFinite(seconds)) throw new Error('Invalid playback time');
  const operation = action === 'time' ? 'return v.currentTime' : action === 'playVideo' ? 'await v.play()' : action === 'pauseVideo' ? 'v.pause()' : `v.currentTime = ${Math.max(0, seconds)}`;
  return `(async () => { const s = window.__contextualReaderVideo; if (!s || s.token !== ${JSON.stringify(token)} || s.url !== location.href || !s.video.isConnected || s.source !== s.video.currentSrc) throw new Error('Web video changed. Reconnect from Web Viewer.'); const v = s.video; ${operation}; })()`;
}
export interface WebVideoConnection {
  time(): Promise<number>;
  command(action: 'playVideo' | 'pauseVideo' | 'seekTo', seconds?: number): Promise<void>;
}
