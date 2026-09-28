# Video Player (AI integrated)

Watch, understand and take notes without leaving Obsidian. Open YouTube or local videos, read bilingual captions, capture moments and ask AI about what you are watching.

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## Install

Desktop Obsidian 1.13.7 or later is required. Mobile is not supported.

Community-directory review is pending. Until the Install button is available, use the manual installation below.

Download **main.js**, **manifest.json**, and **styles.css** from the [latest release](https://github.com/skye1349/obsidian-video-player-ai/releases/latest). Create `<vault>/.obsidian/plugins/video-player-ai/`, put the three files there, restart Obsidian, then enable **Video Player (AI integrated)** in **Settings → Community plugins**. When the directory listing is approved, you can instead search for **Video Player (AI integrated)** under **Browse**, install and enable it.

## Your first video

1. Click the **Open video player** ribbon button, or use the command palette.
2. Choose **Open YouTube** or **Open local video** and select your video.
3. Read the available captions. Choose **Learning / target language** in settings for translations.
4. Use **Copy current video frame** to capture a moment, or **Create transcript note from current video** to turn captions into a note. Timestamp links return to that moment.

## Set up AI

Open this plugin’s settings and choose **AI backend**. For OpenAI or Anthropic, enter your own API key. API usage is billed by that provider. For local **Codex** or **Claude Code**, install and sign in to that application first; set **Codex command** or **Claude command** if it is not found automatically. Local CLI use can still send your content to its AI provider.

Start with **Automatic · Economy** for supported lightweight models. It caches selections for one hour and never automatically upgrades to a flagship model. Use **Manual** to choose a specific model; custom API base URLs require Manual mode. If using an API, run **Test API connection**. Each plugin has its own settings.

## Ask questions and save notes

Open **AI help** in the player. Ask for a summary or a specific explanation; follow-up questions use that video’s saved conversation. Choose subtitles only, the current frame or sampled frames when available. **Save chat to note** saves the conversation and subsequently appends only unsaved messages to the same note. **Save answer** saves only the response you click. Set **Chat note folder** and **Chat note filename** to control the destination.

## Captions, video files and privacy

Existing captions and basic playback do not require an AI key. Embedded local captions and sampled frames require **ffmpeg/ffprobe**; YouTube extraction may need **yt-dlp**. Install these tools and set **ffmpeg command / yt-dlp command** if detection fails. Place a matching .srt or .vtt file beside your local video to use sidecar subtitles. Media support depends on Obsidian’s video decoder; try an H.264 MP4 if playback fails.

If a video has no captions, configure **No-caption transcription** and its separate audio-service credentials; a Codex/Claude subscription alone does not supply that transcription API. Audio transcription can incur extra charges. AI requests send the relevant captions, conversation and any selected frames to your chosen provider. YouTube playback connects to YouTube.

Choose **Video screenshot folder** and **Video transcript folder** for exported material. Screenshots are inserted into an open note when the corresponding option is enabled. Local timestamp links need the original file to remain at the same path.

API keys are saved in this plugin’s settings in your vault. Keep those settings private, including when sharing or syncing your vault. If AI fails, check the selected backend, login/API key and model; quota or network errors do not cause an automatic model switch.

For selected text and document translation, use the separate [AI Translator](https://github.com/skye1349/obsidian-ai-translator). Neither plugin requires the other. This is a new plugin, not an update to Read and Watch with AI; old notes and links are left untouched.

## Help

Report a problem on [GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues); include the plugin version and error message, but never an API key or private notes.

Local video files you choose may be outside your vault. Local AI integrations also read the CLI’s model catalog and use its existing login in your user directory. The plugin does not install these tools for you.

[MIT License](LICENSE) · © 2026 Taoye
