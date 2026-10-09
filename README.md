# Perfil profesional V2

Sitio estático bilingüe del perfil académico y científico de Alberto Jorge Galindo Barboza.

Este repositorio es la **capa pública de presentación**. La fuente factual principal vive en el repositorio privado `aljogaba/perfil-profesional-source`.

## Documentación principal

Antes de modificar estructura, narrativa o comportamiento consulte:

- [`docs/perfil-profesional.md`](docs/perfil-profesional.md) — identidad y narrativa profesional.
- [`docs/arquitectura-perfil-dinamico.md`](docs/arquitectura-perfil-dinamico.md) — arquitectura vigente de datos, responsabilidades por página y reglas de mantenimiento.

## Flujo de datos actual

La información estructurada se mantiene en `perfil-profesional-source` y se transforma mediante:

```r
source("R/export_web_content.R")
sync_web_content()
```

La salida pública generada es:

`assets/js/canonical-data.js`

Ese archivo es **derivado** y no debe editarse manualmente.

`assets/js/site.js` carga los datos canónicos y controla el comportamiento compartido del sitio.

`assets/js/content-data.js` se conserva únicamente como **fallback transitorio** para módulos todavía no migrados por completo. No debe duplicar nuevos datos que ya provienen de la fuente canónica.

Las colecciones manuales de `projects` y `publications` ya fueron retiradas de `content-data.js`. Investigación y Publicaciones consumen únicamente las colecciones generadas en `canonical-data.js`; sus HTML conservan solo fallbacks mínimos de disponibilidad y no segundas copias de los registros.

Los recursos públicos complementarios de publicaciones —por ejemplo, acceso a un libro cuando no existe DOI— se definen en `web/resources.yml` del repositorio privado y se incorporan durante `sync_web_content()`. Los artículos con DOI usan la ruta editorial original y no requieren un PDF duplicado en este repositorio.

## Regla del encabezado compartido

Los HTML contienen únicamente el nombre dentro de `.brand-copy`:

```html
<span class="brand-copy">
  <span class="brand-name">Alberto Jorge Galindo-Barboza</span>
</span>
```

El descriptor profesional se crea desde `assets/js/site.js` según el idioma:

- ES: `Epidemiología aplicada a salud y producción porcina`
- EN: `Applied epidemiology in swine health and production`

**No escribir `.brand-role` dentro de los HTML.** Si cambia el descriptor global, se modifica una sola vez en `site.js`.

## Responsabilidad de las páginas

- `index / index-es`: identidad y enfoque profesional.
- `portfolio / portfolio-es`: investigación y proyectos seleccionados.
- `publications / publications-es`: producción científica y académica seleccionada, con acceso al recurso original cuando existe.
- `talks / talks-es`: ponencias invitadas/magistrales y contribuciones en congresos.
- `teaching / teaching-es`: docencia seleccionada.
- `fieldwork / fieldwork-es`: galería editorial/manual.
- `tools / tools-es`: herramientas científicas; los datos publicables provienen de `data/software.yml`.
- `index#profiles`: perfiles académicos y profesionales.

Notas técnicas y EPISUIS mantienen identidades separadas del perfil profesional.

## Política de mantenimiento

- Corregir los hechos en la fuente canónica, no en los archivos derivados.
- Eliminar código o texto antiguo cuando una responsabilidad se centraliza.
- No conservar bloques muertos que ya no controlan la interfaz.
- Mantener fallback únicamente cuando siga teniendo una función explícita.
- Conservar ES y EN equivalentes en significado, con inglés académico natural y no traducción mecánica.
- No fijar en HTML conteos dinámicos externos —por ejemplo, número de secuencias en GenBank— cuando la fuente externa puede cambiar.

## Revisión local

Abra la carpeta en VS Code y ejecute el sitio con Live Server.

## Estado editorial

La revisión actual se realiza de manera quirúrgica, conservando diseño y componentes existentes:

1. Inicio — revisado.
2. Investigación — revisado; selección y narrativa conectadas a la fuente canónica.
3. Publicaciones — implementado; pendiente de revisión visual final.
4. Ponencias y contribuciones — siguiente después de cerrar Publicaciones.
5. Docencia.

Campo, Herramientas, Perfiles, Notas técnicas y EPISUIS no se rediseñan en esta pasada salvo correcciones funcionales puntuales.
