# Video Player (AI integrated)

Obsidian에서 YouTube와 로컬 영상을 보고, 이중 언어 자막·스크린샷·AI 질문으로 학습 노트를 만드세요.

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## 사용 방법 살펴보기

각 GIF는 한 가지 기능을 보여 줍니다. 영어 안내, 마우스 클릭 강조, 키보드 단축키 표시가 포함되어 있습니다.

[**12개 기능 데모 보기**](docs/demos.md) · [전체 동영상 가이드](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/video-player-guide.mp4)

![사용 방법 살펴보기](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/capture-frame.gif)

## 주요 기능

- Obsidian에서 YouTube와 로컬 영상을 재생합니다.
- 이중 언어 자막을 읽고 자막 노트를 만듭니다.
- 화면을 캡처하고 시간 링크로 해당 장면에 돌아갑니다.
- AI 요약과 설명을 받고 대화를 이어 질문합니다.
- 새 메시지만 같은 노트에 추가하거나 답변 하나만 저장합니다.
- 스크린샷·자막·대화 노트의 저장 위치를 정합니다.

## 설치

데스크톱 Obsidian 1.13.7 이상이 필요합니다. 모바일은 지원하지 않습니다.

1. Obsidian **설정 → 커뮤니티 플러그인**을 열고 필요한 경우 활성화합니다.
2. **탐색(Browse)**에서 **Video Player (AI integrated)**을 검색합니다.
3. **설치(Install)** 후 **활성화(Enable)**를 누릅니다.
4. 플러그인 설정에서 언어와 AI 서비스를 선택합니다.

## 첫 영상 열기

1. 리본이나 명령 팔레트에서 **Open video player**를 엽니다.
2. **Open YouTube / Open local video**로 영상을 선택합니다.
3. **Learning / target language**에서 번역 언어를 설정합니다.
4. **Copy current video frame**으로 캡처하거나 **Create transcript note from current video**로 자막 노트를 만듭니다. 시간 링크로 영상 위치에 돌아갈 수 있습니다.

## AI 설정

플러그인 설정의 **AI backend**에서 서비스를 고릅니다. OpenAI 또는 Anthropic은 본인의 API 키를 입력하며 사용료는 해당 업체에서 청구합니다. 로컬 **Codex / Claude Code**는 먼저 설치하고 로그인하세요. 찾지 못하면 **Codex command / Claude command** 경로를 지정하세요. 로컬 CLI도 내용을 AI 서비스로 전송할 수 있습니다.

기본 **Automatic · Economy**는 지원되는 경량 모델을 선택하고 한 시간 캐시하며 고가 모델로 자동 변경하지 않습니다. 특정 모델 또는 사용자 지정 API 주소는 **Manual**을 사용하세요. API는 **Test API connection**으로 확인할 수 있습니다. 두 플러그인의 설정은 독립적입니다.

## 질문과 저장

**AI help**에서 요약이나 설명을 요청하세요. 후속 질문에는 같은 영상의 대화 기록이 포함됩니다. 자막만, 현재 화면, 가능한 샘플 화면을 선택할 수 있습니다. **Save chat to note**는 처음에는 전체 대화, 이후에는 저장하지 않은 메시지만 같은 노트에 추가합니다. **Save answer**는 클릭한 답변만 저장합니다. **Chat note folder / Chat note filename**으로 저장 위치를 정하세요.

## 자막과 개인정보

기본 재생과 기존 자막에는 AI 키가 필요 없습니다. 내장 자막 및 프레임 추출에는 **ffmpeg/ffprobe**, YouTube 추출에는 **yt-dlp**가 필요할 수 있습니다. 자동 탐지가 실패하면 command 경로를 설정하세요. 영상 옆에 같은 이름의 .srt / .vtt를 놓으면 외부 자막을 사용할 수 있습니다. 재생이 안 되면 H.264 MP4를 시도하세요.

자막이 없으면 **No-caption transcription**에서 별도의 음성 서비스 키를 설정합니다. CLI 구독만으로 전사 API를 사용할 수 없으며 추가 요금이 발생할 수 있습니다. AI에는 자막, 대화, 선택 화면이 전송되고 YouTube 재생은 YouTube에 연결됩니다. **Video screenshot folder / Video transcript folder**로 저장 위치를 지정하세요. 로컬 시간 링크는 원래 파일 경로가 필요합니다.

API 키는 보관함 안의 플러그인 설정에 저장됩니다. 보관함 공유·동기화 시 설정을 보호하세요. AI 오류가 나면 서비스, 로그인/키, 모델을 확인하세요. 할당량과 네트워크 오류는 모델 변경을 유발하지 않습니다.

텍스트 번역은 [AI Translator](https://github.com/skye1349/obsidian-ai-translator)를 사용하세요. 둘 다 독립적으로 동작합니다. 새 플러그인이므로 기존 Read and Watch with AI 및 기존 링크를 변경하지 않습니다.

## 도움말

[GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues)에 버전과 오류를 남겨 주세요. API 키나 개인 노트는 올리지 마세요.

선택한 로컬 영상은 보관함 밖에 있을 수 있습니다. 로컬 AI 연동은 사용자 폴더의 CLI 모델 정보와 기존 로그인을 사용합니다. 도구를 자동 설치하지 않습니다.

[MIT License](LICENSE) · © 2026 Taoye
