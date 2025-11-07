
import type { TMDbResponse, MediaItem, MediaDetails, MediaType } from '../types';

// IMPORTANT: This is a public demo key from a tutorial. For a real application,
// it is highly recommended to get your own free key from https://www.themoviedb.org/signup
const API_KEY = '8baba8ab6b8bbe247645bcae7df63d0d';
const API_BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromTMDB = async <T,>(endpoint: string): Promise<T> => {
  const url = `${API_BASE_URL}/${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDb API request failed: ${response.statusText}`);
  }
  return response.json();
};

const mapResultToMediaItem = (result: any, mediaType?: MediaType): MediaItem => {
    const determinedType = mediaType || result.media_type || (result.title ? 'movie' : 'tv');
    return {
        id: result.id,
        title: result.title,
        name: result.name,
        poster_path: result.poster_path,
        backdrop_path: result.backdrop_path,
        vote_average: result.vote_average,
        overview: result.overview,
        media_type: determinedType,
        genre_ids: result.genre_ids || [],
        release_date: result.release_date,
        first_air_date: result.first_air_date,
    };
};

const processResponse = (data: TMDbResponse<any>, type?: MediaType): TMDbResponse<MediaItem> => ({
    ...data,
    results: data.results
        .filter(item => {
          const itemMediaType = item.media_type || type;
          return (itemMediaType === 'movie' || itemMediaType === 'tv') && item.poster_path && item.id && item.vote_average > 0;
        })
        .map(item => mapResultToMediaItem(item, type))
});

export const getTrending = async (page: number = 1): Promise<TMDbResponse<MediaItem>> => {
  const data = await fetchFromTMDB<TMDbResponse<any>>(`trending/all/week?page=${page}`);
  return processResponse(data);
};

export const getTrendingByType = async (type: MediaType, page: number = 1): Promise<TMDbResponse<MediaItem>> => {
  const data = await fetchFromTMDB<TMDbResponse<any>>(`trending/${type}/week?page=${page}`);
  return processResponse(data, type);
};

export const getPopular = async (type: MediaType, page: number = 1): Promise<TMDbResponse<MediaItem>> => {
  const data = await fetchFromTMDB<TMDbResponse<any>>(`${type}/popular?page=${page}`);
  return processResponse(data, type);
};

export const getTopRated = async (type: MediaType, page: number = 1): Promise<TMDbResponse<MediaItem>> => {
  const data = await fetchFromTMDB<TMDbResponse<any>>(`${type}/top_rated?page=${page}`);
  return processResponse(data, type);
};

export const getDiscoverMovies = async (params: Record<string, string | number>, page: number = 1): Promise<TMDbResponse<MediaItem>> => {
  const today = new Date().toISOString().split('T')[0];
  const defaultParams: Record<string, string> = {
    page: String(page),
    sort_by: 'popularity.desc',
    'primary_release_date.lte': today,
  };
  const query = new URLSearchParams(defaultParams);
  
  Object.entries(params).forEach(([key, value]) => {
    query.set(key, String(value));
  });

  const data = await fetchFromTMDB<TMDbResponse<any>>(`discover/movie?${query.toString()}`);
  return processResponse(data, 'movie');
};

export const getRecentReleases = (page = 1) => {
    const today = new Date().toISOString().split('T')[0];
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];
    
    const params = {
        'primary_release_date.gte': oneMonthAgoStr,
        'primary_release_date.lte': today,
        sort_by: 'popularity.desc',
    };

    return getDiscoverMovies(params, page);
};
export const getBollywoodMovies = (page = 1) => getDiscoverMovies({ with_origin_country: 'IN' }, page);
export const getSciFiFantasyMovies = (page = 1) => getDiscoverMovies({ with_genres: '878,14' }, page);
export const getFamilyAndAnimationMovies = (page = 1) => getDiscoverMovies({ with_genres: '16,10751' }, page);
export const getDocumentaryMovies = (page = 1) => getDiscoverMovies({ with_genres: '99' }, page);
export const getActionMovies = (page = 1) => getDiscoverMovies({ with_genres: '28' }, page);
export const getComedyMovies = (page = 1) => getDiscoverMovies({ with_genres: '35' }, page);
export const getThrillerMovies = (page = 1) => getDiscoverMovies({ with_genres: '53' }, page);
export const getHorrorMovies = (page = 1) => getDiscoverMovies({ with_genres: '27' }, page);
export const getCrimeMovies = (page = 1) => getDiscoverMovies({ with_genres: '80' }, page);
export const getMysteryMovies = (page = 1) => getDiscoverMovies({ with_genres: '9648' }, page);
export const getRomanceMovies = (page = 1) => getDiscoverMovies({ with_genres: '10749' }, page);
export const getDramaMovies = (page = 1) => getDiscoverMovies({ with_genres: '18' }, page);

export const searchMedia = async (query: string, page: number = 1): Promise<TMDbResponse<MediaItem>> => {
  const data = await fetchFromTMDB<TMDbResponse<any>>(`search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  return processResponse(data, 'movie');
};

export const getMediaDetails = async (id: number, type: MediaType): Promise<MediaDetails> => {
  const details = await fetchFromTMDB<any>(`${type}/${id}?append_to_response=videos,credits,recommendations,similar`);
  
  const processedRecommendations = details.recommendations ? processResponse(details.recommendations, type) : null;
  
  if (processedRecommendations && processedRecommendations.results.length > 0) {
      details.recommendations = processedRecommendations;
  } else if (details.similar) {
      details.recommendations = processResponse(details.similar, type);
  }
  
  delete details.similar;

  return details as MediaDetails;
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://via.placeholder.com/500x750.png?text=No+Image';
};