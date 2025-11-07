export type MediaType = 'movie' | 'tv';

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  media_type?: MediaType;
  genre_ids: number[];
  release_date?: string; // YYYY-MM-DD
  first_air_date?: string; // YYYY-MM-DD
}

export interface TMDbResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MediaDetails extends MediaItem {
  genres: Genre[];
  runtime?: number; // for movies
  episode_run_time?: number[]; // for tv shows
  tagline: string;
  credits: {
    cast: CastMember[];
  };
  videos: {
    results: Video[];
  };
  release_date?: string;
  first_air_date?: string;
  recommendations?: TMDbResponse<MediaItem>;
  similar?: TMDbResponse<MediaItem>;
}