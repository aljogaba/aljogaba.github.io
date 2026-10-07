# Arquitectura del perfil profesional dinámico

**Alberto Jorge Galindo Barboza**  
Última revisión: **2026-10-07**

## Objetivo

Mantener `aljogaba.github.io` como una capa pública de presentación, evitando duplicar datos profesionales y evitando que el HTML se convierta en una segunda fuente curricular.

La regla general es:

> **Capturar una vez; reutilizar en CV, sitio web y otras salidas.**

El repositorio público presenta información. La fuente factual principal vive en el repositorio privado `aljogaba/perfil-profesional-source`.

---

## Arquitectura actual

### 1. Fuente canónica privada

Repositorio:

`aljogaba/perfil-profesional-source`

Fuentes principales:

- `data/persona.yml`
- `data/formacion.yml`
- `data/experiencia.yml`
- `data/proyectos.yml`
- `data/ponencias.yml`
- `data/docencia.yml`
- `data/actividades.yml`
- `data/software.yml`
- `references/publicaciones.bib`
- `data/publicaciones_meta.yml`
- `web/selection.yml`
- `web/EDITORIAL_ARCHITECTURE.md`

Las publicaciones bibliográficas se mantienen en Zotero/Better BibTeX y se complementan con metadatos editoriales locales.

### 2. Generación para la web

El generador actual es:

`R/export_web_content.R`

Comando de sincronización:

```r
source("R/export_web_content.R")
sync_web_content()
```

La salida pública derivada es:

`assets/js/canonical-data.js`

Ese archivo **no se edita manualmente**. Se regenera desde la fuente canónica.

### 3. Renderizado público

`assets/js/site.js`:

- carga `canonical-data.js`;
- reemplaza o renderiza las colecciones dinámicas;
- mantiene filtros y comportamiento de interfaz;
- actualiza herramientas desde los datos canónicos;
- crea elementos compartidos de interfaz que no deben repetirse en cada HTML.

`assets/js/content-data.js` permanece temporalmente como **fallback de transición** para módulos todavía no migrados por completo. No debe recibir nuevos datos canónicos si estos ya existen en `canonical-data.js`.

---

## Encabezado compartido

La marca superior consta de:

- nombre: `Alberto Jorge Galindo-Barboza`;
- descriptor profesional bilingüe.

### Nombre

El nombre permanece en cada HTML como elemento estructural:

```html
<span class="brand-copy">
  <span class="brand-name">Alberto Jorge Galindo-Barboza</span>
</span>
```

### Descriptor profesional

El descriptor **no debe escribirse dentro de los HTML**.

Su única fuente pública actual es `assets/js/site.js`, que crea dinámicamente `.brand-role` según el atributo `lang` del documento:

- ES: `Epidemiología aplicada a salud y producción porcina`
- EN: `Applied epidemiology in swine health and production`

Regla de mantenimiento:

> Si cambia el descriptor profesional global, se modifica una sola vez en `site.js`; nunca se añade una copia en `index`, `portfolio`, `publications`, `talks`, `teaching`, `fieldwork`, `tools`, `404` o `episuis`.

Esto evita que el HTML conserve texto antiguo que ya no controla lo que se muestra en pantalla.

---

## Política de limpieza de código

Cuando una responsabilidad se centraliza o se mueve a una fuente canónica:

1. eliminar la versión antigua del HTML o JavaScript anterior cuando deje de ser funcional;
2. no conservar bloques muertos «por si acaso»;
3. documentar cuál archivo controla el comportamiento vigente;
4. mantener fallback únicamente cuando siga cumpliendo una función explícita;
5. no editar manualmente archivos derivados.

En particular:

- `canonical-data.js` = derivado;
- `content-data.js` = fallback temporal mientras haya módulos pendientes;
- `site.js` = comportamiento compartido del sitio;
- HTML = estructura, contenido editorial propio de cada página y fallback visible cuando corresponda.

---

## Función editorial de cada página

| Página | Función |
|---|---|
| `index / index-es` | Quién es Alberto Galindo y cuál es su enfoque profesional actual. No debe convertirse en catálogo de publicaciones, proyectos o ponencias. |
| `portfolio / portfolio-es` | Investigación y proyectos seleccionados. Introducción editorial breve + proyectos provenientes de la fuente canónica. |
| `publications / publications-es` | Producción científica y bibliográfica seleccionada, con enlaces DOI/HTML cuando existan. |
| `talks / talks-es` | Ponencias invitadas y magistrales + contribuciones en congresos, con recursos de acceso cuando existan. |
| `teaching / teaching-es` | Docencia seleccionada, principalmente actual. |
| `fieldwork / fieldwork-es` | Galería editorial/manual. No automatizar desde el CV. |
| `tools / tools-es` | Herramientas científicas activas, alimentadas desde `data/software.yml`. |
| `index#profiles` | Perfiles académicos y profesionales. Mantener como directorio. |
| Notas técnicas | Sitio independiente. |
| EPISUIS | Identidad separada del perfil profesional. |

---

## Investigación / `portfolio`

