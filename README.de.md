# Video Player (AI integrated)

Sieh YouTube und lokale Videos in Obsidian an, lerne mit zweisprachigen Untertiteln und mache aus Bildern und KI-Gesprächen Notizen.

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## Was du damit machen kannst

- YouTube und lokale Videos in Obsidian abspielen.
- Zweisprachige Untertitel lesen und als Notiz exportieren.
- Bilder mit Zeitlinks zur passenden Videostelle aufnehmen.
- KI um Zusammenfassungen und Erklärungen bitten und weiterfragen.
- Neue Nachrichten an dieselbe Notiz anhängen oder eine Antwort speichern.
- Ordner für Bilder, Transkripte und Chatnotizen festlegen.

## Installation

Benötigt Obsidian für Desktop ab Version 1.13.7. Mobilgeräte werden nicht unterstützt.

1. Öffne **Einstellungen → Community-Erweiterungen** und aktiviere sie bei Bedarf.
2. Klicke auf **Durchsuchen (Browse)** und suche **Video Player (AI integrated)**.
3. Klicke auf **Installieren (Install)** und dann **Aktivieren (Enable)**.
4. Wähle Sprache und KI-Dienst in den Plugin-Einstellungen.

## Dein erstes Video

1. Öffne **Open video player** über die Seitenleiste oder Befehlspalette.
2. Wähle **Open YouTube / Open local video**.
3. Stelle **Learning / target language** ein.
4. Nutze **Copy current video frame** oder **Create transcript note from current video**. Zeitlinks führen zur passenden Videostelle zurück.

## KI einrichten

Wähle **AI backend** in den Plugin-Einstellungen. OpenAI oder Anthropic benötigen deinen eigenen API-Schlüssel; die Nutzung wird vom Anbieter berechnet. Installiere lokale **Codex / Claude Code** zuerst und melde dich an. Falls nötig, gib den Pfad unter **Codex command / Claude command** an. Auch lokale CLIs können Inhalte an ihren KI-Anbieter senden.

Beginne mit **Automatic · Economy**: unterstützte leichte Modelle, eine Stunde Zwischenspeicherung und kein automatischer Wechsel zu Premium. Für ein bestimmtes Modell oder eigene API-Adressen nutze **Manual**. Prüfe die API mit **Test API connection**. Beide Plugins haben getrennte Einstellungen.

## Fragen und Notizen

Öffne **AI help** für Zusammenfassungen und Erklärungen. Folgefragen nutzen den Verlauf desselben Videos. Wähle nur Untertitel, das aktuelle Bild oder verfügbare Stichprobenbilder. **Save chat to note** speichert zuerst das ganze Gespräch und ergänzt später nur ungespeicherte Nachrichten in derselben Notiz. **Save answer** speichert nur die angeklickte Antwort. Lege **Chat note folder / Chat note filename** fest.

## Untertitel und Datenschutz

Wiedergabe und vorhandene Untertitel benötigen keinen KI-Schlüssel. Eingebettete Untertitel und Einzelbilder brauchen **ffmpeg/ffprobe**, YouTube-Extraktion eventuell **yt-dlp**. Trage bei Bedarf die command-Pfade ein. Lege eine gleichnamige .srt / .vtt neben das Video. Bei Wiedergabeproblemen versuche H.264 MP4.

Ohne Untertitel richte **No-caption transcription** mit einem separaten Audiodienst ein. Das CLI-Abonnement liefert diese API nicht; zusätzliche Kosten sind möglich. KI-Anfragen senden Untertitel, Gespräch und ausgewählte Bilder an den Anbieter. YouTube verbindet sich mit YouTube. **Video screenshot folder / Video transcript folder** bestimmen die Ablage. Lokale Zeitlinks benötigen den ursprünglichen Dateipfad.

API-Schlüssel werden in den Plugin-Einstellungen im Vault gespeichert. Schütze diese beim Teilen oder Synchronisieren. Prüfe bei KI-Fehlern Anbieter, Anmeldung und Modell. Kontingent- oder Netzwerkfehler lösen keinen Modellwechsel aus.

Für Textübersetzung nutze [AI Translator](https://github.com/skye1349/obsidian-ai-translator). Beide funktionieren allein. Dieses neue Plugin ersetzt Read and Watch with AI nicht und verändert keine bisherigen Links.

## Hilfe

Melde Probleme in [GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues) mit Version und Fehlermeldung, aber ohne API-Schlüssel oder private Notizen.

Ausgewählte lokale Videos können außerhalb des Vaults liegen. Lokale KI-Anbindungen lesen den CLI-Modellkatalog und nutzen die vorhandene Anmeldung im Benutzerverzeichnis. Das Plugin installiert diese Werkzeuge nicht.

[MIT License](LICENSE) · © 2026 Taoye
