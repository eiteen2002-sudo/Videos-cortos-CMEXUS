# Hallazgos, errores y mejoras

Actualizado a partir de `HANDOFF.md` y de la auditoría de guion/storyboard del Video 1.

## A. Estado técnico (del handoff)

| # | Tipo | Hallazgo | Acción sugerida |
| --- | --- | --- | --- |
| T1 | Pendiente | Recortes `object-position` sin revisar con las 7 fotos nuevas. | Revisar escena por escena ajustando `pos` en el componente `Photo`. |
| T2 | Pendiente | `DSC07042.jpg` sin asignar a ninguna escena. | Decidir escena o descartar. |
| T3 | Error | Export a MP4 (WebCodecs) falló en el equipo del usuario; causa no diagnosticada. | Probar Chrome/Edge de escritorio actualizado; si persiste, grabación de pantalla (OBS/QuickTime/Game Bar), HTML autónomo o fotogramas/PPTX. |
| T4 | Limitación | Canva no puede importar HTML; solo MP4 ya exportado. | Exportar MP4 primero. |
| T5 | Limitación | HTML autónomo requiere `<template id="__bundler_thumbnail">`. | Añadirlo antes de empaquetar. |
| T6 | Mejora | `LOGO` en `scenes.jsx` apunta a `assets/logos/fulbright-comexus-logo.png`; podría estar obsoleto. | Verificar uso; unificar con `LOGO_Fulbright.png` / `LOGO_COMEXUS.png`. |
| T7 | Mejora | Cache-bust `?v=3` manual en `A()`. | Subir el número al reemplazar imágenes (o automatizarlo). |
| T9 | Mejora | Contenido codificado en JSX no era editable por no programadores. | Resuelto: contenido en `content/video-01.content.js` + Editor en el reproductor. |
| T8 | Repo | El repositorio estaba vacío (API 409). | Resuelto en esta actualización: estructura inicial y documentación. Falta subir el código y los assets. |

## B. Auditoría de guion y marca (Video 1)

### B1. Voz pasiva (regla: 100% activa)
| Frase original | Propuesta activa |
| --- | --- |
| "…fully funded by a program built to bring nations closer together" | "…fully funded, through a program that brings nations closer together" → mejor: "A fully funded program that brings nations closer together sends thousands of Americans abroad every year to study, teach, and conduct research." |
| "It was created in 1946 by Senator J. William Fulbright" | "Senator J. William Fulbright created the program in 1946…" |
| "…when talented people are given the chance to share ideas" | "…when talented people share ideas." |
| "…the Fulbright Program is run by COMEXUS" | "In Mexico, COMEXUS runs the Fulbright Program." |
| "Founded in 1990 and funded by both governments" | "Both governments fund COMEXUS, founded in 1990." |

### B2. Registro informal
- "pack their bags" y "from the ground up" → reemplazar por lenguaje formal (p. ej. "travel abroad", "at every level").

### B3. Cifras y fechas — **[POR VALIDAR]** con COMEXUS
- Guion: 62 Nobel, 93 Pulitzer, 44 jefes de Estado. La guía de marca (nov. 2018) trae 59 / 82 / 37 y pide actualizarlas. Usar la terminología "heads of state or government".
- Sin respaldo en los documentos fuente: 5,680 grantees, nueve programas, 35 años, 27 de noviembre de 1990, "more than 160 countries" (esta última sí figura en la guía).

### B4. Especificaciones visuales
- Storyboard dice "Clear Space = altura de la 'F'": la guía define X = altura de la 'F'; espacio libre recomendado **2X**, mínimo **X**. Co-branding: separación ≥ ancho del globo.
- Definir cuándo usar acentos Ocean / Turquoise (paleta secundaria permitida).
- Verificar contraste de texto sobre fotografías (Sección 508); no colocar logos sobre fotos con fondo saturado.
