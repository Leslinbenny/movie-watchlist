/**
 * Universal Movie & TV Poster and Metadata Search Service
 * Aggregates Cinemeta (IMDb catalog), iTunes, and TVMaze in parallel for 100% poster coverage.
 */

// Generate a fallback SVG cinema poster if no photo is available
export const generateFallbackPoster = (title, type, year, genre) => {
  const gradientColors = [
    ['#1e1b4b', '#312e81', '#4338ca'],
    ['#1e293b', '#0f172a', '#3b82f6'],
    ['#18181b', '#27272a', '#7c3aed'],
    ['#172554', '#1e3a8a', '#0284c7'],
    ['#052e16', '#064e3b', '#059669'],
  ];

  // Hash title to pick consistent gradient
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = gradientColors[hash % gradientColors.length];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors[0]}" />
          <stop offset="50%" stop-color="${colors[1]}" />
          <stop offset="100%" stop-color="${colors[2]}" />
        </linearGradient>
      </defs>
      <rect width="600" height="900" fill="url(#grad)" />
      <circle cx="300" cy="360" r="140" fill="white" opacity="0.06" />
      <path d="M260 300 L360 360 L260 420 Z" fill="white" opacity="0.3" />
      <text x="300" y="550" font-family="sans-serif" font-size="44" font-weight="bold" fill="white" text-anchor="middle">
        ${title.length > 20 ? title.substring(0, 20) + '...' : title}
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
};

/**
 * Universal search across Cinemeta (IMDb), iTunes, and TVMaze
 */
export const searchUniversalPosters = async (queryText, mediaType = 'ALL') => {
  if (!queryText || queryText.trim().length < 2) {
    return [];
  }

  const cleanQuery = queryText.trim();
  const results = [];
  const seenKeys = new Set();

  const addResult = (item) => {
    const key = `${item.title.toLowerCase()}_${item.year || ''}_${item.type}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      results.push(item);
    }
  };

  // Run searches in parallel
  const searchPromises = [];

  // 1. Cinemeta Movie Search (Official IMDb CDN posters)
  if (mediaType === 'Movie' || mediaType === 'ALL') {
    searchPromises.push(
      fetch(`https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURIComponent(cleanQuery)}.json`)
        .then((res) => (res.ok ? res.json() : { metas: [] }))
        .then((data) => {
          if (data && data.metas) {
            data.metas.forEach((meta) => {
              let poster = meta.poster || null;
              if (poster && poster.includes('media-amazon.com')) {
                // Upgrade to HD 1000px resolution
                poster = poster.replace(/_V1_.*\.jpg/, '_V1_FMjpg_UX800_.jpg');
              }
              addResult({
                id: `cinemeta-${meta.imdb_id || meta.id || Math.random()}`,
                title: meta.name,
                year: meta.year ? parseInt(meta.year, 10) : null,
                genre: meta.genres?.[0] || 'Movie',
                type: 'Movie',
                poster: poster,
                description: meta.description || '',
              });
            });
          }
        })
        .catch((e) => console.warn('Cinemeta movie search error:', e))
    );
  }

  // 2. Cinemeta Series Search (Official IMDb series posters)
  if (mediaType === 'TV' || mediaType === 'ALL') {
    searchPromises.push(
      fetch(`https://v3-cinemeta.strem.io/catalog/series/top/search=${encodeURIComponent(cleanQuery)}.json`)
        .then((res) => (res.ok ? res.json() : { metas: [] }))
        .then((data) => {
          if (data && data.metas) {
            data.metas.forEach((meta) => {
              let poster = meta.poster || null;
              if (poster && poster.includes('media-amazon.com')) {
                poster = poster.replace(/_V1_.*\.jpg/, '_V1_FMjpg_UX800_.jpg');
              }
              addResult({
                id: `cinemeta-tv-${meta.imdb_id || meta.id || Math.random()}`,
                title: meta.name,
                year: meta.year ? parseInt(meta.year, 10) : null,
                genre: meta.genres?.[0] || 'TV Show',
                type: 'TV',
                poster: poster,
                description: meta.description || '',
              });
            });
          }
        })
        .catch((e) => console.warn('Cinemeta series search error:', e))
    );
  }

  // 3. iTunes Movie & TV Search (Apple High-Res HD Posters)
  searchPromises.push(
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&media=movie&limit=8`)
      .then((res) => (res.ok ? res.json() : { results: [] }))
      .then((data) => {
        if (data && data.results) {
          data.results.forEach((item) => {
            const hdPoster = item.artworkUrl100
              ? item.artworkUrl100.replace('100x100bb.jpg', '800x1200bb.jpg')
              : null;
            addResult({
              id: `itunes-${item.trackId}`,
              title: item.trackName,
              year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : null,
              genre: item.primaryGenreName || 'Movie',
              type: 'Movie',
              poster: hdPoster,
              description: item.longDescription || '',
            });
          });
        }
      })
      .catch((e) => console.warn('iTunes movie search error:', e))
  );

  // 4. TVMaze API (TV Shows)
  searchPromises.push(
    fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(cleanQuery)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          data.forEach((entry) => {
            const show = entry.show;
            if (show) {
              addResult({
                id: `tvmaze-${show.id}`,
                title: show.name,
                year: show.premiered ? new Date(show.premiered).getFullYear() : null,
                genre: show.genres?.[0] || 'TV Show',
                type: 'TV',
                poster: show.image?.original || show.image?.medium || null,
                description: show.summary ? show.summary.replace(/<[^>]*>?/gm, '') : '',
              });
            }
          });
        }
      })
      .catch((e) => console.warn('TVMaze search error:', e))
  );

  await Promise.all(searchPromises);

  // Filter and prioritize items that have actual posters
  const withPoster = results.filter((r) => r.poster);
  const withoutPoster = results.filter((r) => !r.poster);

  // Sort by title relevance to query
  const queryLower = cleanQuery.toLowerCase();
  const sorted = [...withPoster, ...withoutPoster].sort((a, b) => {
    const aExact = a.title.toLowerCase() === queryLower;
    const bExact = b.title.toLowerCase() === queryLower;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aStarts = a.title.toLowerCase().startsWith(queryLower);
    const bStarts = b.title.toLowerCase().startsWith(queryLower);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return 0;
  });

  return sorted.slice(0, 18);
};
