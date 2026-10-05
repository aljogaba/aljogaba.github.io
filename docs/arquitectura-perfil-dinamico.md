# Arquitectura para perfil profesional dinámico

**Alberto Jorge Galindo Barboza**  
Última revisión: **2026-10-05**

## Objetivo

Reducir al mínimo la captura duplicada y convertir el sitio `aljogaba.github.io` en una capa de publicación que consuma información profesional estructurada desde una fuente maestra.

La regla central será:

> **Capturar una vez; reutilizar en CV, sitio web, conteos y semblanzas.**

El sitio público no debe convertirse en la fuente maestra ni requerir captura manual de proyectos, publicaciones o ponencias.

## Arquitectura propuesta

Se propone crear un repositorio maestro separado, preferentemente privado, para la información profesional estructurada. Nombre de trabajo: `perfil-profesional-source`.

Ese repositorio contendrá:

- datos curriculares estructurados;
- bibliografía científica normalizada;
- narrativa editorial;
- reglas de conteo;
- scripts de validación y transformación;
- plantilla(s) Quarto para generar CV;
- exportaciones destinadas al sitio público.

`aljogaba.github.io` permanecerá como la capa pública de presentación.

## Fuentes y salidas

### Fuente factual estructurada

- `data/persona.yml`
- `data/formacion.yml`
- `data/experiencia.yml`
- `data/proyectos.yml`
- `data/ponencias.yml`
- `data/docencia.yml`
- `data/cursos.yml`
- `data/software.yml`
- otras colecciones cuando sean necesarias.

### Publicaciones científicas

Las publicaciones arbitradas, capítulos y otros productos bibliográficos deberán provenir preferentemente de Zotero/Better BibTeX mediante un archivo `.bib` normalizado.

La bibliografía será transformada a los formatos requeridos para:

- CV;
- página de Publicaciones;
- conteos;
- semblanzas cuando corresponda.

El DOI y otros identificadores se almacenarán como datos estructurados y el sitio generará los enlaces correspondientes.

### Narrativa editorial

La narrativa profesional se mantendrá separada de los datos factuales. Incluirá:

- frase rectora;
- narrativa maestra;
- ejes científicos;
- capacidades metodológicas;
- reglas de identidad;
- criterios para semblanzas y perfiles externos.

La fuente editorial actual es `docs/perfil-profesional.md`; cuando exista el repositorio maestro, esta documentación deberá migrarse o sincronizarse desde ahí.

## Relación con las páginas actuales

### Investigación / `portfolio-es.html`

**Objetivo:** dejar de capturar proyectos manualmente en `assets/js/content-data.js`.

Los proyectos se definirán una sola vez en la fuente maestra y se exportarán al formato consumido por el sitio.

Campos mínimos sugeridos:

- `id`
- `year_start`
- `year_end`
- `title_es`
- `title_en`
- `role`
- `institution`
- `collaborators`
- `funding`
- `description_es`
- `description_en`
- `outputs`
- `status`
- `tags`

### Publicaciones / `publications-es.html`

**Objetivo:** generar automáticamente el registro de artículos y capítulos desde la fuente bibliográfica.

El sitio conservará:

- filtros por tipo;
- enlace DOI;
- orden cronológico;
- versión ES/EN de la interfaz.

No se capturarán manualmente las referencias bibliográficas en el HTML ni en `content-data.js` una vez completada la migración.

### GenBank

Las búsquedas actuales por autor para PRRSV y PCV2 son útiles porque consultan NCBI dinámicamente y pueden conservarse.

Sin embargo, los textos actuales que indican cantidades de secuencias son valores estáticos y pueden quedar desactualizados aunque la búsqueda de GenBank sí encuentre registros nuevos.

Opciones futuras:

1. eliminar del sitio el número fijo y mostrar únicamente la colección consultable; o
2. calcular el número de registros mediante NCBI durante el proceso de construcción/publicación.

No es necesario convertir GenBank en una base paralela dentro del CV.

### Ponencias / `talks-es.html`

**Objetivo:** alimentar automáticamente tanto las contribuciones en congresos como las ponencias invitadas desde la misma fuente maestra.

Cada registro deberá poder conservar, cuando aplique:

- `id`
- `year`
- `category`: `conference` o `invited`
- `title`
- `authors`
- `event`
- `organizer`
- `city`
- `country`
- `presentation_type`: oral, poster, abstract, invited, etc.
- `proceedings`
- `pages`
- `event_url`
- `abstract_pdf`
- `language`
- `status`
- `tags`

Los campos `event_url` y `abstract_pdf` generarán automáticamente los enlaces actuales **Ver evento** y **Resumen PDF**.

