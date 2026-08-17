/**
 * My Movie Watchlist — Universal Frontend Engine
 * Connects to Django REST Framework backend with smooth offline/cloud sandbox fallback for Vercel deployment.
 */

// API Configuration
const API_BASE =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000/api/'
    : 'https://movie-watchlist-zgru.onrender.com/api/';
  
// Pre-seeded Demo Data for instantaneous college review & testing
const DEMO_SEEDED_MEDIA = [
  {
    id: 1,
    title: 'Inception',
    type: 'Movie',
    status: 'Unwatched',
    rating: null,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX800_.jpg',
    year: 2010,
    genre: 'Sci-Fi',
    owner: 'demo',
    created_at: '2026-01-10T12:00:00Z',
  },
  {
    id: 2,
    title: 'Breaking Bad',
    type: 'TV',
    status: 'Watched',
    rating: 5,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNGYxOGJkMjItZjVkZC00OGEzLWExNjktOTZmNGZhZmRlMTk2XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg',
    year: 2008,
    genre: 'Crime Drama',
    owner: 'demo',
    created_at: '2026-01-11T12:00:00Z',
  },
  {
    id: 3,
    title: 'Interstellar',
    type: 'Movie',
    status: 'Watched',
    rating: 5,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg',
    year: 2014,
    genre: 'Sci-Fi',
    owner: 'demo',
    created_at: '2026-01-12T12:00:00Z',
  },
  {
    id: 4,
    title: 'The Dark Knight',
    type: 'Movie',
    status: 'Watched',
    rating: 5,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX800_.jpg',
    year: 2008,
    genre: 'Action',
    owner: 'demo',
    created_at: '2026-01-13T12:00:00Z',
  },
  {
    id: 5,
    title: 'Stranger Things',
    type: 'TV',
    status: 'Unwatched',
    rating: null,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWM0LWE0ZDktYThjOTZiOGY3ODlhXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg',
    year: 2016,
    genre: 'Sci-Fi / Horror',
    owner: 'demo',
    created_at: '2026-01-14T12:00:00Z',
  },
  {
    id: 6,
    title: 'Dune: Part Two',
    type: 'Movie',
    status: 'Unwatched',
    rating: null,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NDdjLTliOGQtNTM1NDQ2MmY3NjZhXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg',
    year: 2024,
    genre: 'Sci-Fi',
    owner: 'demo',
    created_at: '2026-01-15T12:00:00Z',
  },
  {
    id: 7,
    title: 'Severance',
    type: 'TV',
    status: 'Watched',
    rating: 5,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMjA5OTc3NDEtMTQ4YS00YTk5LTk4NDgtNGFmNzBlMGMwNDFlXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg',
    year: 2022,
    genre: 'Mystery / Thriller',
    owner: 'demo',
    created_at: '2026-01-16T12:00:00Z',
  },
  {
    id: 8,
    title: 'Oppenheimer',
    type: 'Movie',
    status: 'Watched',
    rating: 5,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg',
    year: 2023,
    genre: 'Biography / Drama',
    owner: 'demo',
    created_at: '2026-01-17T12:00:00Z',
  },
  {
    id: 9,
    title: 'Succession',
    type: 'TV',
    status: 'Watched',
    rating: 5,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNTI4YjVhOGMtYjQ1My00YjBhLWE1YTctMDUyZGM5NTc4NDQ5XkEyXkFqcGc@._V1_FMjpg_UX800_.jpg',
    year: 2018,
    genre: 'Drama',
    owner: 'demo',
    created_at: '2026-01-18T12:00:00Z',
  },
  {
    id: 10,
    title: 'Spirited Away',
    type: 'Movie',
    status: 'Unwatched',
    rating: null,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNTEyNmEwOWUtYzkyOC00ZTQ4LTllZmUtMjk0Y2Y5ZWZmYzJkXkEyXkFqcGc@._V1_FMjpg_UX800_.jpg',
    year: 2001,
    genre: 'Animation / Fantasy',
    owner: 'demo',
    created_at: '2026-01-19T12:00:00Z',
  },
];

