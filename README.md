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
- `publications / publications-es`: producción científica y bibliográfica seleccionada.
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

## Revisión local

Abra la carpeta en VS Code y ejecute el sitio con Live Server.

## Estado editorial

La revisión actual se realiza de manera quirúrgica, conservando diseño y componentes existentes:

1. Inicio — revisado.
2. Investigación — siguiente.
3. Publicaciones.
4. Ponencias y contribuciones.
5. Docencia.

Campo, Herramientas, Perfiles, Notas técnicas y EPISUIS no se rediseñan en esta pasada salvo correcciones funcionales puntuales.
