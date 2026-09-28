# Video Player (AI integrated)

Watch, understand and take notes without leaving Obsidian. Open YouTube or local videos, read bilingual captions, capture moments and ask AI about what you are watching.

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## See it in action

Short GIFs show one feature at a time, with English instructions, highlighted mouse clicks and keyboard shortcuts.

[**All 13 feature demos**](docs/demos.md) · [Full video guide](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/video-player-guide.mp4)

![See it in action](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/capture-frame.gif)

## Translate captions from Web Viewer

Open a video in the desktop **Web viewer** core plugin and enable captions on the website. Run **Translate video subtitles from Web Viewer**, then click **Translate transcript with AI**. The video stays on the original page; the adjacent panel shows only the toolbar and transcript, with synchronized highlighting, playback controls and clickable timestamps.

![Translate captions from Web Viewer](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.gif)

[MP4](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.mp4) · [English subtitles](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.en.srt)

Reads accessible HTML5 text tracks; YouTube can use the existing yt-dlp fallback. Reconnect after switching videos or to refresh dynamic captions. Cross-origin players, proprietary or burned-in subtitles and generic web audio transcription are not supported. Web video frame capture is unavailable; AI chat can use the extracted captions.

## What you can do

- Play YouTube and local videos inside your vault.
- Read bilingual subtitles and export captions as a note.
- Capture screenshots with links back to the video timestamp.
- Ask AI to summarize or explain the video, then ask follow-up questions.
- Append new chat messages to an existing note, or save just one answer.
- Choose your own folders for screenshots, transcripts and chat notes.

## Install

Desktop Obsidian 1.13.7 or later is required. Mobile is not supported.

1. Open **Settings → Community plugins** in Obsidian and enable community plugins if prompted.
2. Click **Browse** and search for **Video Player (AI integrated)**.
3. Click **Install**, then **Enable**.
4. Open the plugin’s settings to choose your language and AI service.

## Your first video

1. Click the **Open video player** ribbon button, or use the command palette.
2. Choose **Open YouTube** or **Open local video** and select your video.
3. Read the available captions. Choose **Learning / target language** in settings for translations.
4. Use **Copy current video frame** to capture a moment, or **Create transcript note from current video** to turn captions into a note. Timestamp links return to that moment.

## Set up AI

Open this plugin’s settings and choose **AI backend**. For OpenAI or Anthropic, enter your own API key. API usage is billed by that provider. For local **Codex** or **Claude Code**, install and sign in to that application first; set **Codex command** or **Claude command** if it is not found automatically. Local CLI use can still send your content to its AI provider.

Start with **Automatic · Economy** for supported lightweight models. It caches selections for one hour and never automatically upgrades to a flagship model. Use **Manual** to choose a specific model; custom API base URLs require Manual mode. If using an API, run **Test API connection**.

## Ask questions and save notes

Open **AI help** in the player. Ask for a summary or a specific explanation; follow-up questions use that video’s saved conversation. Choose subtitles only, the current frame or sampled frames when available. **Save chat to note** saves the conversation and subsequently appends only unsaved messages to the same note. **Save answer** saves only the response you click. Set **Chat note folder** and **Chat note filename** to control the destination.

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