// App State
const state = {
  user: JSON.parse(localStorage.getItem('watchlist_user') || 'null'),
  accessToken: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  mediaList: [],
  activeTab: 'Unwatched', // 'Unwatched' or 'Watched'
  activeTypeFilter: 'ALL', // 'ALL', 'Movie', 'TV'
  searchQuery: '',
  sortBy: 'newest',
  isDarkMode: localStorage.getItem('watchlist_theme') !== 'light',
  isSandboxMode: false,
  addForm: {
    title: '',
    type: 'Movie',
    status: 'Unwatched',
    rating: 5,
    posterUrl: '',
    year: null,
    genre: '',
  },
};

// ==========================================================================
// Resilient API Client with Cloud/Sandbox Fallback for Public Deployments
// ==========================================================================
async function apiRequest(endpoint, options = {}) {
  // If sandbox mode is explicitly active, handle locally
  if (state.isSandboxMode) {
    return handleSandboxApi(endpoint, options);
  }

  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (state.accessToken) {
    headers['Authorization'] = `Bearer ${state.accessToken}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    let response = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.status === 204) return null;

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || data.username?.[0] || 'Request failed.');
    }
    return data;
  } catch (err) {
    console.warn(`Live API unavailable at ${url}. Switching to resilient client-side storage:`, err);
    state.isSandboxMode = true;
    return handleSandboxApi(endpoint, options);
  }
}

// Sandbox local store handler for zero-downtime public demonstration
function handleSandboxApi(endpoint, options = {}) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};

  // Auth Login
  if (endpoint.includes('auth/login/')) {
    const username = body.username || 'demo';
    const user = { id: 1, username, email: `${username}@example.com` };
    state.user = user;
    state.accessToken = `mock-token-${Date.now()}`;
    localStorage.setItem('access_token', state.accessToken);
    localStorage.setItem('watchlist_user', JSON.stringify(user));
    return { access: state.accessToken, refresh: 'mock-refresh', user };
  }

  // Auth Register
  if (endpoint.includes('auth/register/')) {
    const username = body.username || 'newuser';
    const user = { id: Date.now(), username, email: body.email || '' };
    state.user = user;
    state.accessToken = `mock-token-${Date.now()}`;
    localStorage.setItem('access_token', state.accessToken);
    localStorage.setItem('watchlist_user', JSON.stringify(user));
    return { tokens: { access: state.accessToken, refresh: 'mock-refresh' }, user };
  }

  // Auth Me
  if (endpoint.includes('auth/me/')) {
    return state.user || { id: 1, username: 'demo', email: 'demo@example.com' };
  }

  // Get Media List
  if (endpoint === 'media/' && method === 'GET') {
    const key = `watchlist_items_${state.user?.username || 'demo'}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // Seed initial demo data
    localStorage.setItem(key, JSON.stringify(DEMO_SEEDED_MEDIA));
    return DEMO_SEEDED_MEDIA;
  }

  // Create Media
  if (endpoint === 'media/' && method === 'POST') {
    const key = `watchlist_items_${state.user?.username || 'demo'}`;
    const current = JSON.parse(localStorage.getItem(key) || JSON.stringify(DEMO_SEEDED_MEDIA));
    const newItem = {
      id: Date.now(),
      title: body.title,
      type: body.type || 'Movie',
      status: body.status || 'Unwatched',
      rating: body.rating || null,
      poster_url: body.poster_url || null,
      year: body.year || null,
      genre: body.genre || null,
      owner: state.user?.username || 'demo',
      created_at: new Date().toISOString(),
    };
    current.unshift(newItem);
    localStorage.setItem(key, JSON.stringify(current));
    return newItem;
  }

  // Update Media (PATCH)
  if (endpoint.startsWith('media/') && method === 'PATCH') {
    const id = parseInt(endpoint.split('/')[1], 10);
    const key = `watchlist_items_${state.user?.username || 'demo'}`;
    const current = JSON.parse(localStorage.getItem(key) || JSON.stringify(DEMO_SEEDED_MEDIA));
    const idx = current.findIndex((m) => m.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...body };
      localStorage.setItem(key, JSON.stringify(current));
      return current[idx];
    }
    return { id, ...body };
  }

  // Delete Media
  if (endpoint.startsWith('media/') && method === 'DELETE') {
    const id = parseInt(endpoint.split('/')[1], 10);
    const key = `watchlist_items_${state.user?.username || 'demo'}`;
    let current = JSON.parse(localStorage.getItem(key) || JSON.stringify(DEMO_SEEDED_MEDIA));
    current = current.filter((m) => m.id !== id);
    localStorage.setItem(key, JSON.stringify(current));
    return null;
  }

  return {};
}

