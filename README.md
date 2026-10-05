# Perfil profesional V2

Sitio estático bilingüe del perfil académico y científico de Alberto Jorge Galindo Barboza.

El contenido esencial está en HTML; JavaScript mejora menús, filtros y colecciones.

## Fuente de verdad editorial

La narrativa profesional, los ejes científicos, las capacidades metodológicas, los indicadores curriculares y las reglas para generar semblanzas se documentan en:

- [`docs/perfil-profesional.md`](docs/perfil-profesional.md)

Ese archivo debe consultarse antes de modificar descripciones generales del sitio, perfiles académicos o semblanzas para eventos.

## Arquitectura futura de datos

La migración hacia una fuente maestra estructurada para generar CV, colecciones del sitio, conteos y semblanzas está documentada en:

- [`docs/arquitectura-perfil-dinamico.md`](docs/arquitectura-perfil-dinamico.md)

El objetivo es que proyectos, publicaciones y ponencias dejen de capturarse manualmente en este repositorio y sean consumidos desde una fuente profesional estructurada.

## Fuentes de información actuales

- **Currículum vitae:** fuente factual histórica para trayectoria, formación, cargos, proyectos, productos y conteos.
- **`assets/js/content-data.js`:** fuente operativa transitoria para publicaciones, ponencias, proyectos, docencia y trabajo de campo mostrados en la web.
- **`docs/perfil-profesional.md`:** fuente editorial para narrativa, posicionamiento, capacidades, conteos verificados y criterios de redacción.

El CV enlazado públicamente desde el sitio debe ser una versión depurada de datos personales innecesarios.

## Flujo de actualización durante la transición

Mientras no se complete la arquitectura dinámica:

1. registrar la evidencia correspondiente;
2. actualizar `assets/js/content-data.js` cuando aplique;
3. actualizar el CV canónico y su versión pública;
4. revisar los indicadores de `docs/perfil-profesional.md`;
5. modificar la narrativa solo si el nuevo elemento cambia de forma sustantiva el perfil profesional;
6. actualizar páginas, SEO e identificadores externos cuando corresponda.

El flujo objetivo posterior se describe en `docs/arquitectura-perfil-dinamico.md` y sustituirá esta captura duplicada.

## Revisión local

Abra la carpeta en VS Code y ejecute `index-es.html` con Live Server.

## Agregar un perfil

En `index-es.html` y `index.html`, busque `profile-directory`, duplique una tarjeta `profile-platform` y cambie imagen, nombre, descripción y enlace. Los iconos están en `assets/images/profiles/`.

## Colecciones

Actualmente publicaciones, ponencias, proyectos, docencia y campo se administran en `assets/js/content-data.js`; cada página conserva una salida HTML básica si JavaScript no carga.

La migración futura conservará este comportamiento visual, pero las colecciones automatizables serán generadas desde la fuente maestra estructurada.
