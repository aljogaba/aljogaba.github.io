# Perfil profesional V2

Sitio estático bilingüe del perfil académico y científico de Alberto Jorge Galindo Barboza.

Este repositorio es la **capa pública de presentación**. La fuente factual principal vive en el repositorio privado `aljogaba/perfil-profesional-source`.

## Documentación principal

Antes de modificar estructura, narrativa o comportamiento consulte:

- [`docs/perfil-profesional.md`](docs/perfil-profesional.md) — identidad y narrativa profesional.
- [`docs/arquitectura-perfil-dinamico.md`](docs/arquitectura-perfil-dinamico.md) — arquitectura vigente de datos, responsabilidades por página y reglas de mantenimiento.
- En el repositorio privado, `web/MANUAL_USO_Y_MANTENIMIENTO.md` funciona como guía operativa de actualización y deberá consolidarse al cerrar la revisión editorial.

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

`assets/js/content-data.js` se conserva únicamente para módulos todavía no migrados por completo, como Docencia y Campo. No debe duplicar datos que ya provienen de la fuente canónica.

Las colecciones manuales de `projects`, `publications` y `talks` ya fueron retiradas de `content-data.js`. Investigación, Publicaciones y Ponencias/Contribuciones consumen las colecciones generadas en `canonical-data.js`; sus HTML conservan solo fallbacks mínimos de disponibilidad y no segundas copias de los registros.

Los recursos públicos complementarios —por ejemplo, página oficial de un evento, resumen, cartel, trabajo en extenso o acceso a un libro— se definen en `web/resources.yml` del repositorio privado y se incorporan durante `sync_web_content()`. Los artículos con DOI usan la ruta editorial original y no requieren un PDF duplicado en este repositorio.

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
- `talks / talks-es`: dos bloques distintos: ponencias invitadas/magistrales desde `data/ponencias.yml` y contribuciones publicadas en congresos desde la bibliografía canónica; los accesos a evento/PDF se incorporan desde `web/resources.yml`.
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
- Una participación en un evento y un producto publicado en memorias son objetos distintos: la web muestra la primera cuando es una ponencia invitada/magistral seleccionada y el segundo como contribución en congreso.

## Revisión local

Abra la carpeta en VS Code y ejecute el sitio con Live Server.

## Estado editorial

La revisión actual se realiza de manera quirúrgica, conservando diseño y componentes existentes:

1. Inicio — revisado.
2. Investigación — revisado; selección y narrativa conectadas a la fuente canónica.
3. Publicaciones — revisado y funcionando con DOI/recursos canónicos.
4. Ponencias y contribuciones — estructura migrada a la fuente canónica; pendiente regenerar `canonical-data.js` y revisar visualmente ES/EN.
5. Docencia — siguiente después de cerrar Ponencias.

Campo, Herramientas, Perfiles, Notas técnicas y EPISUIS no se rediseñan en esta pasada salvo correcciones funcionales puntuales.
