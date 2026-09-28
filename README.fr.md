# Video Player (AI integrated)

Regardez YouTube et vos vidéos locales dans Obsidian, apprenez avec des sous-titres bilingues et transformez captures et échanges IA en notes.

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## Organize local playlists

**One folder, one playlist.** Click **Add playlist**, choose any local folder, and let Video Player organize its videos into chapters with natural ordering and durations. Your files stay where they are.

![Add a playlist, mark previous lessons watched, and continue playback](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.2.0/local-playlists.gif)

[MP4](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.2.0/local-playlists.mp4) · [English subtitles](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.2.0/local-playlists.en.srt)

- **Already watched some lessons?** Click **Mark watched** on a video, or select lessons and click **Mark as watched**. Completion totals update immediately. **Mark as unwatched** reverses the selection.
- **Continue watching** resumes your saved position. Finishing a video marks it watched and offers **Play next**.
- **Rescan** adds new videos while preserving progress. Missing files keep their records; use **Locate folder** if you move the folder.
- Reorder videos within a chapter, edit playlist names, and keep an associated note for each video.

Works for courses, TV series, documentaries, or any folder of local videos. Duration scanning uses local **ffprobe**; configure its path under **Duration settings** if needed. Unknown durations can be filled in during playback. Playlists and progress are saved in `video-library.json` in the plugin folder, separately from AI settings. No AI account is needed for playlists or basic playback.


## Voir le plugin en action

Chaque GIF présente une fonction, avec des instructions en anglais, les clics mis en évidence et les raccourcis clavier.

[**Voir les 13 démonstrations**](docs/demos.md) · [Guide vidéo complet](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/video-player-guide.mp4)

![Voir le plugin en action](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/capture-frame.gif)

## Traduire les sous-titres de Web Viewer

Ouvrez une vidéo dans **Web viewer** et activez les sous-titres du site. Lancez **Translate video subtitles from Web Viewer**, puis **Translate transcript with AI**. La vidéo reste sur sa page ; le panneau voisin affiche uniquement la barre d’outils et la transcription, avec surlignage synchronisé, commandes et horodatages cliquables.

![Traduire les sous-titres de Web Viewer](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.gif)

[MP4](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.mp4) · [English subtitles](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.en.srt)

Lit les pistes de texte HTML5 accessibles ; YouTube peut utiliser yt-dlp. Reconnectez après un changement de vidéo ou pour actualiser des sous-titres dynamiques. Les lecteurs d’une autre origine, les sous-titres propriétaires ou incrustés, la transcription audio web générique et la capture d’images web ne sont pas pris en charge. Le chat peut utiliser les sous-titres extraits.

## Ce que vous pouvez faire

- Lire YouTube et vos vidéos locales dans Obsidian.
- Lire des sous-titres bilingues et les exporter dans une note.
- Capturer des images avec des liens vers le passage vidéo.
- Demander des résumés et explications à l’IA, puis poursuivre la discussion.
- Ajouter les nouveaux messages à la même note ou sauvegarder une réponse.
- Choisir les dossiers des captures, transcriptions et conversations.

## Installation

Nécessite Obsidian pour ordinateur 1.13.7 ou ultérieur. Le mobile n’est pas pris en charge.

1. Ouvrez **Paramètres → Modules complémentaires** et activez-les si nécessaire.
2. Cliquez sur **Parcourir (Browse)** et recherchez **Video Player (AI integrated)**.
3. Cliquez sur **Installer (Install)**, puis **Activer (Enable)**.
4. Ouvrez les paramètres du module pour choisir la langue et le service IA.

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
