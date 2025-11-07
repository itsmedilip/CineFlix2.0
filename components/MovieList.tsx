import React, { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import type { MediaItem, MediaType } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface MovieListProps {
  title: string;
  items: MediaItem[];
  onSelectMedia: (id: number, type: MediaType) => void;
}

const MovieList: React.FC<MovieListProps> = ({ title, items, onSelectMedia }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsScrolled(scrollLeft > 5);
        // Add a small buffer to account for fractional values
        setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        
        const resizeObserver = new ResizeObserver(handleScroll);
        resizeObserver.observe(container);

        return () => {
          container.removeEventListener('scroll', handleScroll);
          resizeObserver.unobserve(container);
        }
    }
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.offsetWidth * 0.9;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  if (!items || items.length === 0) {
    return (
      <div className="my-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 sm:px-0 font-display tracking-wide">{title}</h2>
        <p className="text-gray-400 px-4 sm:px-0">No items to display.</p>
      </div>
    );
  }
  
  return (
    <div className="my-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4 font-display tracking-wide">{title}</h2>
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className={`absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-brand-dark to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-brand-red disabled:opacity-0 disabled:cursor-not-allowed`}
          aria-label="Scroll left"
          disabled={!isScrolled}
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
        <div ref={scrollContainerRef} className="flex space-x-2 md:space-x-4 overflow-x-auto pb-4 scrollbar-hide -m-2 p-2">
          {items.map((item) => (
            <MovieCard key={`${item.id}-${item.media_type}`} item={item} onSelectMedia={onSelectMedia} />
          ))}
        </div>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-brand-dark to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-brand-red disabled:opacity-0 disabled:cursor-not-allowed"
          aria-label="Scroll right"
          disabled={isAtEnd}
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default MovieList;