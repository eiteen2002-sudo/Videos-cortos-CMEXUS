# Handoff — Video maestro Fulbright–COMEXUS (FB_V01)

## Entregable
- `ui_kits/video-master/Master Sequence.html` — secuencia 1920×1080, 60 fps, 7 escenas, captions quemados (VO), panel Tweaks (captions / guías).
- Código: `scenes.jsx` (escenas), `animations-v3.jsx` (motor de timeline + export), `tweaks-panel.jsx`.
- Export: botón de descarga en la barra del reproductor (WebCodecs; solo Chrome/Edge de escritorio).

## Estructura de assets (`ui_kits/video-master/FB_V01_ASSETS/`)
Nomenclatura: `FB_V01_ESC<##>_<TIPO>_<Nombre>.<ext>`. Se cargan con `A('archivo')` en `scenes.jsx` (cache-bust `?v=3`; subir el número al reemplazar imágenes).

| Escena | Archivo |
| --- | --- |
| 01 Intro | FB_V01_ESC01_FOTO_CampusMexico.jpg |
| 02 Histórica | FB_V01_ESC02_HIST_SenadorFulbright.jpg |
| 04 Retratos | FB_V01_ESC02_HIST_SenadorFulbright.jpg, FB_V01_ESC04_HIST_AlfonsoGarciaRobles.jpg |
| 06 Programas | Investigacion_Lab.jpg, ETA_Aula.jpg, Intercambio_Academico.jpg |
| 07 Alumni | FB_V01_ESC07_FOTO_Red_Alumni_Mosaico.jpg |
| Logos (aprobados, no modificar) | LOGO_Fulbright.png, LOGO_COMEXUS.png, LOGO_Globe.png |
| Sin asignar | DSC07042.jpg |

## Cómo cambiar diseño, imágenes o información
- **Imagen:** reemplaza el archivo con el mismo nombre (o cambia la ruta en `scenes.jsx`) y sube `?v=` en `A()`. Encuadre con `pos` (object-position) del componente `Photo`.
- **Texto / captions / duraciones:** editar en `scenes.jsx` por escena; tiempos en la lista de escenas de `Master Sequence.html`.
- **Marca:** colores y tipografía vienen de `styles.css` y `tokens/` (Montserrat; Ocean sobre blanco). Lockup de logos: separación = ancho del globo, 2X de espacio libre.
- Todo contenido preliminar es editable; nada está bloqueado salvo los logos.

## Estado y hallazgos
- Fotos actualizadas a las versiones nuevas (7 reemplazos). Recortes `object-position` **sin revisar** con las nuevas imágenes.
- `DSC07042.jpg` pendiente de asignar a una escena.
- Export a MP4 falló en el equipo del usuario (causa no diagnosticada). Alternativas: grabación de pantalla (OBS/QuickTime/Game Bar), HTML autónomo, o fotogramas/PPTX.
- Envío a Canva no disponible (no hay importador de HTML; solo MP4 ya exportado). El HTML autónomo requiere agregar `<template id="__bundler_thumbnail">`.
- Mejora pendiente: `LOGO` en `scenes.jsx` apunta a `assets/logos/fulbright-comexus-logo.png`; verificar si sigue en uso.

## Repositorio
`eiteen2002-sudo/Videos-cortos-CMEXUS` (main) está vacío / sin commits (la API responde 409). Este entorno solo lee de GitHub; no puede hacer push. Para publicar: descargar el proyecto y subirlo con `git`, incluyendo este `HANDOFF.md`.
