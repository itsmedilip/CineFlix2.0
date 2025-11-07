import React from 'react';
import type { MediaItem, MediaType } from '../types';
import { getImageUrl } from '../services/tmdbService';

interface MovieCardProps {
  item: MediaItem;
  onSelectMedia: (id: number, type: MediaType) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, onSelectMedia }) => {
  const imageUrl = getImageUrl(item.poster_path, 'w500');
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

  return (
    <div 
        className="flex-shrink-0 w-40 md:w-48 group cursor-pointer"
        onClick={() => onSelectMedia(item.id, mediaType)}
    >
      <div className="aspect-[2/3] rounded-md overflow-hidden bg-gray-800 shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl">
        <img 
            src={imageUrl} 
            alt={item.title || item.name} 
            className="w-full h-full object-cover"
            loading="lazy"
        />
      </div>
    </div>
  );
};

export default MovieCard;