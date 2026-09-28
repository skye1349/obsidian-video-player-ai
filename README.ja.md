# Video Player (AI integrated)

ObsidianでYouTubeやローカル動画を視聴し、対訳字幕、スクリーンショット、AIへの質問をノートにまとめられます。

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## インストール

デスクトップ版 Obsidian 1.13.7 以降が必要です。モバイルには対応していません。

コミュニティ一覧の審査待ちです。インストールボタンが利用できるまでは手動で導入してください。

[最新リリース](https://github.com/skye1349/obsidian-video-player-ai/releases/latest)から **main.js**、**manifest.json**、**styles.css** を取得し、`<vault>/.obsidian/plugins/video-player-ai/` に置きます。Obsidian を再起動し、**設定 → コミュニティプラグイン**で **Video Player (AI integrated)** を有効化してください。公開承認後は Browse で名前を検索してインストールできます。

## 最初の動画

1. リボンまたはコマンドパレットから **Open video player** を開きます。
2. **Open YouTube / Open local video** で動画を選びます。
3. **Learning / target language** で翻訳言語を選びます。
4. **Copy current video frame** で画像を取得し、**Create transcript note from current video** で字幕ノートを作ります。時刻リンクから動画に戻れます。

## AI の設定

本プラグインの **AI backend** でサービスを選びます。OpenAI / Anthropic はご自身の API キーを入力してください。利用料金はサービス側で発生します。ローカルの **Codex / Claude Code** は先にインストールしてログインします。見つからない場合は **Codex command / Claude command** にパスを指定してください。ローカルCLIでも内容がAIサービスへ送られる場合があります。

通常は **Automatic · Economy** を使用します。対応する軽量モデルを選び、選択を1時間キャッシュし、高価格モデルへ自動変更しません。固定モデルや独自APIアドレスには **Manual** を選びます。API接続は **Test API connection** で確認できます。両プラグインの設定は独立しています。

## 質問と保存

**AI help** で要約や詳しい説明を頼めます。追質問には同じ動画の会話履歴を使います。字幕のみ、現在の画像、利用可能なサンプル画像を選択できます。**Save chat to note** は初回に会話全体、次回以降は未保存のメッセージだけを同じノートに追記します。**Save answer** はクリックした回答だけを保存します。**Chat note folder / Chat note filename** で保存先を設定します。

## 字幕とプライバシー

基本再生と既存字幕にはAIキーは不要です。埋め込み字幕や画像抽出には **ffmpeg/ffprobe**、YouTube抽出には **yt-dlp** が必要な場合があります。設定の各 command にパスを指定できます。同名の .srt / .vtt を動画の隣に置くと外部字幕を使えます。再生できない場合はH.264 MP4を試してください。

字幕がない場合は **No-caption transcription** の音声サービスを別途設定します。CLIの契約だけでは転写APIは使えず、追加料金が発生する場合があります。AIには字幕、会話、選択画像が送信され、YouTube再生はYouTubeへ接続します。**Video screenshot folder / Video transcript folder** で保存先を指定します。ローカル動画へのリンクは元のファイルパスが必要です。

APIキーは保管庫内のプラグイン設定に保存されます。保管庫の共有・同期時は設定を保護してください。AIエラー時はサービス、認証、モデルを確認します。残高・通信エラーではモデルを自動変更しません。

文章の翻訳には [AI Translator](https://github.com/skye1349/obsidian-ai-translator) を使用できます。どちらも単独で動作します。これは新しいプラグインであり、旧 Read and Watch with AI や既存リンクは変更しません。

## サポート

[GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues)にバージョンとエラーを報告してください。APIキーや非公開ノートは添付しないでください。

選択したローカル動画は保管庫の外にある場合があります。ローカルAI連携はユーザーディレクトリのCLIモデル情報と既存ログインを使用します。ツールの自動インストールは行いません。

[MIT License](LICENSE) · © 2026 Taoye
