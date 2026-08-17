import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRate, interactive = true, size = 18 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const currentScore = hoverRating || rating || 0;

  const handleClick = (value) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div
      className={`star-rating ${interactive ? 'interactive' : 'readonly'}`}
      onMouseLeave={() => interactive && setHoverRating(0)}
      role="group"
      aria-label="Rating out of 5 stars"
    >
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= currentScore;
        const isHovered = interactive && starValue <= hoverRating;

        return (
          <button
            key={starValue}
            type="button"
            className={`star-btn ${isFilled ? 'filled' : 'empty'} ${isHovered ? 'hovered' : ''}`}
            disabled={!interactive}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            title={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            aria-label={`${starValue} Star`}
          >
            <Star
              size={size}
              className="star-icon"
              fill={isFilled ? 'currentColor' : 'none'}
            />
          </button>
        );
      })}
      {rating > 0 && <span className="rating-score-text">{rating}/5</span>}
    </div>
  );
};

export default StarRating;