// ==========================================================================
// Authentication Handlers
// ==========================================================================
async function handleLogin(username, password) {
  const data = await apiRequest('auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  state.accessToken = data.access;
  state.refreshToken = data.refresh;
  state.user = data.user || { username };
  localStorage.setItem('access_token', state.accessToken);
  localStorage.setItem('watchlist_user', JSON.stringify(state.user));

  renderAuthNav();
  closeAuthModal();
  showToast(`Welcome back, ${state.user.username}!`);
  loadMediaList();
}

async function handleRegister(username, email, password) {
  const data = await apiRequest('auth/register/', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });

  state.accessToken = data.tokens?.access || data.access || `token-${Date.now()}`;
  state.user = data.user || { username, email };
  localStorage.setItem('access_token', state.accessToken);
  localStorage.setItem('watchlist_user', JSON.stringify(state.user));

  renderAuthNav();
  closeAuthModal();
  showToast(`Account created! Welcome, ${username}`);
  loadMediaList();
}

async function fetchCurrentUser() {
  if (!state.accessToken) return;
  try {
    const user = await apiRequest('auth/me/');
    state.user = user;
    localStorage.setItem('watchlist_user', JSON.stringify(user));
    renderAuthNav();
  } catch (e) {
    console.warn('Could not fetch user profile:', e);
  }
}

function handleLogout() {
  state.user = null;
  state.accessToken = null;
  state.refreshToken = null;
  state.mediaList = [];
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('watchlist_user');

  renderAuthNav();
  renderAppView();
  showToast('Logged out successfully.');
}

// ==========================================================================
// Media CRUD Operations
// ==========================================================================
async function loadMediaList() {
  if (!state.accessToken) {
    renderAppView();
    return;
  }

  showLoading(true);
  try {
    const list = await apiRequest('media/');
    state.mediaList = list || [];
    renderAppView();
  } catch (err) {
    console.error('Failed to load media:', err);
  } finally {
    showLoading(false);
  }
}

async function addMedia(payload) {
  const newItem = await apiRequest('media/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  state.mediaList.unshift(newItem);
  renderAppView();
  showToast(`Added "${newItem.title}"`);
}

async function markAsWatched(id) {
  try {
    const updated = await apiRequest(`media/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Watched', rating: 5 }),
    });

    state.mediaList = state.mediaList.map((m) => (m.id === id ? { ...m, ...updated } : m));
    renderAppView();
    showToast(`Marked "${updated.title || 'Movie'}" as watched`);
  } catch (err) {
    showToast(err.message || 'Failed to update status.');
  }
}

async function updateRating(id, rating) {
  try {
    const updated = await apiRequest(`media/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ rating }),
    });

    state.mediaList = state.mediaList.map((m) => (m.id === id ? { ...m, ...updated } : m));
    renderAppView();
    showToast(`Rated "${updated.title || 'Title'}" ${rating}/5`);
  } catch (err) {
    showToast(err.message || 'Failed to update rating.');
  }
}

async function deleteMedia(id, title) {
  if (!confirm(`Remove "${title}" from your watchlist?`)) return;

  try {
    await apiRequest(`media/${id}/`, { method: 'DELETE' });
    state.mediaList = state.mediaList.filter((m) => m.id !== id);
    renderAppView();
    showToast(`Removed "${title}"`);
  } catch (err) {
    showToast(err.message || 'Failed to delete title.');
  }
}

