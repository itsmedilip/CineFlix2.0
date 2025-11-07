import React, { useState, useEffect } from 'react';
import { getMediaDetails, getImageUrl } from '../services/tmdbService';
import type { MediaDetails as MediaDetailsType, MediaType, MediaItem } from '../types';
import Spinner from './Spinner';
import StarRating from './StarRating';
import { PlayIcon } from './icons/PlayIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PersonIcon } from './icons/PersonIcon';
import MovieList from './MovieList';

interface MovieDetailsProps {
  mediaId: number;
  mediaType: MediaType;
  onBack: () => void;
  myList: MediaItem[];
  setMyList: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  onSelectMedia: (id: number, type: MediaType) => void;
  onPlay: (url: string) => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ mediaId, mediaType, onBack, myList, setMyList, onSelectMedia, onPlay }) => {
  const [details, setDetails] = useState<MediaDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setDetails(null);
      try {
        const detailsData = await getMediaDetails(mediaId, mediaType);
        setDetails(detailsData);
      } catch (error) {
        console.error('Failed to fetch media details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mediaId, mediaType]);
  
  const isInMyList = myList.some(item => item.id === mediaId);

  const toggleMyList = () => {
    if (!details) return;
    const mediaItemSummary: MediaItem = {
        id: details.id,
        title: details.title,
        name: details.name,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        vote_average: details.vote_average,
        overview: details.overview,
        media_type: mediaType,
        genre_ids: details.genres.map(g => g.id),
        release_date: details.release_date,
        first_air_date: details.first_air_date,
    };
    if (isInMyList) {
      setMyList(myList.filter(item => item.id !== mediaId));
    } else {
      setMyList([...myList, mediaItemSummary]);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  if (!details) {
    return <div className="text-center py-10">Failed to load details. <button onClick={onBack} className="text-brand-red">Go Back</button></div>;
  }

  const title = details.title || details.name;
  const runtime = details.runtime || (details.episode_run_time && details.episode_run_time[0]);
  const availableCast = details.credits.cast.filter(actor => actor.profile_path);
  const similarItems = details.recommendations?.results || [];

  const today = new Date().toISOString().split('T')[0];
  const releaseDate = details.release_date || details.first_air_date;
  const isReleased = releaseDate ? releaseDate <= today : true;
  
  const PlayerButton: React.FC<{ player: number; sourceUrl: string }> = ({ player, sourceUrl }) => (
    <button
      onClick={() => onPlay(sourceUrl)}
      className="flex items-center justify-center px-4 py-2 bg-brand-red text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors duration-200"
    >
      <PlayIcon className="h-5 w-5 mr-2" />
      Player {player}
    </button>
  );

  const player1Url = mediaType === 'tv'
    ? `https://vidsrc.to/embed/tv/${details.id}/1-1`
    : `https://vidsrc.to/embed/movie/${details.id}`;

  const player2Url = mediaType === 'tv'
    ? `https://multiembed.mov/?video_id=${details.id}&tmdb=1&s=1&e=1`
    : `https://multiembed.mov/?video_id=${details.id}&tmdb=1`;
  
  const player3Url = mediaType === 'tv'
    ? `https://moviesapi.club/tv/${details.id}-1-1`
    : `https://moviesapi.club/movie/${details.id}`;


  return (
    <div className="animate-fade-in">
      <div className="relative h-[40vh] md:h-[60vh] bg-cover bg-center">
         <img src={getImageUrl(details.backdrop_path, 'original')} alt={title} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
        <button onClick={onBack} aria-label="Go back" className="absolute top-20 left-4 sm:left-6 lg:left-8 text-white bg-black/50 rounded-full p-2 hover:bg-opacity-75 transition-colors z-10">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-48 relative pb-16">
        <div className="md:flex md:space-x-8">
          <div className="w-40 md:w-60 flex-shrink-0 mx-auto md:mx-0">
            <img src={getImageUrl(details.poster_path)} alt={title} className="rounded-lg shadow-2xl w-full" />
          </div>
          <div className="mt-6 md:mt-auto text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold font-display tracking-wide">{title}</h1>
            <div className="flex items-center justify-center md:justify-start space-x-4 mt-2 text-gray-400">
              <StarRating rating={details.vote_average} />
              <span>{details.vote_average.toFixed(1)} / 10</span>
              {runtime && <span>{runtime} min</span>}
            </div>
            <p className="mt-4 text-lg italic text-gray-300">{details.tagline}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              {details.genres.map(genre => (
                <span key={genre.id} className="bg-gray-700 text-xs font-semibold px-3 py-1 rounded-full">{genre.name}</span>
              ))}
            </div>
             <div className="mt-6 flex flex-col items-center md:items-start gap-4">
               {isReleased ? (
                <div className="flex items-center space-x-3">
                  <PlayerButton player={1} sourceUrl={player1Url} />
                  <PlayerButton player={2} sourceUrl={player2Url} />
                  <PlayerButton player={3} sourceUrl={player3Url} />
                </div>
               ) : (
                <div className="px-4 py-2 bg-gray-700 font-semibold rounded text-center">
                  Coming Soon<br/>
                  <span className="text-sm font-normal">{new Date(releaseDate!).toLocaleDateString()}</span>
                </div>
               )}
                <button onClick={toggleMyList} title={isInMyList ? 'Remove from My List' : 'Add to My List'} className="flex items-center justify-center px-4 py-2 bg-black/50 border border-white/50 text-white font-semibold rounded hover:bg-white/20 transition-colors duration-200">
                    {isInMyList ? <CheckIcon className="h-6 w-6 mr-2" /> : <PlusIcon className="h-6 w-6 mr-2" />}
                    My List
                </button>
              </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold font-display tracking-wide mb-4">Overview</h2>
          <p className="max-w-3xl text-gray-300 leading-relaxed">{details.overview}</p>
        </div>

        {availableCast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold font-display tracking-wide mb-4">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableCast.slice(0, 12).map(actor => (
                <div key={actor.id} className="text-center">
                  <div className="rounded-lg aspect-[2/3] bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img src={getImageUrl(actor.profile_path)} alt={actor.name} className="object-cover w-full h-full" />
                  </div>
                  <p className="mt-2 font-semibold">{actor.name}</p>
                  <p className="text-sm text-gray-400">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {similarItems.length > 0 && (
          <div className="mt-12">
            <MovieList title="You Might Also Like" items={similarItems} onSelectMedia={onSelectMedia} />
          </div>
        )}

      </div>
    </div>
  );
};

export default MovieDetails;