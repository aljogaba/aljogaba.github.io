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

  const brandRole = document.querySelector('.brand-role');
  if (brandRole) {
    brandRole.textContent = lang === 'es'
      ? 'Epidemiología aplicada a salud y producción porcina'
      : 'Applied epidemiology in swine health and production';
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

  const toolCards = document.querySelectorAll('.tools-grid .feature-card');
  if (toolCards.length) {
    const registrationStyle = document.createElement('style');
    registrationStyle.textContent = `
      .tools-grid .status {
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
      }
      .registration-status {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        margin-left: .45rem;
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

    const tools = Array.isArray(content?.tools) ? content.tools : [];
    const toolIndex = new Map(tools.map((item) => [item.id, item]));
    const toolNameIndex = new Map(tools.map((item) => [item.name, item]));
    const fallbackRegistration = lang === 'es' ? 'Registro en proceso' : 'Registration in progress';

    toolCards.forEach((card) => {
      const title = card.querySelector('h3');
      const record = toolIndex.get(card.dataset.toolId) || toolNameIndex.get(title?.textContent.trim());
      const developmentStatus = card.querySelector('.status');
      let registrationStatus = card.querySelector('.registration-status');

      if (record) {
        const description = card.querySelector('p');
        const link = card.querySelector('.card-actions a');
        const statusLabel = lang === 'es' ? record.status_es : record.status_en;
        const registrationLabel = lang === 'es' ? record.registration_es : record.registration_en;
        const descriptionText = lang === 'es' ? record.description_es : record.description_en;

        if (title && record.name) title.textContent = record.name;
        if (description && descriptionText) description.textContent = descriptionText;
        if (developmentStatus && statusLabel) developmentStatus.textContent = statusLabel;
        if (link && record.url) link.href = record.url;

        if (registrationLabel && developmentStatus) {
          if (!registrationStatus) {
            registrationStatus = document.createElement('span');
            registrationStatus.className = 'registration-status';
            developmentStatus.insertAdjacentElement('afterend', registrationStatus);
          }
          registrationStatus.textContent = registrationLabel;
        } else if (registrationStatus) {
          registrationStatus.remove();
        }
      } else if (developmentStatus && !registrationStatus) {
        registrationStatus = document.createElement('span');
        registrationStatus.className = 'registration-status';
        registrationStatus.textContent = fallbackRegistration;
        developmentStatus.insertAdjacentElement('afterend', registrationStatus);
      }
    });

    document.querySelectorAll('.tool-preview-shot').forEach((link) => {
      const label = link.querySelector('span')?.textContent.trim();
      const record = toolIndex.get(link.dataset.toolId) || toolNameIndex.get(label);
      if (record?.url) link.href = record.url;
    });
  }

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