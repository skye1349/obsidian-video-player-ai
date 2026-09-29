# Video Player (AI integrated)

Regardez YouTube et vos vidéos locales dans Obsidian, apprenez avec des sous-titres bilingues et transformez captures et échanges IA en notes.

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## Installation

Nécessite Obsidian pour ordinateur 1.13.7 ou ultérieur. Le mobile n’est pas pris en charge.

1. Ouvrez **Paramètres → Modules complémentaires** et activez-les si nécessaire.
2. Cliquez sur **Parcourir (Browse)** et recherchez **Video Player (AI integrated)**.
3. Cliquez sur **Installer (Install)**, puis **Activer (Enable)**.
4. Ouvrez les paramètres du module pour choisir la langue et le service IA.

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

## Votre première vidéo

1. Ouvrez **Open video player** depuis le ruban ou la palette.
2. Choisissez **Open YouTube / Open local video**.
3. Réglez **Learning / target language** pour la traduction.
4. Utilisez **Copy current video frame** ou **Create transcript note from current video**. Les liens horodatés reviennent au passage correspondant.

## Configurer l’IA

Choisissez **AI backend** dans les paramètres du module. OpenAI et Anthropic nécessitent votre propre clé API ; leur utilisation est facturée par le fournisseur. Pour **Codex / Claude Code** locaux, installez le logiciel et connectez-vous d’abord. Si nécessaire, indiquez son chemin dans **Codex command / Claude command**. Un CLI local peut aussi envoyer le contenu à son fournisseur IA.

Commencez avec **Automatic · Economy** : modèles légers pris en charge, choix conservé une heure, sans passage automatique au premium. Utilisez **Manual** pour fixer un modèle ou une URL API personnalisée. Vérifiez l’API avec **Test API connection**.

## Questions et notes

Ouvrez **AI help** pour demander un résumé ou une explication. Les questions suivantes utilisent l’historique de cette vidéo. Choisissez les sous-titres seuls, l’image actuelle ou les images échantillonnées disponibles. **Save chat to note** enregistre tout une première fois, puis ajoute seulement les messages non enregistrés à la même note. **Save answer** ne sauvegarde que la réponse choisie. Réglez **Chat note folder / Chat note filename**.

## Sous-titres et confidentialité

La lecture simple et les sous-titres existants ne nécessitent pas de clé IA. Les sous-titres intégrés et l’extraction d’images exigent **ffmpeg/ffprobe** ; YouTube peut nécessiter **yt-dlp**. Configurez les chemins command si nécessaire. Placez un .srt / .vtt de même nom à côté du fichier vidéo. En cas d’échec de lecture, essayez un MP4 H.264.

Sans sous-titres, configurez **No-caption transcription** et un service audio séparé ; l’abonnement CLI ne fournit pas cette API, et des frais supplémentaires sont possibles. L’IA reçoit sous-titres, conversation et images sélectionnées. YouTube se connecte à YouTube. Réglez **Video screenshot folder / Video transcript folder**. Les liens locaux exigent de conserver le chemin du fichier.

Les clés API sont enregistrées dans les paramètres du module dans le coffre. Protégez-les lors du partage ou de la synchronisation. En cas d’erreur, vérifiez le fournisseur, l’authentification et le modèle. Les erreurs de quota ou de réseau ne changent pas le modèle.

Pour traduire du texte, utilisez [AI Translation Assistant](https://github.com/skye1349/obsidian-ai-translator).

## Aide

Signalez les problèmes dans [GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues) avec la version et le message d’erreur, sans clé API ni note privée.

Les vidéos locales choisies peuvent se trouver hors du coffre. L’intégration IA locale lit le catalogue CLI et utilise la connexion existante du dossier utilisateur. Le module n’installe pas ces outils.

[MIT License](LICENSE) · © 2026 Taoye