// ==========================================================================
// Universal Multi-Source Poster Search (Cinemeta + Apple iTunes + TVMaze)
// ==========================================================================
function generateFallbackPoster(title, type, year, genre) {
  const gradientColors = [
    ['#1e1b4b', '#312e81', '#4338ca'],
    ['#1e293b', '#0f172a', '#3b82f6'],
    ['#18181b', '#27272a', '#7c3aed'],
    ['#172554', '#1e3a8a', '#0284c7'],
    ['#052e16', '#064e3b', '#059669'],
  ];
  const hash = (title || 'Film').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const colors = gradientColors[hash % gradientColors.length];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors[0]}" />
          <stop offset="50%" stop-color="${colors[1]}" />
          <stop offset="100%" stop-color="${colors[2]}" />
        </linearGradient>
      </defs>
      <rect width="600" height="900" fill="url(#g)" />
      <circle cx="300" cy="360" r="140" fill="white" opacity="0.06" />
      <path d="M260 300 L360 360 L260 420 Z" fill="white" opacity="0.3" />
      <text x="300" y="550" font-family="sans-serif" font-size="44" font-weight="bold" fill="white" text-anchor="middle">
        ${title && title.length > 20 ? title.substring(0, 20) + '...' : title}
      </text>
      <text x="300" y="610" font-family="sans-serif" font-size="24" fill="#93c5fd" text-anchor="middle">
        ${year || ''} ${type ? '• ' + type : ''} ${genre ? '• ' + genre : ''}
      </text>
      <rect x="230" y="660" width="140" height="34" rx="17" fill="white" opacity="0.15" />
      <text x="300" y="684" font-family="sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">
        CINEMA
      </text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

