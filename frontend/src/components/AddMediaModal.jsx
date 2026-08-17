import React, { useState, useEffect } from 'react';
import {
  X,
  Film,
  Tv,
  Eye,
  Clock,
  AlertCircle,
  Search,
  Image as ImageIcon,
  Check,
  Loader2
} from 'lucide-react';
import StarRating from './StarRating';
import { searchUniversalPosters, generateFallbackPoster } from '../api/posterService';

const AddMediaModal = ({ isOpen, onClose, onAddMedia }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Movie'); // 'Movie' or 'TV'
  const [status, setStatus] = useState('Unwatched'); // 'Unwatched' or 'Watched'
  const [rating, setRating] = useState(5);
  const [posterUrl, setPosterUrl] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search results state
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setType('Movie');
      setStatus('Unwatched');
      setRating(5);
      setPosterUrl('');
      setYear('');
      setGenre('');
      setError('');
      setSearchResults([]);
      setSelectedResultId(null);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!title.trim() || title.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchUniversalPosters(title, type);
        setSearchResults(results);
      } catch (err) {
        console.error('Poster search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [title, type]);

  if (!isOpen) return null;

  const handleSelectResult = (item) => {
    setSelectedResultId(item.id);
    setTitle(item.title);
    if (item.poster) {
      setPosterUrl(item.poster);
    } else {
      setPosterUrl(generateFallbackPoster(item.title, item.type, item.year, item.genre));
    }
    if (item.year) setYear(item.year);
    if (item.genre) setGenre(item.genre);
    if (item.type) setType(item.type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let finalPoster = posterUrl.trim();
      if (!finalPoster) {
        if (searchResults.length > 0 && searchResults[0].poster) {
          finalPoster = searchResults[0].poster;
        } else {
          finalPoster = generateFallbackPoster(title.trim(), type, year, genre);
        }
      }

      const payload = {
        title: title.trim(),
        type,
        status,
        poster_url: finalPoster || null,
        year: year ? parseInt(year, 10) : null,
        genre: genre.trim() || null,
        ...(status === 'Watched' ? { rating } : { rating: null }),
      };

      await onAddMedia(payload);
      onClose();
    } catch (err) {
      const apiError =
        err.response?.data?.title?.[0] ||
        err.response?.data?.rating?.[0] ||
        err.response?.data?.detail ||
        'Failed to save title. Please try again.';
      setError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-header-title">
            <Film size={18} className="modal-header-icon" />
            <h2 id="modal-title">Add to Watchlist</h2>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="alert-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Search Field */}
          <div className="search-step-section">
            <div className="form-group">
              <label htmlFor="search-title-input" className="form-label">
                <span>Title</span>
                {isSearching && (
                  <span className="searching-indicator">
                    <Loader2 size={12} className="spin-icon" />
                    <span>Searching posters...</span>
                  </span>
                )}
              </label>

              <div className="search-input-wrapper">
                <Search size={16} className="search-field-icon" />
                <input
                  id="search-title-input"
                  type="text"
                  className="form-input search-hero-input"
                  placeholder="Search by title (e.g. Inception, Breaking Bad, Dune...)"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSelectedResultId(null);
                  }}
                  autoFocus
                  required
                />
                {title && (
                  <button
                    type="button"
                    className="btn-clear-search"
                    onClick={() => {
                      setTitle('');
                      setSearchResults([]);
                      setSelectedResultId(null);
                      setPosterUrl('');
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Poster Gallery */}
            {searchResults.length > 0 && (
              <div className="poster-gallery-container">
                <div className="poster-gallery-header">
                  <span>Suggestions:</span>
                  <span className="results-count">{searchResults.length} posters</span>
                </div>
                <div className="poster-gallery-grid">
                  {searchResults.map((item) => {
                    const isSelected = selectedResultId === item.id || posterUrl === item.poster;
                    const posterSrc =
                      item.poster ||
                      generateFallbackPoster(item.title, item.type, item.year, item.genre);

                    return (
                      <div
                        key={item.id}
                        className={`poster-gallery-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectResult(item)}
                      >
                        <div className="gallery-poster-box">
                          <img
                            src={posterSrc}
                            alt={item.title}
                            className="gallery-poster-img"
                            loading="lazy"
                          />

                          {isSelected && (
                            <div className="gallery-selected-overlay">
                              <Check size={18} className="check-badge" />
                            </div>
                          )}
                        </div>

                        <div className="gallery-card-info">
                          <span className="gallery-card-title">{item.title}</span>
                          <span className="gallery-card-meta">
                            {item.year || item.type} • {item.genre}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="modal-columns">
            {/* Poster Preview */}
            <div className="poster-preview-panel">
              <label className="form-label">Poster</label>
              {posterUrl ? (
                <div className="poster-preview-box">
                  <img
                    src={posterUrl}
                    alt="Poster preview"
                    className="poster-preview-img"
                    onError={() => {
                      setPosterUrl(generateFallbackPoster(title, type, year, genre));
                    }}
                  />
                  <button
                    type="button"
                    className="btn-remove-poster"
                    onClick={() => {
                      setPosterUrl('');
                      setSelectedResultId(null);
                    }}
                    title="Remove poster"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="poster-preview-empty">
                  <ImageIcon size={28} />
                  <span>No Poster</span>
                  <small>Auto-selected from search</small>
                </div>
              )}
            </div>

            {/* Customization Controls */}
            <div className="form-fields-container">
              {/* Type Toggle */}
              <div className="form-group">
                <label className="form-label">
                  <span>Type</span>
                  <span className="current-selection-badge">{type === 'Movie' ? 'Movie' : 'TV Show'}</span>
                </label>
                <div className="type-toggle-grid">
                  <button
                    type="button"
                    className={`type-card-btn ${type === 'Movie' ? 'active' : ''}`}
                    onClick={() => setType('Movie')}
                  >
                    <Film size={16} />
                    <span>Movie</span>
                    {type === 'Movie' && <Check size={14} className="active-check" />}
                  </button>

                  <button
                    type="button"
                    className={`type-card-btn ${type === 'TV' ? 'active' : ''}`}
                    onClick={() => setType('TV')}
                  >
                    <Tv size={16} />
                    <span>TV Show</span>
                    {type === 'TV' && <Check size={14} className="active-check" />}
                  </button>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="form-group">
                <label className="form-label">
                  <span>Status</span>
                  <span className="current-selection-badge">
                    {status === 'Unwatched' ? 'To Watch' : 'Watched'}
                  </span>
                </label>
                <div className="type-toggle-grid">
                  <button
                    type="button"
                    className={`status-card-btn ${status === 'Unwatched' ? 'active' : ''}`}
                    onClick={() => setStatus('Unwatched')}
                  >
                    <Clock size={16} />
                    <span>To Watch</span>
                    {status === 'Unwatched' && <Check size={14} className="active-check" />}
                  </button>

                  <button
                    type="button"
                    className={`status-card-btn ${status === 'Watched' ? 'active' : ''}`}
                    onClick={() => setStatus('Watched')}
                  >
                    <Eye size={16} />
                    <span>Watched</span>
                    {status === 'Watched' && <Check size={14} className="active-check" />}
                  </button>
                </div>
              </div>

              {/* Rating if Watched */}
              {status === 'Watched' && (
                <div className="form-group rating-form-group">
                  <label className="form-label">
                    <span>Rating</span>
                    <span className="rating-score-pill">{rating} / 5</span>
                  </label>
                  <div className="modal-rating-picker">
                    <StarRating
                      rating={rating}
                      onRate={(val) => setRating(val)}
                      interactive={true}
                      size={22}
                    />
                  </div>
                </div>
              )}

              {/* Year & Genre */}
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="media-year-input" className="form-label">Year</label>
                  <input
                    id="media-year-input"
                    type="number"
                    min="1900"
                    max="2099"
                    className="form-input"
                    placeholder="e.g. 2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="media-genre-input" className="form-label">Genre</label>
                  <input
                    id="media-genre-input"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sci-Fi, Drama"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                </div>
              </div>

              {/* Custom Poster URL */}
              <div className="form-group">
                <label htmlFor="custom-poster-input" className="form-label">Poster URL (Optional)</label>
                <input
                  id="custom-poster-input"
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={posterUrl}
                  onChange={(e) => {
                    setPosterUrl(e.target.value);
                    setSelectedResultId(null);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Add to Watchlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMediaModal;
