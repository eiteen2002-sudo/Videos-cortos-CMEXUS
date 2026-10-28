# Videos cortos COMEXUS — Serie Fulbright–García Robles

Serie de videos cortos informativos para audiencias internacionales y estadounidenses (Fulbright–García Robles Programs for U.S. Citizens).

## Estructura

| Ruta | Contenido |
| --- | --- |
| `docs/HANDOFF.md` | Handoff original del video maestro FB_V01 (sin modificar). |
| `docs/HALLAZGOS.md` | Hallazgos, errores y mejoras (auditoría de guion/marca + estado técnico). |
| `docs/CAMBIOS_ABIERTOS.md` | Registro de elementos **preliminares y editables** (diseño, imágenes, datos). |
| `docs/referencia/Fulbright_Brand_Guide.md` | Guía de marca Fulbright (v10.22.19), fuente de verdad de marca. |
| `guiones/video-01/` | Guion (`guion.md`) y storyboard (`storyboard.md`) del Video 1. |
| `ui_kits/video-master/` | Reproductor/editor del video maestro FB_V01 y `content/video-01.content.js` (guion, imágenes, duraciones). |

## Video maestro y edición de contenido

`ui_kits/video-master/Master Sequence.html` es un reproductor 1920×1080 de 8 escenas (7 del handoff + cierre/CTA del storyboard) **totalmente dirigido por datos**. Se abre directo en el navegador (sin servidor) y trae un panel **Editor**.

| Qué cambiar | Cómo |
| --- | --- |
| Guion / VO, títulos, cifras, duraciones, orden, escenas | Panel Editor (se guarda en el navegador) → **Descargar contenido** → reemplazar `ui_kits/video-master/content/video-01.content.js`. También se puede editar ese archivo a mano. |
| Voz activa | Cada escena tiene `vo` (original) y `vo_propuesta` (voz activa, de `HALLAZGOS.md` B1/B2). Casilla "Voz activa (propuesta)" para previsualizar; botón para adoptarla. |
| Imágenes | Cambiar `file`, `pos` (encuadre) y `zoom` por imagen en el Editor, o reemplazar el archivo en `FB_V01_ASSETS/` y subir `assetVersion`. Se puede añadir/quitar imágenes y previsualizar archivos nuevos al instante. |
| Layouts | `photo`, `stats`, `portraits`, `bridge`, `programs`, `closing` (en `scenes.js`; añadir uno nuevo es agregar una función a `layouts`). |
| Marca | `styles.css` (Legacy Blue, Azure, Sky, Gray; Montserrat). Los logos no se modifican. |

Las cifras sin validar muestran la etiqueta **[POR VALIDAR]** en pantalla.

## Pendiente: assets y código original

Las imágenes y logos de `ui_kits/video-master/FB_V01_ASSETS/` **aún no están en el repo** (el handoff los lista pero no se adjuntaron); el reproductor muestra un recuadro con el nombre del archivo esperado. Copia ahí los archivos con los nombres del handoff (`docs/HANDOFF.md`). El `scenes.jsx`/`animations-v3.jsx` originales de Claude Design no se adjuntaron; `scenes.js` es una reimplementación compatible con la estructura del handoff. La exportación a MP4 sigue pendiente (ver `HALLAZGOS.md` T3).

## Reglas de marca (resumen)

- Inglés estadounidense formal, **voz activa**, sin slang; "Fulbrighters" sin comillas.
- Colores: Legacy Blue `#003DA5`, Azure Blue `#0077C8`, Sky Blue `#00A9E0`, Light Gray `#C7C9C7`, White `#FFFFFF`.
- Tipografía: FF Mark / Montserrat; Hoefler Mercury / Source Serif.
- Logos aprobados, sin modificar. Espacio libre 2X (mínimo X); separación en co-branding ≥ ancho del globo.
- Alto contraste (Sección 508). Fotografía centrada en personas.
- Toda cifra o fecha ausente de los documentos fuente se marca **[POR VALIDAR]**.
