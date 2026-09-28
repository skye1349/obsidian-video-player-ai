# Video Player (AI integrated)

Watch, understand and take notes without leaving Obsidian. Open YouTube or local videos, read bilingual captions, capture moments and ask AI about what you are watching.

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## Install

Desktop Obsidian 1.13.7 or later is required. Mobile is not supported.

1. Open **Settings → Community plugins** in Obsidian and enable community plugins if prompted.
2. Click **Browse** and search for **Video Player (AI integrated)**.
3. Click **Install**, then **Enable**.
4. Open the plugin’s settings to choose your language and AI service.

## Feature walkthroughs

Choose a feature below to expand its short GIF and instructions. Each demo covers the named feature.

[Watch and organize](#watch-and-organize) · [Read and translate captions](#read-and-translate-captions) · [Ask AI](#ask-ai) · [Keep notes](#keep-notes)

The recordings use English instructions and highlighted clicks. **Cmd/Ctrl** means Command on macOS and Ctrl on Windows/Linux. [Demo notes and requirements](docs/demos.md#before-you-start).

### Watch and organize

<details>
<summary>Organize local playlists and track progress</summary>

1. Click **Add playlist** and select a folder. Subfolders become chapters.
2. Select lessons you have already completed and click **Mark as watched**. Use **Continue watching** to pick up the next lesson.

![Local playlists](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.2.0/local-playlists.gif)

[Watch MP4](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.2.0/local-playlists.mp4) · [English subtitles](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.2.0/local-playlists.en.srt)

Your videos stay in their original folder. **Rescan** adds new files while preserving progress; **Locate folder** reconnects a moved folder. **Mark as unwatched** resets selected lessons. You can also reorder videos within a chapter and keep a note for each video.

Duration scanning uses local **ffprobe**, configurable under **Duration settings**. Unknown durations can be filled in during playback. Playlist data is stored separately from AI settings in `video-library.json`. No AI account is needed for playlists or basic playback.

</details>

<details>
<summary>Open a local video</summary>

1. Open player > Open local video.
2. Click Browse… or paste a path, then click Open.

![Open a local video](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/open-local-video.gif)

</details>

<details>
<summary>Open a YouTube video</summary>

1. Press Cmd/Ctrl + P and run Open YouTube video.
2. Paste the video link and click Open. Available captions load beside it.

![Open a YouTube video](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/open-youtube.gif)

</details>

<details>
<summary>Jump to a moment and focus the player</summary>

1. Click a transcript timestamp to jump to that moment.
2. Click the expand icon for windowed fullscreen.

![Jump to a moment and focus the player](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/focus-and-seek.gif)

</details>

### Read and translate captions

<details>
<summary>Choose embedded CC or a subtitle file</summary>

1. Click the Subtitle track menu in the top toolbar.
2. Choose embedded CC, a matching SRT, or a VTT file.

![Choose embedded CC or a subtitle file](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/choose-subtitles.gif)

</details>

<details>
<summary>Translate the transcript</summary>

1. Click Translate transcript with AI in the top toolbar.
2. Read the original and translation together.

![Translate the transcript](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/translate-subtitles.gif)

</details>

<details>
<summary>Translate captions from Web Viewer</summary>

Open a video in the desktop **Web viewer** core plugin and enable captions on the website. Run **Translate video subtitles from Web Viewer**, then click **Translate transcript with AI**. The video stays on the original page; the adjacent panel shows only the toolbar and transcript, with synchronized highlighting, playback controls and clickable timestamps.

![Translate captions from Web Viewer](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.gif)

[Watch MP4](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.mp4) · [English subtitles](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.en.srt)

Reads accessible HTML5 text tracks; YouTube can use the existing yt-dlp fallback. Reconnect after switching videos or to refresh dynamic captions. Cross-origin players, proprietary or burned-in subtitles and generic web audio transcription are not supported. Web video frame capture is unavailable; AI chat can use the extracted captions.

The Web Viewer demo records the released plugin in Obsidian using original sample material and actual translation results. It is silent; waiting time is shortened.

</details>

### Ask AI

<details>
<summary>Ask AI and continue the conversation</summary>

1. Click AI help at the top right; choose the video evidence.
2. Type a question and click Send. Follow-up questions keep context.

![Ask AI and continue the conversation](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/ask-ai.gif)

</details>

<details>
<summary>Choose your AI backend</summary>

1. Open the plugin settings and click AI backend.
2. Choose Codex, Claude Code, OpenAI-compatible API, or Anthropic.

![Choose your AI backend](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/ai-backend.gif)

</details>

### Keep notes

<details>
<summary>Save captions as a note</summary>

1. Click Create transcript note (the document icon).
2. Use a timestamp link in the note to return to the video.

![Save captions as a note](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/transcript-note.gif)

</details>

<details>
<summary>Capture a frame for your notes</summary>

1. Open a Markdown note in editing mode and place the cursor.
2. Click the camera icon to save a clean frame with a timestamp.

![Capture a frame for your notes](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/capture-frame.gif)

</details>

<details>
<summary>Save just one AI answer</summary>

1. Find the reply you want to keep.
2. Click Save answer under that reply.

![Save just one AI answer](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/save-answer.gif)

</details>

<details>
<summary>Append new chat messages to a note</summary>

1. Click Save chat to note.
2. Later saves append only messages that have not been saved yet.

![Append new chat messages to a note](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/save-chat.gif)

</details>

<details>
<summary>Choose the chat note destination</summary>

1. Open Settings > Video Player (AI integrated).
2. Set Chat note folder and filename; {video} uses the video title.

![Choose the chat note destination](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/chat-destination.gif)

</details>

## Set up AI

Open this plugin’s settings and choose **AI backend**. For OpenAI or Anthropic, enter your own API key. API usage is billed by that provider. For local **Codex** or **Claude Code**, install and sign in to that application first; set **Codex command** or **Claude command** if it is not found automatically. Local CLI use can still send your content to its AI provider.

Start with **Automatic · Economy** for supported lightweight models. It caches selections for one hour and never automatically upgrades to a flagship model. Use **Manual** to choose a specific model; custom API base URLs require Manual mode. If using an API, run **Test API connection**.

## Captions, video files and privacy

Existing captions and basic playback do not require an AI key. Embedded local captions and sampled frames require **ffmpeg/ffprobe**; YouTube extraction may need **yt-dlp**. Install these tools and set **ffmpeg command / yt-dlp command** if detection fails. Place a matching .srt or .vtt file beside your local video to use sidecar subtitles. Media support depends on Obsidian’s video decoder; try an H.264 MP4 if playback fails.

If a video has no captions, configure **No-caption transcription** and its separate audio-service credentials; a Codex/Claude subscription alone does not supply that transcription API. Audio transcription can incur extra charges. AI requests send the relevant captions, conversation and any selected frames to your chosen provider. YouTube playback connects to YouTube.

Choose **Video screenshot folder** and **Video transcript folder** for exported material. Screenshots are inserted into an open note when the corresponding option is enabled. Local timestamp links need the original file to remain at the same path.

API keys are saved in this plugin’s settings in your vault. Keep those settings private, including when sharing or syncing your vault. If AI fails, check the selected backend, login/API key and model; quota or network errors do not cause an automatic model switch.

For selected text and document translation, use the separate [AI Translation Assistant](https://github.com/skye1349/obsidian-ai-translator).

## Help

Report a problem on [GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues); include the plugin version and error message, but never an API key or private notes.

Local video files you choose may be outside your vault. Local AI integrations also read the CLI’s model catalog and use its existing login in your user directory. The plugin does not install these tools for you.

[MIT License](LICENSE) · © 2026 Taoye
