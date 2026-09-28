# Recording the Web Viewer demos

The 1.1.0 GIFs and MP4s are captured from real Obsidian 1.13.7, using both public plugins and original sample material. The passage preview uses the plugin’s online translation, then the sparkle action makes a real Codex request. Subtitle translation also uses Codex. No translation results are mocked. The recording disables the selection modifier requirement; the default is Cmd/Ctrl. Silent exports shorten provider waiting time.

The optional recording scripts are intended for macOS with Node dependencies installed, Python with Pillow, ffmpeg, and a signed-in Codex CLI. Clone the translator repository beside this repository and build both first. The recording sends only generated sample text to translation providers and stores no credentials.

```sh
python3 scripts/create-demo-lesson.py /tmp/web-viewer-media
OBSIDIAN_TEST_PLUGINS=.,../obsidian-ai-translator \
DEMO_OUTPUT=/tmp/web-viewer-recording \
DEMO_MEDIA='/tmp/web-viewer-media/Learn in three steps.mp4' \
npx wdio run wdio.conf.mts --spec scripts/record-web-viewer.e2e.ts
python3 scripts/export-web-viewer-demos.py /tmp/web-viewer-recording
```

Use a new output directory for each recording. The exporter generates a GIF, H.264 MP4, English SRT, and poster for each feature under `exports/`. Captured frames and verification JSON stay local. Review the recordings before uploading the six media assets to the corresponding release.
