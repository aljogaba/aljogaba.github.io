(async () => {
  'use strict';

  document.documentElement.classList.add('js');

  const loadCanonicalData = () => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'assets/js/canonical-data.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  await loadCanonicalData();

  const html = document.documentElement;
  const body = document.body;
  const nav = document.querySelector('[data-primary-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const content = window.SITE_CONTENT || null;
  const lang = html.lang && html.lang.toLowerCase().startsWith('es') ? 'es' : 'en';
  const profiles = Array.isArray(window.PROFILE_DATA) ? window.PROFILE_DATA : [];
  const profileIndex = new Map(profiles.map((item) => [item.id, item]));

  document.querySelectorAll('[data-profile-id]').forEach((link) => {
    const record = profileIndex.get(link.dataset.profileId);
    if (!record?.url) {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      return;
    }
    link.href = record.url;
    link.removeAttribute('aria-disabled');
  });

  const personSchema = document.querySelector('script[type="application/ld+json"][data-person-schema]');
  if (personSchema && profiles.length) {
    try {
      const schema = JSON.parse(personSchema.textContent || '{}');
      const graph = Array.isArray(schema['@graph']) ? schema['@graph'] : [];
      const person = graph.find((node) => node && node['@type'] === 'Person');
      if (person) {
        person.sameAs = profiles.map((record) => record.url).filter(Boolean);
        personSchema.textContent = JSON.stringify(schema, null, 2);
      }
    } catch (error) {
      console.error('Could not update profile structured data:', error);
    }
  }

  const brandCopy = document.querySelector('.brand-copy');
  if (brandCopy) {
    brandCopy.querySelectorAll('.brand-role').forEach((node) => node.remove());
    const brandRole = document.createElement('span');
    brandRole.className = 'brand-role';
    brandRole.textContent = lang === 'es'
      ? 'Epidemiología aplicada a salud y producción porcina'
      : 'Applied epidemiology in swine health and production';
    brandCopy.appendChild(brandRole);
  }

  const setNav = (open) => {
    if (!nav || !toggle) return;
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.closeLabel : toggle.dataset.openLabel);
    body.classList.toggle('nav-open', open);
  };

  if (nav && toggle) {
    toggle.addEventListener('click', () => setNav(nav.dataset.open !== 'true'));
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setNav(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1080) setNav(false);
    }, { passive: true });
  }

  const yearNodes = document.querySelectorAll('[data-current-year]');
  yearNodes.forEach((node) => { node.textContent = String(new Date().getFullYear()); });

  const tools = Array.isArray(content?.tools) ? content.tools : [];
  const toolIndex = new Map(tools.map((item) => [item.id, item]));
  const toolsGrid = document.querySelector('[data-tools-grid]');

  if (toolsGrid && tools.length) {
    const registrationStyle = document.createElement('style');
    registrationStyle.textContent = `
      .tool-statuses {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: .45rem;
      }
      .tools-grid .status {
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
      }
      .registration-status {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        padding: .27rem .56rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: var(--paper);
        color: var(--muted);
        font-size: .62rem;
        font-weight: 820;
        letter-spacing: .055em;
        line-height: 1.2;
        text-transform: uppercase;
        vertical-align: middle;
      }
    `;
    document.head.append(registrationStyle);

    const fragment = document.createDocumentFragment();
    tools.forEach((record) => {
      const article = document.createElement('article');
      const isPlatformCard = record.id === 'SOFT-2026-0002';
      article.className = isPlatformCard
        ? 'feature-card tool-card-platform reveal'
        : 'feature-card reveal';
      article.dataset.toolId = record.id || '';

      const bodyNode = isPlatformCard ? document.createElement('div') : article;
      const statusGroup = document.createElement('div');
      statusGroup.className = 'tool-statuses';

      const statusLabel = lang === 'es' ? record.status_es : record.status_en;
      if (statusLabel) {
        const status = document.createElement('span');
        status.className = 'status';
        status.textContent = statusLabel;
        statusGroup.append(status);
      }

      const registrationLabel = lang === 'es' ? record.registration_es : record.registration_en;
      if (registrationLabel) {
        const registration = document.createElement('span');
        registration.className = 'registration-status';
        registration.textContent = registrationLabel;
        statusGroup.append(registration);
      }

      if (statusGroup.childElementCount) bodyNode.append(statusGroup);

      const title = document.createElement('h3');
      title.textContent = record.name || '';
      bodyNode.append(title);

      const description = document.createElement('p');
      description.textContent = lang === 'es' ? record.description_es : record.description_en;
      bodyNode.append(description);

      if (record.url) {
        const actions = document.createElement('div');
        actions.className = 'card-actions';
        const link = document.createElement('a');
        link.className = 'button button-dark';
        link.href = record.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = isPlatformCard
          ? (lang === 'es' ? 'Abrir plataforma ↗' : 'Open platform ↗')
          : (lang === 'es' ? 'Abrir herramienta ↗' : 'Open tool ↗');
        actions.append(link);
        bodyNode.append(actions);
      }

      if (isPlatformCard) {
        article.append(bodyNode);
        const visual = document.createElement('div');
        visual.className = 'tool-card-visual';
        visual.setAttribute('aria-hidden', 'true');
        const image = document.createElement('img');
        image.src = 'assets/images/tools-preview/diseasesmap-map.webp';
        image.alt = '';
        visual.append(image);
        article.append(visual);
      }

      fragment.append(article);
    });

    toolsGrid.replaceChildren(fragment);
  }

  document.querySelectorAll('.tool-preview-shot[data-tool-id]').forEach((link) => {
    const record = toolIndex.get(link.dataset.toolId);
    if (!record?.url) {
      link.removeAttribute('href');
      return;
    }
    link.href = record.url;
    const canonicalLabel = link.querySelector('[data-canonical-label]');
    if (canonicalLabel && record.name) canonicalLabel.textContent = record.name;
  });

  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  }

  if (!content) return;

  const strings = lang === 'es' ? {
    all: 'Todos', journal: 'Artículos', book: 'Capítulos', conference: 'Congresos', invited: 'Invitadas', technical: 'Técnicas',
    empty: 'No hay entradas para este filtro.', project: 'Proyecto', course: 'Curso'
  } : {
    all: 'All', journal: 'Journal articles', book: 'Book chapters', conference: 'Conferences', invited: 'Invited', technical: 'Technical',
    empty: 'No entries match this filter.', project: 'Project', course: 'Course'
  };

  const normalizeHtml = (value) => String(value || '')
    .replace(/target="_blank"(?!\s+rel=)/g, 'target="_blank" rel="noopener noreferrer"')
    .replace(/<a(?![^>]*class=)/g, '<a class="item-link"');

  const renderListItem = (item, type) => {
    const article = document.createElement('article');
    article.className = type === 'publications' ? 'publication-item' : 'archive-item';
    article.dataset.category = item.category || '';
    article.dataset.year = item.year || '';
    const year = document.createElement('div');
    year.className = 'item-year';
    year.textContent = item.year || '—';
    const contentNode = document.createElement('div');
    contentNode.className = 'item-content';
    contentNode.innerHTML = normalizeHtml(item[lang] || item.en || '');
    article.append(year, contentNode);
    return article;
  };

  const renderProject = (item) => {
    const article = document.createElement('article');
    article.className = 'project-card';
    article.dataset.year = item.year || '';
    const contentNode = document.createElement('div');
    contentNode.innerHTML = normalizeHtml(item[lang] || item.en || '');
    article.append(contentNode);
    return article;
  };

  const renderCourse = (item) => {
    const article = document.createElement('article');
    article.className = 'course-card';
    const contentNode = document.createElement('div');
    contentNode.innerHTML = normalizeHtml(item[lang] || item.en || '');
    article.append(contentNode);
    return article;
  };

  const renderGallery = (item) => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-item';
    const image = document.createElement('img');
    image.src = item.src;
    image.alt = item.alt || '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 800;
    image.height = 600;
    const caption = document.createElement('figcaption');
    caption.textContent = item.caption || '';
    figure.append(image, caption);
    return figure;
  };

  document.querySelectorAll('[data-collection]').forEach((shell) => {
    const name = shell.dataset.collection;
    const source = name === 'fieldwork' ? content.fieldwork?.[lang] : content[name];
    if (!Array.isArray(source)) return;

    const dynamic = shell.querySelector('[data-dynamic]');
    const fallback = shell.querySelector('[data-fallback]');
    const filters = shell.querySelector('[data-filters]');
    if (!dynamic) return;

    try {
      const categoryLimit = shell.dataset.category || 'all';
      const baseItems = categoryLimit === 'all' ? source : source.filter((item) => item.category === categoryLimit);
      let activeFilter = 'all';

      const draw = () => {
        dynamic.replaceChildren();
        const items = activeFilter === 'all'
          ? baseItems
          : baseItems.filter((item) => item.category === activeFilter || String(item.year) === activeFilter);

        if (!items.length) {
          const empty = document.createElement('p');
          empty.className = 'collection-empty';
          empty.textContent = strings.empty;
          dynamic.append(empty);
          return;
        }

        const fragment = document.createDocumentFragment();
        items.forEach((item) => {
          if (name === 'projects') fragment.append(renderProject(item));
          else if (name === 'teaching') fragment.append(renderCourse(item));
          else if (name === 'fieldwork') fragment.append(renderGallery(item));
          else fragment.append(renderListItem(item, name));
        });
        dynamic.append(fragment);
      };

      if (filters) {
        const categories = [...new Set(baseItems.map((item) => item.category).filter(Boolean))];
        const years = [...new Set(baseItems.map((item) => item.year).filter(Boolean))].sort((a, b) => b - a);
        const values = shell.dataset.filterMode === 'year' ? years.map(String) : categories;
        const buttons = [{ value: 'all', label: strings.all }, ...values.map((value) => ({ value, label: strings[value] || value }))];
        filters.replaceChildren(...buttons.map(({ value, label }) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.dataset.filter = value;
          button.setAttribute('aria-pressed', String(value === 'all'));
          button.textContent = label;
          button.addEventListener('click', () => {
            activeFilter = value;
            filters.querySelectorAll('button').forEach((node) => node.setAttribute('aria-pressed', String(node === button)));
            draw();
          });
          return button;
        }));
      }

      draw();
      dynamic.hidden = false;
      if (fallback) fallback.hidden = true;
    } catch (error) {
      console.error(`Could not render ${name}:`, error);
    }
  });
})();
