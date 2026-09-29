# Video Player (AI integrated)

ObsidianでYouTubeやローカル動画を視聴し、対訳字幕、スクリーンショット、AIへの質問をノートにまとめられます。

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## インストール

デスクトップ版 Obsidian 1.13.7 以降が必要です。モバイルには対応していません。

1. Obsidian の**設定 → コミュニティプラグイン**を開き、必要なら有効にします。
2. **閲覧（Browse）**で **Video Player (AI integrated)** を検索します。
3. **インストール（Install）**、**有効化（Enable）**の順に選びます。
4. プラグイン設定で言語とAIサービスを選びます。

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

## 最初の動画

1. リボンまたはコマンドパレットから **Open video player** を開きます。
2. **Open YouTube / Open local video** で動画を選びます。
3. **Learning / target language** で翻訳言語を選びます。
4. **Copy current video frame** で画像を取得し、**Create transcript note from current video** で字幕ノートを作ります。時刻リンクから動画に戻れます。

## AI の設定

本プラグインの **AI backend** でサービスを選びます。OpenAI / Anthropic はご自身の API キーを入力してください。利用料金はサービス側で発生します。ローカルの **Codex / Claude Code** は先にインストールしてログインします。見つからない場合は **Codex command / Claude command** にパスを指定してください。ローカルCLIでも内容がAIサービスへ送られる場合があります。

通常は **Automatic · Economy** を使用します。対応する軽量モデルを選び、選択を1時間キャッシュし、高価格モデルへ自動変更しません。固定モデルや独自APIアドレスには **Manual** を選びます。API接続は **Test API connection** で確認できます。

## 質問と保存

**AI help** で要約や詳しい説明を頼めます。追質問には同じ動画の会話履歴を使います。字幕のみ、現在の画像、利用可能なサンプル画像を選択できます。**Save chat to note** は初回に会話全体、次回以降は未保存のメッセージだけを同じノートに追記します。**Save answer** はクリックした回答だけを保存します。**Chat note folder / Chat note filename** で保存先を設定します。

## 字幕とプライバシー

基本再生と既存字幕にはAIキーは不要です。埋め込み字幕や画像抽出には **ffmpeg/ffprobe**、YouTube抽出には **yt-dlp** が必要な場合があります。設定の各 command にパスを指定できます。同名の .srt / .vtt を動画の隣に置くと外部字幕を使えます。再生できない場合はH.264 MP4を試してください。

字幕がない場合は **No-caption transcription** の音声サービスを別途設定します。CLIの契約だけでは転写APIは使えず、追加料金が発生する場合があります。AIには字幕、会話、選択画像が送信され、YouTube再生はYouTubeへ接続します。**Video screenshot folder / Video transcript folder** で保存先を指定します。ローカル動画へのリンクは元のファイルパスが必要です。

APIキーは保管庫内のプラグイン設定に保存されます。保管庫の共有・同期時は設定を保護してください。AIエラー時はサービス、認証、モデルを確認します。残高・通信エラーではモデルを自動変更しません。

文章の翻訳には [AI Translation Assistant](https://github.com/skye1349/obsidian-ai-translator) を使用できます。

## サポート

[GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues)にバージョンとエラーを報告してください。APIキーや非公開ノートは添付しないでください。

選択したローカル動画は保管庫の外にある場合があります。ローカルAI連携はユーザーディレクトリのCLIモデル情報と既存ログインを使用します。ツールの自動インストールは行いません。

[MIT License](LICENSE) · © 2026 Taoye
