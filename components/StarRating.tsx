import React from 'react';

interface StarRatingProps {
  rating: number; // Rating out of 10
}

const Star: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-600'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.176 0l-3.368 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.25 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
  </svg>
);

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];
  const filledStars = Math.round(rating / 2); // Convert 10-point rating to 5 stars

  for (let i = 1; i <= 5; i++) {
    stars.push(<Star key={i} filled={i <= filledStars} />);
  }

  return <div className="flex items-center">{stars}</div>;
};

export default StarRating;