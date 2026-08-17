import React, { useState } from 'react';
import { Film, Tv, Check, Trash2, Star } from 'lucide-react';
import StarRating from './StarRating';
import { generateFallbackPoster } from '../api/posterService';

const MediaCard = ({
  item,
  onMarkAsWatched,
  onUpdateRating,
  onDelete,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isWatched = item.status === 'Watched';

  const handleMarkWatched = async () => {
    setIsUpdating(true);
    try {
      await onMarkAsWatched(item.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRatingChange = async (newRating) => {
    setIsUpdating(true);
    try {
      await onUpdateRating(item.id, newRating);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(item.id, item.title);
  };

  const posterSrc =
    item.poster_url && !imgError
      ? item.poster_url
      : generateFallbackPoster(item.title, item.type, item.year, item.genre);

  return (
    <div className={`media-card ${isWatched ? 'card-watched' : 'card-unwatched'}`}>
      {/* Poster Image */}
      <div className="poster-container">
        <img
          src={posterSrc}
          alt={`${item.title} Poster`}
          className="poster-image"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Badges on Poster */}
        <div className="poster-overlay-top">
          <span className={`media-badge badge-${item.type.toLowerCase()}`}>
            {item.type === 'Movie' ? 'Film' : 'TV'}
          </span>

          <button
            className="btn-icon-blur btn-delete"
            onClick={handleDelete}
            title={`Delete "${item.title}"`}
            aria-label="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Rating overlay if rated */}
        {isWatched && item.rating && (
          <div className="poster-rating-badge">
            <Star size={11} fill="currentColor" />
            <span>{item.rating}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="card-body">
        <div className="media-info-row">
          {item.year && <span className="media-year">{item.year}</span>}
          {item.genre && <span className="media-genre-pill">{item.genre}</span>}
        </div>

        <h3 className="media-title" title={item.title}>
          {item.title}
        </h3>
      </div>

      {/* Card Footer Actions */}
      <div className="card-footer">
        {isWatched ? (
          <div className="rating-section">
            <span className="rating-label">Rating:</span>
            <StarRating
              rating={item.rating || 0}
              onRate={handleRatingChange}
              interactive={true}
              size={17}
            />
          </div>
        ) : (
          <button
            className="btn btn-secondary btn-mark-watched"
            onClick={handleMarkWatched}
            disabled={isUpdating}
            title="Mark as watched"
          >
            <Check size={14} />
            <span>{isUpdating ? 'Updating...' : 'Mark as Watched'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