La página de Investigación no debe funcionar como un CV completo.

Debe contener:

- una introducción breve al enfoque actual;
- los ejes necesarios para contextualizar la selección;
- proyectos elegidos editorialmente desde `data/proyectos.yml` y `web/selection.yml`.

No debe repetir publicaciones, ponencias, herramientas, docencia ni la galería de campo.

---

## Publicaciones / `publications`

Las referencias se generan desde:

- `references/publicaciones.bib`;
- `data/publicaciones_meta.yml`.

Política de acceso:

- cuando existe DOI o página HTML editorial, enlazar al recurso oficial;
- no duplicar un PDF local si el artículo ya está accesible adecuadamente mediante DOI/editor;
- los archivos locales se reservan para productos donde aportan acceso real y legítimo al contenido.

La página pública es una selección editorial; la fuente bibliográfica completa permanece en el repositorio canónico y en el CV derivado.

---

## Ponencias y contribuciones / `talks`

Esta página debe distinguir dos clases de objetos.

### Ponencias invitadas y magistrales

Fuente principal:

`data/ponencias.yml`

Incluye conferencias invitadas, magistrales, paneles y otras participaciones donde el hecho curricular principal es la intervención.

### Contribuciones en congresos

Fuente principal:

`references/publicaciones.bib` + `data/publicaciones_meta.yml`

Corresponde a resúmenes, trabajos en memorias y otras contribuciones publicadas en congresos, independientemente de si la presentación fue oral o cartel.

### Recursos web asociados

Se definió una capa web separada para asociar, sin duplicar los datos curriculares:

- URL oficial del evento;
- PDF de resumen, extenso o memoria cuando exista;
- otros recursos públicos relevantes.

Nombre previsto de la capa:

`web/resources.yml`

Los PDFs públicos pueden mantenerse en:

`archives/`

La interfaz debe poder mostrar, según disponibilidad:

- **Ver evento / View event**
- **Resumen PDF / Abstract PDF**
- otros rótulos específicos cuando el tipo de documento lo requiera.

No es necesario añadir estas rutas de archivos al CV si solo cumplen una función de acceso web.

---

## Docencia / `teaching`

La fuente canónica es `data/docencia.yml`.

La web debe mostrar una selección útil, principalmente la docencia actual. La fuente canónica conserva la trayectoria completa aunque no toda se publique.

---

## Campo / `fieldwork`

La galería es editorial y visual.

No se genera automáticamente desde los registros curriculares y no debe modificarse durante las migraciones de proyectos, publicaciones, ponencias o docencia salvo instrucción expresa.

---

## Herramientas / `tools`

Las herramientas publicables se alimentan desde `data/software.yml`.

Actualmente la web consume nombre, descripción, estado, registro y URL cuando corresponda. Un cambio como la URL de DiseasesMapMx debe realizarse en el registro canónico y propagarse mediante `sync_web_content()`.

No editar esas URLs manualmente en los HTML cuando ya provienen de la fuente canónica.

---

## Selección editorial

La fuente canónica es exhaustiva; la web es curada.

`web/selection.yml` define qué registros se exponen cuando la publicación no debe ser automática por el simple hecho de existir en el CV.

Por tanto:

> **Conservar en la fuente canónica no significa publicar en la web.**

Esto permite mantener toda la trayectoria sin convertir el sitio en un CV largo en HTML.

---

## Bilingüismo

ES y EN deben conservar equivalencia conceptual, no traducción mecánica palabra por palabra.

Reglas:

- conservar nombres oficiales de instituciones y eventos cuando corresponda;
- usar inglés académico/profesional natural;
- mantener la misma arquitectura de contenido entre idiomas;
- cuando un registro solo existe documentalmente en un idioma, no inventar un título oficial en el otro; la interfaz puede traducirse sin alterar el título documental.

---

## Flujo de mantenimiento

Para un nuevo registro profesional:

1. incorporar el hecho en la fuente canónica correspondiente;
2. adjuntar o registrar la evidencia necesaria;
3. decidir si se publica en web;
4. si existe un recurso público adicional, asociarlo en la capa web correspondiente;
5. ejecutar validación y `sync_web_content()`;
6. revisar la salida pública;
7. publicar.

Para una corrección:

> corregir la fuente, no el HTML derivado.

---

## Estado de revisión editorial del sitio

Orden acordado de revisión quirúrgica:

1. **Inicio** — revisado y actualizado el 2026-10-07.
2. **Investigación / portfolio** — siguiente módulo.
3. **Publicaciones**.
4. **Ponencias y contribuciones**.
5. **Docencia**.

`Campo`, `Herramientas`, `Perfiles`, `Notas técnicas` y `EPISUIS` no se rediseñarán dentro de esta pasada, salvo correcciones funcionales puntuales.

---

## Principio final

El objetivo del sistema no es automatizar por automatizar. La arquitectura debe permitir que Alberto mantenga **información profesional**, mientras CV y web funcionan como salidas coherentes, limpias y reproducibles.

Cuando una automatización genere duplicación, código muerto o confusión sobre cuál archivo manda, debe simplificarse.