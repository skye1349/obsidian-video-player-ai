# Video Player (AI integrated)

Obsidian에서 YouTube와 로컬 영상을 보고, 이중 언어 자막·스크린샷·AI 질문으로 학습 노트를 만드세요.

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## 설치

데스크톱 Obsidian 1.13.7 이상이 필요합니다. 모바일은 지원하지 않습니다.

1. Obsidian **설정 → 커뮤니티 플러그인**을 열고 필요한 경우 활성화합니다.
2. **탐색(Browse)**에서 **Video Player (AI integrated)**을 검색합니다.
3. **설치(Install)** 후 **활성화(Enable)**를 누릅니다.
4. 플러그인 설정에서 언어와 AI 서비스를 선택합니다.

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

## 첫 영상 열기

1. 리본이나 명령 팔레트에서 **Open video player**를 엽니다.
2. **Open YouTube / Open local video**로 영상을 선택합니다.
3. **Learning / target language**에서 번역 언어를 설정합니다.
4. **Copy current video frame**으로 캡처하거나 **Create transcript note from current video**로 자막 노트를 만듭니다. 시간 링크로 영상 위치에 돌아갈 수 있습니다.

## AI 설정

플러그인 설정의 **AI backend**에서 서비스를 고릅니다. OpenAI 또는 Anthropic은 본인의 API 키를 입력하며 사용료는 해당 업체에서 청구합니다. 로컬 **Codex / Claude Code**는 먼저 설치하고 로그인하세요. 찾지 못하면 **Codex command / Claude command** 경로를 지정하세요. 로컬 CLI도 내용을 AI 서비스로 전송할 수 있습니다.

기본 **Automatic · Economy**는 지원되는 경량 모델을 선택하고 한 시간 캐시하며 고가 모델로 자동 변경하지 않습니다. 특정 모델 또는 사용자 지정 API 주소는 **Manual**을 사용하세요. API는 **Test API connection**으로 확인할 수 있습니다.

## 질문과 저장

**AI help**에서 요약이나 설명을 요청하세요. 후속 질문에는 같은 영상의 대화 기록이 포함됩니다. 자막만, 현재 화면, 가능한 샘플 화면을 선택할 수 있습니다. **Save chat to note**는 처음에는 전체 대화, 이후에는 저장하지 않은 메시지만 같은 노트에 추가합니다. **Save answer**는 클릭한 답변만 저장합니다. **Chat note folder / Chat note filename**으로 저장 위치를 정하세요.

## 자막과 개인정보

기본 재생과 기존 자막에는 AI 키가 필요 없습니다. 내장 자막 및 프레임 추출에는 **ffmpeg/ffprobe**, YouTube 추출에는 **yt-dlp**가 필요할 수 있습니다. 자동 탐지가 실패하면 command 경로를 설정하세요. 영상 옆에 같은 이름의 .srt / .vtt를 놓으면 외부 자막을 사용할 수 있습니다. 재생이 안 되면 H.264 MP4를 시도하세요.

자막이 없으면 **No-caption transcription**에서 별도의 음성 서비스 키를 설정합니다. CLI 구독만으로 전사 API를 사용할 수 없으며 추가 요금이 발생할 수 있습니다. AI에는 자막, 대화, 선택 화면이 전송되고 YouTube 재생은 YouTube에 연결됩니다. **Video screenshot folder / Video transcript folder**로 저장 위치를 지정하세요. 로컬 시간 링크는 원래 파일 경로가 필요합니다.

API 키는 보관함 안의 플러그인 설정에 저장됩니다. 보관함 공유·동기화 시 설정을 보호하세요. AI 오류가 나면 서비스, 로그인/키, 모델을 확인하세요. 할당량과 네트워크 오류는 모델 변경을 유발하지 않습니다.

텍스트 번역은 [AI Translation Assistant](https://github.com/skye1349/obsidian-ai-translator)를 사용하세요.

## 도움말

[GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues)에 버전과 오류를 남겨 주세요. API 키나 개인 노트는 올리지 마세요.

선택한 로컬 영상은 보관함 밖에 있을 수 있습니다. 로컬 AI 연동은 사용자 폴더의 CLI 모델 정보와 기존 로그인을 사용합니다. 도구를 자동 설치하지 않습니다.

[MIT License](LICENSE) · © 2026 Taoye