Los PDFs públicos podrán mantenerse en `archives/`; la fuente maestra almacenará la ruta o identificador del archivo.

#### Requisito de interfaz pendiente

Agregar a `talks-es.html` y `talks.html` un menú lateral equivalente al ya utilizado en Publicaciones.

En español:

- **Secciones**
  - Contribuciones en congresos
  - Ponencias invitadas

En inglés:

- **Sections**
  - Conference contributions
  - Invited talks

La estructura deberá usar los mismos patrones `content-layout` y `section-nav` ya presentes en Publicaciones para mantener consistencia visual y no crear un componente nuevo innecesario.

### Docencia

Puede mantenerse con edición relativamente manual o migrarse posteriormente a datos estructurados.

No es prioridad automatizarla porque el número de asignaturas es pequeño y la edición tiene un componente descriptivo importante.

### Campo

Mantener manual/editorial. El propietario decide qué actividades e imágenes mostrar. No debe generarse automáticamente desde el CV.

### Herramientas

Mantener manual/editorial. Cada herramienta tiene identidad y descripción propias y no debe inferirse automáticamente del CV.

## Capa de exportación para el sitio

El sitio actual ya dispone de un renderizador de colecciones basado en `window.SITE_CONTENT`.

Por ello, durante la primera migración no es necesario reescribir la presentación de las páginas. Se recomienda generar automáticamente un archivo compatible con la estructura esperada por `site.js`, por ejemplo:

- `assets/js/content-data.generated.js`, o
- datos JSON estructurados cargados por una versión posterior del renderizador.

Primera etapa recomendada: mantener el contrato actual de `SITE_CONTENT` y cambiar únicamente quién genera el archivo.

Esto reduce riesgo y permite migración incremental.

## Flujo de trabajo objetivo

1. Registrar el nuevo elemento una sola vez en la fuente correspondiente.
2. Validar estructura, campos obligatorios y duplicados.
3. Recalcular indicadores curriculares.
4. Generar CV y otras exportaciones requeridas.
5. Generar la salida pública para `aljogaba.github.io`.
6. Actualizar automáticamente las colecciones del sitio.
7. Publicar los cambios mediante un flujo reproducible.

## Automatización recomendada

### Primera fase

- scripts en R;
- Quarto para CV;
- YAML/BibTeX como fuentes;
- generación de `SITE_CONTENT` compatible con el sitio actual;
- ejecución local con un único comando.

### Segunda fase

GitHub Actions en el repositorio maestro para:

- validar datos;
- generar CV público y otras salidas;
- regenerar los datos del sitio;
- proponer o publicar los cambios en `aljogaba.github.io`.

Se recomienda inicialmente abrir una actualización revisable antes de publicar automáticamente en `main`, hasta comprobar la estabilidad del flujo.

### Tercera fase opcional

Construir una interfaz ligera para agregar registros sin editar YAML directamente. Solo debe realizarse después de estabilizar el modelo de datos y las reglas de validación.

## Conteos

Los conteos profesionales no se escribirán manualmente una vez migrados los registros.

Deberán calcularse a partir de las fuentes estructuradas, con categorías explícitas. Ejemplos:

- artículos científicos;
- capítulos de libro;
- contribuciones en congresos;
- ponencias invitadas;
- presentaciones orales;
- carteles;
- proyectos como responsable/corresponsable/participante;
- cursos impartidos;
- actividades organizadas;
- software;
- secuencias o colecciones cuando tenga sentido reportarlas.

Cada indicador deberá tener una definición estable para evitar mezclar categorías.

## Principio de migración

No eliminar las colecciones actuales de `content-data.js` hasta que la salida generada reproduzca satisfactoriamente el contenido existente.

La migración debe hacerse por módulos:

1. publicaciones;
2. proyectos;
3. ponencias;
4. indicadores;
5. CV;
6. integración restante.

Durante la transición, la versión actual seguirá funcionando como respaldo.

## Pendientes inmediatos

- [ ] Crear repositorio maestro privado.
- [ ] Diseñar esquema de datos definitivo.
- [ ] Migrar publicaciones a fuente bibliográfica normalizada.
- [ ] Migrar proyectos.
- [ ] Migrar contribuciones en congresos y ponencias invitadas.
- [ ] Incorporar `event_url` y `abstract_pdf` como campos estructurados.
- [ ] Agregar menú lateral a `talks-es.html` y `talks.html`.
- [ ] Decidir si los conteos visibles de GenBank se eliminan o se calculan automáticamente.
- [ ] Generar primer `SITE_CONTENT` automáticamente y compararlo con el actual.
- [ ] Generar primer CV desde Quarto y compararlo con el CV maestro de Word.
- [ ] Definir CV público canónico y retirar la publicación del CV completo con datos personales.
