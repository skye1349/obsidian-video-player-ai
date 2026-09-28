# Video Player (AI integrated)

ObsidianでYouTubeやローカル動画を視聴し、対訳字幕、スクリーンショット、AIへの質問をノートにまとめられます。

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## 使い方を動画で見る

各 GIF で一つの機能を紹介します。英語の手順、クリック位置の強調、キーボード操作の表示が付いています。

[**13 個の機能デモを見る**](docs/demos.md) · [動画ガイド全編](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/video-player-guide.mp4)

![使い方を動画で見る](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/capture-frame.gif)

## Web Viewer の動画字幕を翻訳

**Web viewer** で動画を開き、サイト側で字幕を有効にします。**Translate video subtitles from Web Viewer** を実行し、**Translate transcript with AI** をクリックします。動画は元のページで再生され、隣のパネルにはツールバーと字幕一覧だけが表示されます。同期ハイライト、再生操作、タイムスタンプによる移動に対応します。

![Web Viewer の動画字幕を翻訳](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.gif)

[MP4](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.mp4) · [English subtitles](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.en.srt)

HTML5 のテキスト字幕を読み取ります。YouTube では yt-dlp も利用できます。動画の変更や動的字幕の更新後は再接続してください。クロスオリジンのプレイヤー、独自形式・焼き込み字幕、一般のウェブ動画の音声認識や画像取得は未対応です。AI チャットには取得した字幕を利用できます。

## できること

- YouTubeとローカル動画をObsidian内で再生。
- 対訳字幕を読み、字幕をノートに書き出す。
- 画像を保存し、時刻リンクから動画へ戻る。
- AIに要約や説明を頼み、会話の続きを質問する。
- 新しいメッセージを同じノートに追記、または回答を個別保存。
- 画像・字幕・チャットノートの保存先を指定。

## インストール

デスクトップ版 Obsidian 1.13.7 以降が必要です。モバイルには対応していません。

1. Obsidian の**設定 → コミュニティプラグイン**を開き、必要なら有効にします。
2. **閲覧（Browse）**で **Video Player (AI integrated)** を検索します。
3. **インストール（Install）**、**有効化（Enable）**の順に選びます。
4. プラグイン設定で言語とAIサービスを選びます。

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