async function searchPosters(query) {
  if (!query || query.trim().length < 2) return [];

  const clean = query.trim();
  const results = [];
  const seen = new Set();

  const add = (item) => {
    const key = `${item.title.toLowerCase()}_${item.year || ''}_${item.type}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push(item);
    }
  };

  const promises = [
    // 1. Cinemeta Movies (Official IMDb CDN)
    fetch(`https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURIComponent(clean)}.json`)
      .then((r) => (r.ok ? r.json() : { metas: [] }))
      .then((d) => {
        if (d && d.metas) {
          d.metas.forEach((m) => {
            let p = m.poster || null;
            if (p && p.includes('media-amazon.com')) p = p.replace(/_V1_.*\.jpg/, '_V1_FMjpg_UX800_.jpg');
            add({
              title: m.name,
              year: m.year ? parseInt(m.year, 10) : null,
              genre: m.genres?.[0] || 'Movie',
              type: 'Movie',
              poster: p,
            });
          });
        }
      })
      .catch(() => {}),

    // 2. Cinemeta Series
    fetch(`https://v3-cinemeta.strem.io/catalog/series/top/search=${encodeURIComponent(clean)}.json`)
      .then((r) => (r.ok ? r.json() : { metas: [] }))
      .then((d) => {
        if (d && d.metas) {
          d.metas.forEach((m) => {
            let p = m.poster || null;
            if (p && p.includes('media-amazon.com')) p = p.replace(/_V1_.*\.jpg/, '_V1_FMjpg_UX800_.jpg');
            add({
              title: m.name,
              year: m.year ? parseInt(m.year, 10) : null,
              genre: m.genres?.[0] || 'TV Show',
              type: 'TV',
              poster: p,
            });
          });
        }
      })
      .catch(() => {}),

    // 3. Apple iTunes HD
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(clean)}&media=movie&limit=6`)
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((d) => {
        if (d && d.results) {
          d.results.forEach((item) => {
            const p = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb.jpg', '800x1200bb.jpg') : null;
            add({
              title: item.trackName,
              year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : null,
              genre: item.primaryGenreName || 'Movie',
              type: 'Movie',
              poster: p,
            });
          });
        }
      })
      .catch(() => {}),

    // 4. TVMaze Shows
    fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(clean)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (Array.isArray(d)) {
          d.forEach((entry) => {
            if (entry.show) {
              add({
                title: entry.show.name,
                year: entry.show.premiered ? new Date(entry.show.premiered).getFullYear() : null,
                genre: entry.show.genres?.[0] || 'TV Show',
                type: 'TV',
                poster: entry.show.image?.original || entry.show.image?.medium || null,
              });
            }
          });
        }
      })
      .catch(() => {}),
  ];

  await Promise.all(promises);
  return results.filter((r) => r.poster).slice(0, 15);
}

// ==========================================================================
// UI Rendering
// ==========================================================================
function renderAuthNav() {
  const section = document.getElementById('auth-nav-section');
  const addBtn = document.getElementById('open-add-btn');

  if (state.user && state.accessToken) {
    if (addBtn) addBtn.style.display = 'inline-flex';
    section.innerHTML = `
      <div class="user-info" title="Logged in as ${state.user.username}">
        <i data-lucide="user"></i>
        <span class="user-name">${state.user.username}</span>
      </div>
      <button type="button" id="btn-logout" class="btn btn-ghost" title="Log out">
        <i data-lucide="log-out"></i>
        <span>Logout</span>
      </button>
    `;
    document.getElementById('btn-logout').addEventListener('click', handleLogout);
  } else {
    if (addBtn) addBtn.style.display = 'none';
    section.innerHTML = `
      <button type="button" id="nav-login-btn" class="btn btn-secondary">
        <i data-lucide="log-in"></i>
        <span>Sign In</span>
      </button>
    `;
    document.getElementById('nav-login-btn').addEventListener('click', openAuthModal);
  }

  lucide.createIcons();
}

function renderAppView() {
  const unauthHero = document.getElementById('unauth-hero');
  const authDashboard = document.getElementById('auth-dashboard');

  if (!state.accessToken) {
    unauthHero.style.display = 'block';
    authDashboard.style.display = 'none';
    lucide.createIcons();
    return;
  }

  unauthHero.style.display = 'none';
  authDashboard.style.display = 'block';

  // Compute Stats
  const total = state.mediaList.length;
  const toWatch = state.mediaList.filter((m) => m.status === 'Unwatched').length;
  const watched = state.mediaList.filter((m) => m.status === 'Watched').length;
  const rated = state.mediaList.filter((m) => m.status === 'Watched' && m.rating);
  const avg = rated.length ? (rated.reduce((a, b) => a + b.rating, 0) / rated.length).toFixed(1) : null;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-towatch').textContent = toWatch;
  document.getElementById('stat-watched').textContent = watched;
  document.getElementById('stat-rating').textContent = avg ? `${avg} / 5` : '—';
  document.getElementById('badge-towatch').textContent = toWatch;
  document.getElementById('badge-watched').textContent = watched;

  // Filter & Sort
  const filtered = state.mediaList.filter((item) => {
    const tabMatch = item.status === state.activeTab;
    const typeMatch = state.activeTypeFilter === 'ALL' || item.type === state.activeTypeFilter;
    const searchMatch = !state.searchQuery || item.title.toLowerCase().includes(state.searchQuery.toLowerCase());
    return tabMatch && typeMatch && searchMatch;
  });

  filtered.sort((a, b) => {
    if (state.sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    if (state.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (state.sortBy === 'title') return a.title.localeCompare(b.title);
    if (state.sortBy === 'year') return (b.year || 0) - (a.year || 0);
    return 0;
  });

  // Render Grid or Empty State
  const grid = document.getElementById('media-grid');
  const emptyState = document.getElementById('empty-state');

  if (filtered.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'flex';
    document.getElementById('empty-title').textContent = state.searchQuery
      ? 'No matching titles found'
      : state.activeTab === 'Unwatched'
      ? 'Your watchlist is empty'
      : 'No watched titles yet';
  } else {
    emptyState.style.display = 'none';
    grid.style.display = 'grid';
    grid.innerHTML = filtered.map((item) => renderMediaCard(item)).join('');
    bindCardEvents();
  }

  lucide.createIcons();
}

function renderMediaCard(item) {
  const isWatched = item.status === 'Watched';
  const poster = item.poster_url || generateFallbackPoster(item.title, item.type, item.year, item.genre);

  return `
    <div class="media-card" data-id="${item.id}">
      <div class="poster-box">
        <img src="${poster}" alt="${item.title}" class="poster-img" loading="lazy" onerror="this.src='${generateFallbackPoster(item.title, item.type, item.year, item.genre)}'" />
        
        <div class="poster-overlay-top">
          <span class="media-badge badge-${item.type.toLowerCase()}">${item.type === 'Movie' ? 'Film' : 'TV'}</span>
          <button type="button" class="btn-icon-blur btn-delete" data-id="${item.id}" data-title="${item.title}" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>

        ${isWatched && item.rating ? `
          <div class="poster-score-badge">
            <i data-lucide="star"></i>
            <span>${item.rating}</span>
          </div>
        ` : ''}
      </div>

      <div class="card-body">
        <div class="media-info-row">
          ${item.year ? `<span class="media-year">${item.year}</span>` : ''}
          ${item.genre ? `<span class="media-genre-pill">${item.genre}</span>` : ''}
        </div>
        <h3 class="media-title" title="${item.title}">${item.title}</h3>
      </div>

      <div class="card-footer">
        ${isWatched ? `
          <div class="rating-section">
            <span class="rating-label">Rating:</span>
            <div class="star-rating-row" data-id="${item.id}">
              ${[1, 2, 3, 4, 5].map((star) => `
                <button type="button" class="star-btn ${star <= (item.rating || 0) ? 'filled' : ''}" data-star="${star}">
                  <i data-lucide="star"></i>
                </button>
              `).join('')}
            </div>
          </div>
        ` : `
          <button type="button" class="btn btn-secondary btn-block btn-mark-watched" data-id="${item.id}">
            <i data-lucide="check"></i>
            <span>Mark as Watched</span>
          </button>
        `}
      </div>
    </div>
  `;
}

function bindCardEvents() {
  document.querySelectorAll('.btn-mark-watched').forEach((btn) => {
    btn.addEventListener('click', () => markAsWatched(parseInt(btn.dataset.id, 10)));
  });

  document.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteMedia(parseInt(btn.dataset.id, 10), btn.dataset.title);
    });
  });

  document.querySelectorAll('.star-rating-row').forEach((row) => {
    const id = parseInt(row.dataset.id, 10);
    row.querySelectorAll('.star-btn').forEach((starBtn) => {
      starBtn.addEventListener('click', () => {
        const star = parseInt(starBtn.dataset.star, 10);
        updateRating(id, star);
      });
    });
  });
}

// ==========================================================================
// Add Media Modal Logic
// ==========================================================================
let searchDebounceTimer = null;

function openAddModal() {
  state.addForm = {
    title: '',
    type: 'Movie',
    status: 'Unwatched',
    rating: 5,
    posterUrl: '',
    year: null,
    genre: '',
  };

  document.getElementById('add-title-input').value = '';
  document.getElementById('add-year-input').value = '';
  document.getElementById('add-genre-input').value = '';
  document.getElementById('add-poster-url').value = '';
  document.getElementById('poster-results-gallery').style.display = 'none';
  document.getElementById('add-error').style.display = 'none';
  updatePosterPreview('');
  renderStarPicker(5);
  syncAddFormControls();

  document.getElementById('add-modal').style.display = 'flex';
  document.getElementById('add-title-input').focus();
  lucide.createIcons();
}

function closeAddModal() {
  document.getElementById('add-modal').style.display = 'none';
}

function updatePosterPreview(url) {
  const empty = document.getElementById('poster-preview-empty');
  const img = document.getElementById('poster-preview-img');
  if (url) {
    empty.style.display = 'none';
    img.style.display = 'block';
    img.src = url;
  } else {
    empty.style.display = 'flex';
    img.style.display = 'none';
  }
}

function syncAddFormControls() {
  document.querySelectorAll('.add-media-modal-card [data-value]').forEach((btn) => {
    const isType = btn.dataset.value === 'Movie' || btn.dataset.value === 'TV';
    const isStatus = btn.dataset.value === 'Unwatched' || btn.dataset.value === 'Watched';
    if (isType) btn.classList.toggle('active', btn.dataset.value === state.addForm.type);
    if (isStatus) btn.classList.toggle('active', btn.dataset.value === state.addForm.status);
  });

  document.getElementById('rating-form-group').style.display =
    state.addForm.status === 'Watched' ? 'flex' : 'none';
}

function renderStarPicker(currentRating) {
  const picker = document.getElementById('modal-star-picker');
  picker.innerHTML = [1, 2, 3, 4, 5]
    .map(
      (star) => `
      <button type="button" class="star-btn ${star <= currentRating ? 'filled' : ''}" data-star="${star}">
        <i data-lucide="star"></i>
      </button>
    `
    )
    .join('');

  picker.querySelectorAll('.star-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const star = parseInt(btn.dataset.star, 10);
      state.addForm.rating = star;
      document.getElementById('rating-score-display').textContent = `${star} / 5`;
      renderStarPicker(star);
      lucide.createIcons();
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toast-text');
  text.textContent = msg;
  toast.style.display = 'flex';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2800);
}

function showLoading(show) {
  document.getElementById('media-loading').style.display = show ? 'flex' : 'none';
}

function openAuthModal() {
  document.getElementById('auth-modal').style.display = 'flex';
  document.getElementById('auth-error').style.display = 'none';
  lucide.createIcons();
}

function closeAuthModal() {
  document.getElementById('auth-modal').style.display = 'none';
}

// ==========================================================================
// Initialization & Event Listeners
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  const applyTheme = (isDark) => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('watchlist_theme', isDark ? 'dark' : 'light');
    if (themeIcon) themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    lucide.createIcons();
  };

  themeBtn.addEventListener('click', () => {
    state.isDarkMode = !state.isDarkMode;
    applyTheme(state.isDarkMode);
  });
  applyTheme(state.isDarkMode);

  // Tab Navigation
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeTab = btn.dataset.tab;
      renderAppView();
    });
  });

  // Type Filters
  document.querySelectorAll('.type-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeTypeFilter = btn.dataset.type;
      renderAppView();
    });
  });

  // Search Filter
  document.getElementById('filter-search-input').addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    renderAppView();
  });

  // Sort Selector
  document.getElementById('sort-select').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderAppView();
  });

  // Hero Actions
  document.getElementById('hero-login-btn')?.addEventListener('click', openAuthModal);
  document.getElementById('hero-demo-btn')?.addEventListener('click', () => {
    handleLogin('demo', 'password123');
  });

  // Quick Demo Login in Auth Modal
  document.getElementById('btn-quick-demo')?.addEventListener('click', () => {
    handleLogin('demo', 'password123');
  });

  // Add Title Button
  document.getElementById('open-add-btn')?.addEventListener('click', openAddModal);
  document.getElementById('empty-add-btn')?.addEventListener('click', openAddModal);

  // Close modals
  document.querySelectorAll('.btn-close-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeAuthModal();
      closeAddModal();
    });
  });

  // Auth Form Tabs
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const regForm = document.getElementById('register-form');

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.style.display = 'block';
    regForm.style.display = 'none';
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    loginForm.style.display = 'none';
    regForm.style.display = 'block';
  });

  // Auth Form Submits
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value;
    const errBox = document.getElementById('auth-error');
    errBox.style.display = 'none';

    try {
      await handleLogin(u, p);
    } catch (err) {
      errBox.textContent = err.message || 'Login failed.';
      errBox.style.display = 'block';
    }
  });

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('reg-username').value.trim();
    const em = document.getElementById('reg-email').value.trim();
    const p = document.getElementById('reg-password').value;
    const errBox = document.getElementById('auth-error');
    errBox.style.display = 'none';

    try {
      await handleRegister(u, em, p);
    } catch (err) {
      errBox.textContent = err.message || 'Registration failed.';
      errBox.style.display = 'block';
    }
  });

  // Live Title Search in Add Modal
  const titleInput = document.getElementById('add-title-input');
  titleInput.addEventListener('input', (e) => {
    const val = e.target.value;
    state.addForm.title = val;
    clearTimeout(searchDebounceTimer);

    if (val.trim().length < 2) {
      document.getElementById('poster-results-gallery').style.display = 'none';
      return;
    }

    document.getElementById('search-status').style.display = 'inline-flex';

    searchDebounceTimer = setTimeout(async () => {
      try {
        const results = await searchPosters(val);
        const gallery = document.getElementById('poster-results-gallery');
        const grid = document.getElementById('poster-gallery-grid');
        const count = document.getElementById('poster-count-badge');

        if (results.length > 0) {
          count.textContent = `${results.length} available`;
          grid.innerHTML = results
            .map(
              (r) => `
              <div class="poster-gallery-item" title="${r.title} (${r.year || ''})">
                <img src="${r.poster}" alt="${r.title}" loading="lazy" />
              </div>
            `
            )
            .join('');

          grid.querySelectorAll('.poster-gallery-item').forEach((item, idx) => {
            item.addEventListener('click', () => {
              const selected = results[idx];
              state.addForm.title = selected.title;
              state.addForm.year = selected.year;
              state.addForm.genre = selected.genre;
              state.addForm.type = selected.type;
              state.addForm.posterUrl = selected.poster;

              document.getElementById('add-title-input').value = selected.title;
              if (selected.year) document.getElementById('add-year-input').value = selected.year;
              if (selected.genre) document.getElementById('add-genre-input').value = selected.genre;
              document.getElementById('add-poster-url').value = selected.poster;
              updatePosterPreview(selected.poster);
              syncAddFormControls();

              grid.querySelectorAll('.poster-gallery-item').forEach((i) => i.classList.remove('selected'));
              item.classList.add('selected');
            });
          });

          gallery.style.display = 'flex';
        } else {
          gallery.style.display = 'none';
        }
      } catch (err) {
        console.error('Search posters error:', err);
      } finally {
        document.getElementById('search-status').style.display = 'none';
      }
    }, 280);
  });

  // Segmented Type/Status Buttons
  document.querySelectorAll('.add-media-modal-card .segment-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.value;
      if (val === 'Movie' || val === 'TV') state.addForm.type = val;
      if (val === 'Unwatched' || val === 'Watched') state.addForm.status = val;
      syncAddFormControls();
    });
  });

  document.getElementById('add-poster-url').addEventListener('input', (e) => {
    state.addForm.posterUrl = e.target.value.trim();
    updatePosterPreview(state.addForm.posterUrl);
  });

  // Submit Add Media
  document.getElementById('add-media-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('add-title-input').value.trim();
    const yearVal = document.getElementById('add-year-input').value;
    const genreVal = document.getElementById('add-genre-input').value.trim();
    const customPoster = document.getElementById('add-poster-url').value.trim();
    const errBox = document.getElementById('add-error');
    errBox.style.display = 'none';

    if (!title) {
      errBox.textContent = 'Please enter a title.';
      errBox.style.display = 'block';
      return;
    }

    const finalPoster =
      customPoster ||
      state.addForm.posterUrl ||
      generateFallbackPoster(title, state.addForm.type, yearVal, genreVal);

    const payload = {
      title,
      type: state.addForm.type,
      status: state.addForm.status,
      year: yearVal ? parseInt(yearVal, 10) : null,
      genre: genreVal || null,
      poster_url: finalPoster,
      ...(state.addForm.status === 'Watched' ? { rating: state.addForm.rating } : { rating: null }),
    };

    try {
      await addMedia(payload);
      closeAddModal();
    } catch (err) {
      errBox.textContent = err.message || 'Failed to save title.';
      errBox.style.display = 'block';
    }
  });

  // Auto-load on startup
  if (state.accessToken) {
    renderAuthNav();
    await loadMediaList();
  } else {
    renderAuthNav();
    renderAppView();
  }

  lucide.createIcons();
});
