import { topics, authors, quotes } from './data.js';

const els = {
  year: document.getElementById('year'),
  heroStats: document.getElementById('heroStats'),
  featuredCard: document.getElementById('featuredCard'),
  shuffleFeatured: document.getElementById('shuffleFeatured'),
  themeToggle: document.getElementById('themeToggle'),
  customThemeSelect: document.getElementById('customThemeSelect'),
  searchInput: document.getElementById('searchInput'),
  sortSelect: document.getElementById('sortSelect'),
  clearFilters: document.getElementById('clearFilters'),
  activeFilters: document.getElementById('activeFilters'),
  quotesMeta: document.getElementById('quotesMeta'),
  quotesGrid: document.getElementById('quotesGrid'),
  loadMoreQuotes: document.getElementById('loadMoreQuotes'),
  emptyState: document.getElementById('emptyState'),
  topicsGrid: document.getElementById('topicsGrid'),
  topicSearchInput: document.getElementById('topicSearchInput'),
  clearTopicSearch: document.getElementById('clearTopicSearch'),
  activeTopic: document.getElementById('activeTopic'),
  activeAuthor: document.getElementById('activeAuthor'),
  authorsGrid: document.getElementById('authorsGrid'),
  copyLink: document.getElementById('copyLink'),
  authorDialog: document.getElementById('authorDialog'),
  authorDialogBody: document.getElementById('authorDialogBody')
};

const AVATAR_FALLBACK = './assets/avatar-fallback.svg';

const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
const topicById = byId(topics);
const authorById = byId(authors);

const state = {
  topicId: null,
  authorId: null,
  topicQ: '',
  q: '',
  sort: 'relevance',
  quoteLimit: 18
};

const QUOTES_PAGE_SIZE = 18;

