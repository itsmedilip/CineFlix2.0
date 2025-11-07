import React from 'react';
import type { MediaItem, MediaType } from '../types';
import { getImageUrl } from '../services/tmdbService';
import { PlayIcon } from './icons/PlayIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';

interface HeroProps {
  item: MediaItem;
  onSelectMedia: (id: number, type: MediaType) => void;
  myList: MediaItem[];
  setMyList: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  onPlay: (url: string) => void;
}

const Hero: React.FC<HeroProps> = ({ item, onSelectMedia, myList, setMyList, onPlay }) => {
  const backdropUrl = getImageUrl(item.backdrop_path, 'original');
  const title = item.title || item.name;
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  
  const isInMyList = myList.some(i => i.id === item.id);

  const toggleMyList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInMyList) {
      setMyList(myList.filter(i => i.id !== item.id));
    } else {
      setMyList([...myList, item]);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const releaseDate = item.release_date || item.first_air_date;
  const isReleased = releaseDate ? releaseDate <= today : true;
  const watchUrl = mediaType === 'tv'
    ? `https://vidsrc.to/embed/tv/${item.id}/1-1`
    : `https://vidsrc.to/embed/movie/${item.id}`;


  return (
    <div className="relative h-[56.25vw] min-h-[400px] max-h-[800px] text-white">
      <div className="absolute top-0 left-0 w-full h-full">
        <img src={backdropUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/20 to-transparent"></div>
      </div>
      <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full md:w-1/2 lg:w-2/5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg text-white font-display tracking-wide">
            {title}
          </h1>
          <p className="mt-4 text-sm sm:text-base max-w-prose line-clamp-3 drop-shadow-md text-gray-200">
            {item.overview}
          </p>
          <div className="mt-6 flex items-center space-x-4">
            {isReleased ? (
              <button
                onClick={() => onPlay(watchUrl)}
                className="flex items-center justify-center pl-5 pr-6 py-2 bg-brand-red text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200"
              >
                <PlayIcon className="h-8 w-8 mr-1" />
                Watch Now
              </button>
            ) : (
               <div className="px-6 py-2 bg-black/50 text-white font-semibold rounded">
                Coming Soon: {new Date(releaseDate!).toLocaleDateString()}
              </div>
            )}
            <button
              onClick={toggleMyList}
              title={isInMyList ? 'Remove from My List' : 'Add to My List'}
              className="flex items-center justify-center px-4 py-2 bg-black/50 border border-white/50 text-white font-semibold rounded hover:bg-white/20 transition-colors duration-200"
            >
              {isInMyList ? <CheckIcon className="h-6 w-6 mr-2" /> : <PlusIcon className="h-6 w-6 mr-2" />}
              My List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;