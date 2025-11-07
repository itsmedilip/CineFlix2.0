
import React from 'react';
import type { MediaItem, MediaType } from '../types';
import MovieCard from './MovieCard';

interface MediaGridProps {
  title: string;
  items: MediaItem[];
  onSelectMedia: (id: number, type: MediaType) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ title, items, onSelectMedia }) => {
  if (!items) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
       <h1 className="text-2xl md:text-3xl font-bold font-display tracking-wide mb-6">{title}</h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {items.map(item => (
            <MovieCard key={`${item.id}-${item.media_type}`} item={item} onSelectMedia={onSelectMedia} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No items to display.</p>
      )}
    </div>
  );
};

export default MediaGrid;
