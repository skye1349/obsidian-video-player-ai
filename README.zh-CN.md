# Video Player (AI integrated)

不用离开 Obsidian，就能看视频、理解内容并做笔记。支持 YouTube 和本地视频、双语字幕、画面截图，以及围绕视频内容的 AI 问答。

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## 安装

需要桌面版 Obsidian 1.13.7 或更新版本，不支持手机和平板。

1. 打开 Obsidian 的**设置 → 第三方插件**，如有提示先启用第三方插件。
2. 点击**浏览**，搜索 **Video Player (AI integrated)**。
3. 点击**安装**，然后**启用**。
4. 打开插件设置，选择语言和 AI 服务。

## Feature walkthroughs

Choose a feature below to expand its short GIF and instructions. Each demo covers the named feature.

[Watch and organize](#watch-and-organize) · [Read and translate captions](#read-and-translate-captions) · [Ask AI](#ask-ai) · [Keep notes](#keep-notes)

The recordings use English instructions and highlighted clicks. **Cmd/Ctrl** means Command on macOS and Ctrl on Windows/Linux. [Demo notes and requirements](docs/demos.md#before-you-start).

### Watch and organize

<details>
<summary>Organize local playlists and track progress</summary>

1. Start with **Add playlist** to import a folder, or **Create empty playlist** to name a playlist first. Use **Add videos** or **Add folder** to combine media from different locations. You can select multiple files or paste one absolute path per line.
2. Select lessons you have already completed and click **Mark as watched**. Use **Continue watching** to pick up the next lesson.

![Local playlists](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.3.0/local-playlists.gif)

[Watch MP4](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.3.0/local-playlists.mp4) · [English subtitles](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.3.0/local-playlists.en.srt)

Your videos stay in their original locations. The same file is added only once per playlist; files with the same name in different folders stay separate. **Rescan** updates all folder sources while preserving manually added videos and progress; each **Locate folder** button reconnects only its own source folder. **Mark as unwatched** resets selected lessons. You can also reorder videos within a chapter and keep a note for each video.

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

## 打开第一个视频

1. 点击侧边栏 **Open video player**，也可以从命令面板打开。
2. 选择 **Open YouTube** 或 **Open local video**，输入链接或选择本地视频。
3. 阅读已有字幕，在设置的 **Learning / target language** 中选择翻译语言。
4. 使用 **Copy current video frame** 截取当前画面；使用 **Create transcript note from current video** 把字幕导出为笔记。笔记中的时间戳可以跳回对应片段。

## 配置 AI

打开本插件设置，在 **AI backend** 中选择服务。使用 OpenAI 或 Anthropic 时填写自己的 API key，费用由对应服务商收取。使用本地 **Codex** 或 **Claude Code** 时，先安装并登录对应程序；若无法自动找到，填写 **Codex command** 或 **Claude command** 路径。本地运行这些程序仍可能把内容发送给其 AI 服务商。

建议保留 **Automatic · Economy / 自动选择 · 经济型**，优先使用支持的轻量模型，缓存选择一小时，不自动升级旗舰模型。需要固定型号时切换 **Manual / 手动指定**；自定义 API 地址也请使用手动模式。API 用户可以点击 **Test API connection** 测试连接。

## 提问与保存笔记

打开播放器里的 **AI help**，让 AI 总结视频或解释某个细节。同一视频里的追问会带上已保存的聊天历史。可选择仅字幕、当前画面或可用的抽样画面。**Save chat to note** 首次保存整个聊天，之后只把未保存的新消息追加到同一篇笔记；每条回复的 **Save answer** 只保存你点击的那条回答。在 **Chat note folder** 和 **Chat note filename** 中设置保存位置与文件名。

## 字幕、视频文件与隐私

基本播放和阅读已有字幕不需要 AI key。提取本地内嵌字幕、抽取画面需要 **ffmpeg/ffprobe**；部分 YouTube 提取操作需要 **yt-dlp**。安装后如果没有自动识别，在 **ffmpeg command / yt-dlp command** 中填写路径。本地视频旁放置同名 .srt 或 .vtt 文件即可使用外挂字幕。格式支持取决于 Obsidian 的解码器；无法播放时可尝试 H.264 编码的 MP4。

视频没有字幕时，需要单独配置 **No-caption transcription** 和音频转写服务凭据；只有 Codex/Claude 订阅不能直接提供该转写 API。转写可能另行计费。AI 请求会向所选服务发送相关字幕、聊天历史，以及你选择的画面；YouTube 播放会连接 YouTube。

在 **Video screenshot folder**、**Video transcript folder** 中设置截图和字幕笔记位置。启用对应选项后，截图会插入当前打开的笔记。本地视频的时间戳链接需要原视频保留在原路径。

API key 保存在笔记库内的插件设置中，共享或同步笔记库时请保护这些设置。AI 无法使用时，检查服务商、登录/API key 和模型；额度不足或网络故障不会触发自动换模型。

文本与文档翻译请使用独立的 [AI Translation Assistant](https://github.com/skye1349/obsidian-ai-translator)。

## 获取帮助

请到 [GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues)反馈，附上插件版本和错误信息，不要上传 API key 或私人笔记。

你选择的本地视频可以位于笔记库之外。本地 AI 集成也会读取用户目录中的 CLI 模型目录，并使用已有登录。插件不会自行安装这些工具。

[MIT License](LICENSE) · © 2026 Taoye
