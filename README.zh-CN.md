# Video Player (AI integrated)

不用离开 Obsidian，就能看视频、理解内容并做笔记。支持 YouTube 和本地视频、双语字幕、画面截图，以及围绕视频内容的 AI 问答。

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## 安装

需要桌面版 Obsidian 1.13.7 或更新版本，不支持手机和平板。

社区插件目录正在等待审核。安装按钮开放前，请按下面的方法手动安装。

从[最新版本](https://github.com/skye1349/obsidian-video-player-ai/releases/latest)下载 **main.js**、**manifest.json** 和 **styles.css**。在笔记库中创建 `<笔记库>/.obsidian/plugins/video-player-ai/`，放入这三个文件，重启 Obsidian，然后在**设置 → 第三方插件**中启用 **Video Player (AI integrated)**。目录审核通过后，也可以在「浏览」中搜索 **Video Player (AI integrated)**，安装并启用。

## 打开第一个视频

1. 点击侧边栏 **Open video player**，也可以从命令面板打开。
2. 选择 **Open YouTube** 或 **Open local video**，输入链接或选择本地视频。
3. 阅读已有字幕，在设置的 **Learning / target language** 中选择翻译语言。
4. 使用 **Copy current video frame** 截取当前画面；使用 **Create transcript note from current video** 把字幕导出为笔记。笔记中的时间戳可以跳回对应片段。

## 配置 AI

打开本插件设置，在 **AI backend** 中选择服务。使用 OpenAI 或 Anthropic 时填写自己的 API key，费用由对应服务商收取。使用本地 **Codex** 或 **Claude Code** 时，先安装并登录对应程序；若无法自动找到，填写 **Codex command** 或 **Claude command** 路径。本地运行这些程序仍可能把内容发送给其 AI 服务商。

建议保留 **Automatic · Economy / 自动选择 · 经济型**，优先使用支持的轻量模型，缓存选择一小时，不自动升级旗舰模型。需要固定型号时切换 **Manual / 手动指定**；自定义 API 地址也请使用手动模式。API 用户可以点击 **Test API connection** 测试连接。两个插件的设置相互独立。

## 提问与保存笔记

打开播放器里的 **AI help**，让 AI 总结视频或解释某个细节。同一视频里的追问会带上已保存的聊天历史。可选择仅字幕、当前画面或可用的抽样画面。**Save chat to note** 首次保存整个聊天，之后只把未保存的新消息追加到同一篇笔记；每条回复的 **Save answer** 只保存你点击的那条回答。在 **Chat note folder** 和 **Chat note filename** 中设置保存位置与文件名。

## 字幕、视频文件与隐私

基本播放和阅读已有字幕不需要 AI key。提取本地内嵌字幕、抽取画面需要 **ffmpeg/ffprobe**；部分 YouTube 提取操作需要 **yt-dlp**。安装后如果没有自动识别，在 **ffmpeg command / yt-dlp command** 中填写路径。本地视频旁放置同名 .srt 或 .vtt 文件即可使用外挂字幕。格式支持取决于 Obsidian 的解码器；无法播放时可尝试 H.264 编码的 MP4。

视频没有字幕时，需要单独配置 **No-caption transcription** 和音频转写服务凭据；只有 Codex/Claude 订阅不能直接提供该转写 API。转写可能另行计费。AI 请求会向所选服务发送相关字幕、聊天历史，以及你选择的画面；YouTube 播放会连接 YouTube。

在 **Video screenshot folder**、**Video transcript folder** 中设置截图和字幕笔记位置。启用对应选项后，截图会插入当前打开的笔记。本地视频的时间戳链接需要原视频保留在原路径。

API key 保存在笔记库内的插件设置中，共享或同步笔记库时请保护这些设置。AI 无法使用时，检查服务商、登录/API key 和模型；额度不足或网络故障不会触发自动换模型。

文本与文档翻译请使用独立的 [AI Translator](https://github.com/skye1349/obsidian-ai-translator)。两个插件都可以单独使用。这是全新插件，不会替换 Read and Watch with AI，也不会改动原有笔记和链接。

## 获取帮助

请到 [GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues)反馈，附上插件版本和错误信息，不要上传 API key 或私人笔记。

你选择的本地视频可以位于笔记库之外。本地 AI 集成也会读取用户目录中的 CLI 模型目录，并使用已有登录。插件不会自行安装这些工具。

[MIT License](LICENSE) · © 2026 Taoye