function clampText(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function normalize(s) {
  return clampText(s).toLowerCase();
}

function normalizeLoose(s) {
  return normalize(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function resetQuoteLimit() {
  state.quoteLimit = QUOTES_PAGE_SIZE;
}

function setTheme(next) {
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
}

function setCustomTheme(themeName) {
  if (themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    try {
      localStorage.setItem('customTheme', themeName);
    } catch (e) {}
  } else {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.removeItem('customTheme');
    } catch (e) {}
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function setUrlFromState() {
  const params = new URLSearchParams();
  if (state.topicId) params.set('tema', state.topicId);
  if (state.authorId) params.set('autor', state.authorId);
  if (state.q) params.set('q', state.q);
  if (state.sort && state.sort !== 'relevance') params.set('orden', state.sort);

  const next = params.toString();
  const url = next ? `?${next}#frases` : `${location.pathname}#frases`;
  history.replaceState(null, '', url);
}

function loadStateFromUrl() {
  const params = new URLSearchParams(location.search);
  const tema = params.get('tema');
  const autor = params.get('autor');
  const q = params.get('q');
  const orden = params.get('orden');

  state.topicId = tema && topicById[tema] ? tema : null;
  state.authorId = autor && authorById[autor] ? autor : null;
  state.topicQ = '';
  state.q = q ? clampText(q).slice(0, 120) : '';
  state.sort = orden && ['relevance', 'author', 'topic', 'random'].includes(orden) ? orden : 'relevance';
  resetQuoteLimit();
}

function loadThemeFromStorage() {
  try {
    const customTheme = localStorage.getItem('customTheme');
    if (customTheme) {
      document.documentElement.setAttribute('data-theme', customTheme);
      if (els.customThemeSelect) {
        els.customThemeSelect.value = customTheme;
      }
    } else {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {}
}

function countByTopic() {
  const counts = Object.fromEntries(topics.map((t) => [t.id, { quotes: 0, authors: new Set() }]));
  for (const q of quotes) {
    for (const tid of q.topicIds) {
      if (!counts[tid]) continue;
      counts[tid].quotes += 1;
      counts[tid].authors.add(q.authorId);
    }
  }
  const out = {};
  for (const [tid, v] of Object.entries(counts)) {
    out[tid] = { quotes: v.quotes, authors: v.authors.size };
  }
  return out;
}

function scoreQuote(q, query) {
  if (!query) return 0;
  const hay = normalize(`${q.text} ${authorById[q.authorId]?.name || ''}`);
  const parts = query.split(' ').filter(Boolean);
  let score = 0;
  for (const p of parts) {
    if (p.length < 2) continue;
    if (hay.includes(p)) score += 2;
  }
  if (hay.startsWith(parts[0] || '')) score += 1;
  return score;
}

function getFilteredQuotes() {
  const query = normalize(state.q);

  let list = quotes.slice();

  if (state.topicId) {
    list = list.filter((q) => q.topicIds.includes(state.topicId));
  }

  if (state.authorId) {
    list = list.filter((q) => q.authorId === state.authorId);
  }

  if (query) {
    list = list
      .map((q) => ({ q, score: scoreQuote(q, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.q);
  }

  if (state.sort === 'author') {
    list.sort((a, b) => {
      const an = authorById[a.authorId]?.name || '';
      const bn = authorById[b.authorId]?.name || '';
      return an.localeCompare(bn, 'es');
    });
  }

  if (state.sort === 'topic') {
    list.sort((a, b) => {
      const at = topicById[a.topicIds[0]]?.label || '';
      const bt = topicById[b.topicIds[0]]?.label || '';
      return at.localeCompare(bt, 'es');
    });
  }

  if (state.sort === 'random') {
    list.sort(() => Math.random() - 0.5);
  }

  return list;
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === false || v === null || v === undefined) {
    } else node.setAttribute(k, String(v));
  }
  const list = Array.isArray(children) ? children : [children];
  for (const c of list) {
    if (c === null || c === undefined) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

function renderHero() {
  els.year.textContent = String(new Date().getFullYear());
  const stats = [
    { value: quotes.length, label: 'frases' },
    { value: authors.length, label: 'autores' },
    { value: topics.length, label: 'temas' }
  ];

  els.heroStats.replaceChildren(
    ...stats.map((s) =>
      el('div', { class: 'stat' }, [
        el('strong', { text: String(s.value) }),
        el('span', { text: s.label })
      ])
    )
  );
}

function renderFeatured() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  const author = authorById[q.authorId];
  const primaryTopic = topicById[q.topicIds[0]];

  const card = el('div', { class: 'quote-card' }, [
    el('div', { class: 'quote-body' }, [
      el('div', { class: 'badge', text: primaryTopic ? primaryTopic.label : 'Tema' }),
      el('p', { class: 'quote-text', text: `“${q.text}”` })
    ]),
    el('div', { class: 'quote-footer' }, [
      el('div', { class: 'author-mini' }, [
        el('img', {
          class: 'avatar',
          src: author.image,
          alt: `Foto de ${author.name}`,
          loading: 'lazy',
          onerror: (e) => {
            e.currentTarget.src = AVATAR_FALLBACK;
          }
        }),
        el('div', {}, [
          el('div', { class: 'author-name', text: author.name }),
          el('div', { class: 'author-meta', text: `${author.tradition} · ${author.years}` })
        ])
      ]),
      el('div', { class: 'quote-actions' }, [
        el(
          'button',
          {
            class: 'icon-btn',
            type: 'button',
            'aria-label': 'Ver autor',
            onclick: () => openAuthorDialog(author.id)
          },
          '↗'
        )
      ])
    ])
  ]);

  els.featuredCard.replaceChildren(card);
}

function renderTopics() {
  const q = normalizeLoose(state.topicQ);
  const counts = countByTopic();

  let list = topics;
  if (q) {
    list = topics.filter((t) => normalizeLoose(t.label).includes(q));
  }

  if (state.topicId && topicById[state.topicId] && !list.some((t) => t.id === state.topicId)) {
    list = [topicById[state.topicId], ...list];
  }

  els.topicsGrid.replaceChildren(
    ...list.map((t) => {
      const active = state.topicId === t.id;
      const meta = counts[t.id] || { quotes: 0, authors: 0 };

      const node = el(
        'div',
        {
          class: 'topic-card',
          role: 'button',
          tabindex: '0',
          'aria-pressed': active ? 'true' : 'false',
          onclick: () => {
            state.topicId = state.topicId === t.id ? null : t.id;
            state.authorId = null;
            resetQuoteLimit();
            setUrlFromState();
            renderAll();
            location.hash = '#frases';
          },
          onkeydown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.currentTarget.click();
            }
          }
        },
        [
          el('div', { class: 'topic-title', text: t.label }),
          el('div', { class: 'topic-desc', text: t.description }),
          el('div', { class: 'topic-meta' }, [
            el('span', { class: 'badge', text: `${meta.quotes} frases` }),
            el('span', { class: 'badge', text: `${meta.authors} autores` }),
            active ? el('span', { class: 'badge', text: 'Activo' }) : null
          ])
        ]
      );

      return node;
    })
  );
}

function renderAuthors() {
  const sorted = authors.slice().sort((a, b) => a.name.localeCompare(b.name, 'es'));

  els.authorsGrid.replaceChildren(
    ...sorted.map((a) => {
      const authored = quotes.filter((q) => q.authorId === a.id).length;

      return el(
        'div',
        {
          class: 'author-card',
          role: 'button',
          tabindex: '0',
          onclick: () => openAuthorDialog(a.id),
          onkeydown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.currentTarget.click();
            }
          }
        },
        [
          el('div', { class: 'author-top' }, [
            el('img', {
              class: 'author-avatar',
              src: a.image,
              alt: `Foto de ${a.name}`,
              loading: 'lazy',
              onerror: (e) => {
                e.currentTarget.src = AVATAR_FALLBACK;
              }
            }),
            el('div', {}, [
              el('div', { class: 'author-title', text: a.name }),
              el('div', { class: 'author-sub', text: `${a.tradition} · ${a.years}` })
            ])
          ]),
          el('div', { class: 'author-bio', text: a.bio }),
          el('div', { class: 'author-tags' }, [
            el('span', { class: 'badge', text: `${authored} frases` }),
            el('span', { class: 'badge', text: 'Ver perfil' })
          ])
        ]
      );
    })
  );
}

function renderActiveFilters() {
  const chips = [];

  if (state.topicId) {
    chips.push(
      el('div', { class: 'filter-chip' }, [
        el('span', { text: `Tema: ${topicById[state.topicId]?.label || state.topicId}` }),
        el(
          'button',
          {
            type: 'button',
            'aria-label': 'Quitar filtro de tema',
            onclick: () => {
              state.topicId = null;
              resetQuoteLimit();
              setUrlFromState();
              renderAll();
            }
          },
          '×'
        )
      ])
    );
  }

  if (state.authorId) {
    chips.push(
      el('div', { class: 'filter-chip' }, [
        el('span', { text: `Autor: ${authorById[state.authorId]?.name || state.authorId}` }),
        el(
          'button',
          {
            type: 'button',
            'aria-label': 'Quitar filtro de autor',
            onclick: () => {
              state.authorId = null;
              resetQuoteLimit();
              setUrlFromState();
              renderAll();
            }
          },
          '×'
        )
      ])
    );
  }

  if (state.q) {
    chips.push(
      el('div', { class: 'filter-chip' }, [
        el('span', { text: `Búsqueda: “${state.q}”` }),
        el(
          'button',
          {
            type: 'button',
            'aria-label': 'Quitar búsqueda',
            onclick: () => {
              state.q = '';
              els.searchInput.value = '';
              resetQuoteLimit();
              setUrlFromState();
              renderAll();
            }
          },
          '×'
        )
      ])
    );
  }

  els.activeFilters.replaceChildren(...chips);

  els.activeTopic.textContent = state.topicId ? topicById[state.topicId]?.label || state.topicId : 'Ninguno';
  els.activeTopic.classList.toggle('muted', !state.topicId);

  els.activeAuthor.textContent = state.authorId ? authorById[state.authorId]?.name || state.authorId : 'Ninguno';
  els.activeAuthor.classList.toggle('muted', !state.authorId);
}

function renderQuotes() {
  const all = getFilteredQuotes();
  const list = all.slice(0, Math.max(1, state.quoteLimit));

  els.quotesMeta.textContent = `${list.length} de ${all.length} resultado(s) · ${quotes.length} en total`;
  els.emptyState.hidden = all.length > 0;
  if (els.loadMoreQuotes) {
    els.loadMoreQuotes.hidden = all.length === 0 || list.length >= all.length;
  }

  els.quotesGrid.replaceChildren(
    ...list.map((q) => {
      const author = authorById[q.authorId];
      const primaryTopic = topicById[q.topicIds[0]];

      const topicLabel = primaryTopic ? primaryTopic.label : 'Tema';

      return el('article', { class: 'quote-card' }, [
        el('div', { class: 'quote-body' }, [
          el(
            'button',
            {
              class: 'badge',
              type: 'button',
              'aria-label': `Filtrar por tema ${topicLabel}`,
              onclick: () => {
                state.topicId = q.topicIds[0] || null;
                state.authorId = null;
                resetQuoteLimit();
                setUrlFromState();
                renderAll();
              }
            },
            topicLabel
          ),
          el('p', { class: 'quote-text', text: `“${q.text}”` })
        ]),
        el('div', { class: 'quote-footer' }, [
          el('div', { class: 'author-mini' }, [
            el('img', {
              class: 'avatar',
              src: author.image,
              alt: `Foto de ${author.name}`,
              loading: 'lazy',
              onerror: (e) => {
                e.currentTarget.src = AVATAR_FALLBACK;
              }
            }),
            el('div', {}, [
              el('div', { class: 'author-name', text: author.name }),
              el('div', { class: 'author-meta', text: `${author.tradition} · ${author.years}` })
            ])
          ]),
          el('div', { class: 'quote-actions' }, [
            el(
              'button',
              {
                class: 'icon-btn',
                type: 'button',
                'aria-label': `Filtrar por autor ${author.name}`,
                onclick: () => {
                  state.authorId = author.id;
                  resetQuoteLimit();
                  setUrlFromState();
                  renderAll();
                }
              },
              '⌁'
            ),
            el(
              'button',
              {
                class: 'icon-btn',
                type: 'button',
                'aria-label': 'Ver detalle del autor',
                onclick: () => openAuthorDialog(author.id)
              },
              '↗'
            )
          ])
        ])
      ]);
    })
  );
}

function openAuthorDialog(authorId) {
  const author = authorById[authorId];
  if (!author) return;

  const authoredQuotes = quotes
    .filter((q) => q.authorId === authorId)
    .map((q) => ({ q, primary: topicById[q.topicIds[0]]?.label || 'Tema' }));

  const body = el('div', { class: 'dialog-body' }, [
    el('div', { class: 'dialog-hero' }, [
      el('img', {
        class: 'dialog-avatar',
        src: author.image,
        alt: `Foto de ${author.name}`,
        loading: 'lazy',
        onerror: (e) => {
          e.currentTarget.src = AVATAR_FALLBACK;
        }
      }),
      el('div', { class: 'dialog-name', text: author.name }),
      el('div', { class: 'dialog-sub', text: `${author.tradition} · ${author.years}` }),
      el('div', { class: 'card-divider' }),
      el(
        'button',
        {
          class: 'btn btn-secondary',
          type: 'button',
          onclick: () => {
            state.authorId = authorId;
            state.topicId = null;
            resetQuoteLimit();
            setUrlFromState();
            renderAll();
            try {
              els.authorDialog.close();
            } catch (e) {}
            location.hash = '#frases';
          }
        },
        'Filtrar frases por este autor'
      )
    ]),
    el('div', { class: 'dialog-copy' }, [
      el('h3', { text: 'Contexto' }),
      el('p', { text: author.bio }),
      el('div', { class: 'card-divider' }),
      el('h3', { text: 'Frases' }),
      el(
        'div',
        { class: 'dialog-quotes' },
        authoredQuotes.slice(0, 10).map(({ q, primary }) =>
          el('div', { class: 'card' }, [
            el('div', { class: 'badge', text: primary }),
            el('p', { class: 'muted', text: `“${q.text}”` })
          ])
        )
      )
    ])
  ]);

  els.authorDialogBody.replaceChildren(body);

  if (typeof els.authorDialog.showModal === 'function') {
    els.authorDialog.showModal();
  } else {
    els.authorDialog.setAttribute('open', '');
  }
}

function closeDialogIfBackdrop(e) {
  const rect = els.authorDialog.getBoundingClientRect();
  const inDialog =
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width;

  if (!inDialog) {
    try {
      els.authorDialog.close();
    } catch (err) {
      els.authorDialog.removeAttribute('open');
    }
  }
}

function renderGenerator() {
  els.generatorTopicSelect.innerHTML = '<option value="">-- Elegir tema --</option>' +
    topics.map(t => `<option value="${t.id}">${t.label}</option>`).join('');
}

function generateCustomQuotes() {
  const topicId = els.generatorTopicSelect.value;
  const count = parseInt(els.generatorCountSelect.value, 10);
  
  if (!topicId || !count) return;
  
  const topic = topicById[topicId];
  if (!topic) return;
  
  const templates = makeTopicTemplates(topic.label);
  const baseIds = inferBaseTopicIds(topic.label);
  const used = new Set();
  const out = [];
  
  for (let i = 0; i < count; i++) {
    let templateIndex;
    let attempts = 0;
    
    do {
      templateIndex = Math.floor(Math.random() * templates.length);
      attempts++;
    } while (used.has(templateIndex) && attempts < templates.length);
    
    if (attempts >= templates.length) {
      used.clear();
    }
    
    used.add(templateIndex);
    
    const text = templates[templateIndex]();
    const topicIds = Array.from(new Set([topic.id, ...baseIds]));
    
    out.push({
      id: `gen-${topic.id}-${i + 1}`,
      text,
      authorId: 'biblioteca',
      topicIds
    });
  }
  
  els.generatedQuotes.replaceChildren(
    el('div', { class: 'section-header' }, [
      el('h3', { text: `${count} frases generadas para: ${topic.label}` }),
      el('p', { class: 'muted', text: 'Frases únicas creadas para este tema.' })
    ]),
    ...out.map(q => {
      const primaryTopic = topicById[q.topicIds[0]];
      const topicLabel = primaryTopic ? primaryTopic.label : 'Tema';
      
      return el('article', { class: 'quote-card' }, [
        el('div', { class: 'quote-body' }, [
          el('button', {
            class: 'badge',
            type: 'button',
            'aria-label': `Filtrar por tema ${topicLabel}`,
            onclick: () => {
              state.topicId = q.topicIds[0] || null;
              state.authorId = null;
              resetQuoteLimit();
              setUrlFromState();
              renderAll();
              location.hash = '#frases';
            }
          }, topicLabel),
          el('p', { class: 'quote-text', text: `“${q.text}”` })
        ]),
        el('div', { class: 'quote-footer' }, [
          el('div', { class: 'author-mini' }, [
            el('img', {
              class: 'avatar',
              src: authorById[q.authorId].image,
              alt: `Foto de ${authorById[q.authorId].name}`,
              loading: 'lazy',
              onerror: (e) => {
                e.currentTarget.src = AVATAR_FALLBACK;
              }
            }),
            el('span', { text: authorById[q.authorId].name })
          ])
        ])
      ]);
    })
  );
}

function renderAll() {
  els.searchInput.value = state.q;
  els.sortSelect.value = state.sort;
  if (els.topicSearchInput) els.topicSearchInput.value = state.topicQ;

  renderActiveFilters();
  renderTopics();
  renderQuotes();
}

function bind() {
  els.themeToggle.addEventListener('click', toggleTheme);

  if (els.customThemeSelect) {
    els.customThemeSelect.addEventListener('change', (e) => {
      setCustomTheme(e.target.value);
    });
  }

  els.shuffleFeatured.addEventListener('click', renderFeatured);

  if (els.topicSearchInput) {
    els.topicSearchInput.addEventListener('input', (e) => {
      state.topicQ = clampText(e.target.value).slice(0, 80);
      renderTopics();
    });
  }

  if (els.clearTopicSearch) {
    els.clearTopicSearch.addEventListener('click', () => {
      state.topicQ = '';
      if (els.topicSearchInput) els.topicSearchInput.value = '';
      renderTopics();
    });
  }

  els.searchInput.addEventListener('input', (e) => {
    state.q = clampText(e.target.value).slice(0, 120);
    resetQuoteLimit();
    setUrlFromState();
    renderAll();
  });

  els.sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    resetQuoteLimit();
    setUrlFromState();
    renderAll();
  });

  els.clearFilters.addEventListener('click', () => {
    state.topicId = null;
    state.authorId = null;
    state.q = '';
    state.sort = 'relevance';
    resetQuoteLimit();
    setUrlFromState();
    renderAll();
  });

  if (els.loadMoreQuotes) {
    els.loadMoreQuotes.addEventListener('click', () => {
      state.quoteLimit += QUOTES_PAGE_SIZE;
      renderQuotes();
    });
  }

  els.copyLink.addEventListener('click', async () => {
    const url = location.href;
    try {
      await navigator.clipboard.writeText(url);
      els.copyLink.textContent = 'Copiado';
      setTimeout(() => (els.copyLink.textContent = 'Copiar enlace con filtros'), 1200);
    } catch (e) {
      prompt('Copia este enlace:', url);
    }
  });

  els.authorDialogClose?.addEventListener('click', closeAuthorDialog);
  els.authorDialog?.addEventListener('click', (e) => {
    if (e.target === els.authorDialog) closeAuthorDialog();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAuthorDialog();
  });
}

loadStateFromUrl();
loadThemeFromStorage();
renderHero();
bind();
renderTopics();
renderAuthors();
renderFeatured();
renderAll();
setUrlFromState();
