# Video Player (AI integrated)

Mira YouTube y vídeos locales dentro de Obsidian, aprende con subtítulos bilingües y convierte capturas y conversaciones con IA en notas.

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

## Mira cómo funciona

Cada GIF muestra una función con instrucciones en inglés, clics resaltados y atajos de teclado.

[**Ver las 13 demostraciones**](docs/demos.md) · [Guía completa en vídeo](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/video-player-guide.mp4)

![Mira cómo funciona](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.0.0/capture-frame.gif)

## Traducir subtítulos desde Web Viewer

Abre un vídeo en **Web viewer** y activa los subtítulos del sitio. Ejecuta **Translate video subtitles from Web Viewer** y pulsa **Translate transcript with AI**. El vídeo sigue en la página original; el panel contiguo muestra solo la barra de herramientas y la transcripción, con resaltado sincronizado, controles y marcas de tiempo para saltar.

![Traducir subtítulos desde Web Viewer](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.gif)

[MP4](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.mp4) · [English subtitles](https://github.com/skye1349/obsidian-video-player-ai/releases/download/1.1.0/web-viewer-subtitles.en.srt)

Lee pistas de texto HTML5 accesibles; YouTube puede recurrir a yt-dlp. Vuelve a conectar al cambiar de vídeo o actualizar subtítulos dinámicos. No admite reproductores de otro origen, subtítulos propietarios o incrustados en la imagen, transcripción de audio web genérica ni captura de fotogramas web. El chat puede usar los subtítulos extraídos.

## Qué puedes hacer

- Reproducir YouTube y vídeos locales dentro de Obsidian.
- Leer subtítulos bilingües y exportarlos a una nota.
- Capturar imágenes con enlaces al momento del vídeo.
- Pedir resúmenes y explicaciones a la IA y continuar la conversación.
- Añadir mensajes nuevos a la misma nota o guardar una sola respuesta.
- Elegir carpetas para capturas, transcripciones y conversaciones.

## Instalación

Requiere Obsidian de escritorio 1.13.7 o posterior. No admite dispositivos móviles.

1. Abre **Ajustes → Plugins de la comunidad** y actívalos si se solicita.
2. Pulsa **Explorar (Browse)** y busca **Video Player (AI integrated)**.
3. Pulsa **Instalar (Install)** y después **Activar (Enable)**.
4. Abre los ajustes del plugin para elegir idioma y servicio de IA.

## Tu primer vídeo

1. Abre **Open video player** desde la cinta o la paleta de comandos.
2. Elige **Open YouTube / Open local video**.
3. Selecciona **Learning / target language** para traducir.
4. Usa **Copy current video frame** o **Create transcript note from current video**. Los enlaces de tiempo vuelven al momento del vídeo.

## Configurar IA

En los ajustes del plugin, elige **AI backend**. Para OpenAI o Anthropic introduce tu propia clave API; el proveedor cobra el uso. Para **Codex / Claude Code** locales, instala e inicia sesión primero. Si no se detectan, indica la ruta en **Codex command / Claude command**. Un CLI local también puede enviar contenido a su proveedor de IA.

Empieza con **Automatic · Economy**: modelos ligeros admitidos, selección en caché durante una hora y sin salto automático a modelos premium. Elige **Manual** para un modelo concreto o una URL API personalizada. Usa **Test API connection** para comprobar la API.

## Preguntar y guardar

Abre **AI help** para pedir resúmenes o explicaciones. Las preguntas posteriores usan el historial del mismo vídeo. Puedes enviar solo subtítulos, el fotograma actual o muestras disponibles. **Save chat to note** guarda todo inicialmente y luego añade solo mensajes no guardados a la misma nota. **Save answer** guarda únicamente la respuesta elegida. Configura **Chat note folder / Chat note filename**.

## Subtítulos y privacidad

La reproducción básica y los subtítulos existentes no requieren clave IA. Los subtítulos incrustados y fotogramas necesitan **ffmpeg/ffprobe**; la extracción de YouTube puede necesitar **yt-dlp**. Si no se detectan, configura sus rutas command. Coloca un .srt / .vtt con el mismo nombre junto al vídeo. Si no se reproduce, prueba un MP4 H.264.

Sin subtítulos, configura **No-caption transcription** con credenciales de audio independientes; la suscripción CLI no incluye esa API y puede haber cargos adicionales. Las solicitudes IA envían subtítulos, conversación e imágenes seleccionadas al proveedor. YouTube se conecta a YouTube. Ajusta **Video screenshot folder / Video transcript folder** para las notas. Los enlaces locales requieren conservar la ruta del vídeo.

Las claves API se guardan en los ajustes del plugin dentro de la bóveda. Protégelos al compartirla o sincronizarla. Si falla la IA, revisa el proveedor, la autenticación y el modelo. Los errores de cuota o red no cambian el modelo.

Para traducir texto usa [AI Translation Assistant](https://github.com/skye1349/obsidian-ai-translator).

## Ayuda

Informa en [GitHub Issues](https://github.com/skye1349/obsidian-video-player-ai/issues) con la versión y el error. No incluyas claves API ni notas privadas.

Los vídeos locales elegidos pueden estar fuera de la bóveda. Las integraciones IA locales leen el catálogo CLI y usan la sesión existente del directorio de usuario. El plugin no instala esas herramientas.

[MIT License](LICENSE) · © 2026 Taoye
