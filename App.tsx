import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import MediaGridPage from './components/MediaGridPage';
import MediaGrid from './components/MediaGrid';
import Footer from './components/Footer';
import StaticPage from './components/StaticPage';
import Marquee from './components/Marquee';
import { TelegramIcon } from './components/icons/TelegramIcon';
import { 
  getTrendingByType, 
  getPopular, 
  getTopRated, 
  searchMedia, 
  getRecentReleases,
  getBollywoodMovies,
  getSciFiFantasyMovies,
  getFamilyAndAnimationMovies,
  getDocumentaryMovies,
  getActionMovies,
  getComedyMovies,
  getThrillerMovies,
  getHorrorMovies,
  getCrimeMovies,
  getMysteryMovies,
  getRomanceMovies,
  getDramaMovies,
  getDiscoverMovies,
} from './services/tmdbService';
import type { MediaItem, MediaType, TMDbResponse } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

export type View = 'home' | 'details' | 'myList' | 'search' | 'movies' | 'genres' | 'static';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [selectedMedia, setSelectedMedia] = useState<{ id: number; type: MediaType } | null>(null);
  const [staticPageKey, setStaticPageKey] = useState<string | null>(null);
  
  const [heroItems, setHeroItems] = useState<MediaItem[]>([]);
  const [movieLists, setMovieLists] = useState<Record<string, MediaItem[]>>({});

  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [myList, setMyList] = useLocalStorage<MediaItem[]>('cineflix-myList', []);

  const handlePlay = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const processUrl = useCallback(async () => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    if (!path.startsWith('/search')) {
      setSearchQuery('');
      setSearchResults([]);
    }

    const staticPageKeys = ['faq', 'about-us', 'contact-us', 'account', 'terms-of-service', 'privacy-policy', 'legal', 'cookie-policy', 'dmca'];
    const staticPageMatch = staticPageKeys.find(key => path === `/${key}`);
    if (staticPageMatch) {
      setView('static');
      setStaticPageKey(staticPageMatch);
      setSelectedMedia(null);
      return;
    }

    const movieMatch = path.match(/\/movie\/(\d+)/);
    if (movieMatch) {
      const id = parseInt(movieMatch[1], 10);
      setSelectedMedia({ id, type: 'movie' });
      setView('details');
      return;
    }

    const tvMatch = path.match(/\/tv\/(\d+)/);
    if (tvMatch) {
      const id = parseInt(tvMatch[1], 10);
      setSelectedMedia({ id, type: 'tv' });
      setView('details');
      return;
    }

    if (path.startsWith('/search')) {
      const query = searchParams.get('q') || '';
      setSearchQuery(query);
      setView('search');
      if (query) {
        setSearchResults(await searchMedia(query));
      } else {
        setSearchResults([]);
      }
      return;
    }

    let newView: View = 'home';
    switch (path) {
      case '/my-list':
        newView = 'myList';
        break;
      case '/movies':
        newView = 'movies';
        break;
      case '/genres':
        newView = 'genres';
        break;
    }

    setView(newView);
    setSelectedMedia(null);
    setStaticPageKey(null);
  }, []);

  useEffect(() => {
    processUrl();
    window.addEventListener('popstate', processUrl);
    return () => {
      window.removeEventListener('popstate', processUrl);
    };
  }, [processUrl]);


  const fetchInitialData = useCallback(async () => {
    try {
      const listsToFetch = {
        'Recent Movie Releases': getRecentReleases(),
        'Trending Movies': getTrendingByType('movie'),
        'Trending TV Shows': getTrendingByType('tv'),
        'Popular Movies': getPopular('movie'),
        'Popular TV Shows': getPopular('tv'),
        'Top Rated Movies': getTopRated('movie'),
        'Top Rated TV Shows': getTopRated('tv'),
        'Action Movies': getActionMovies(),
        'Comedy Movies': getComedyMovies(),
        'Horror Movies': getHorrorMovies(),
        'Thriller Movies': getThrillerMovies(),
        'Sci-fi & Fantasy Movies': getSciFiFantasyMovies(),
        'Documentaries': getDocumentaryMovies(),
        'Romance Movies': getRomanceMovies(),
        'Crime Movies': getCrimeMovies(),
        'Drama Movies': getDramaMovies(),
        'Mystery Movies': getMysteryMovies(),
        'Bollywood Movies': getBollywoodMovies(),
        'Family & Animation': getFamilyAndAnimationMovies(),
      };

      const listNames = Object.keys(listsToFetch);
      const promises = Object.values(listsToFetch);

      const responses = await Promise.all(promises.map(p => p.catch(e => ({ results: [] }))));
      
      const newMoviesLists: Record<string, MediaItem[]> = {};
      const seenIds = new Set<number>();

      responses.forEach((res, index) => {
        const listName = listNames[index];
        if (res && res.results) {
            const uniqueItems = res.results.filter(item => !seenIds.has(item.id));
            uniqueItems.forEach(item => seenIds.add(item.id));
            
            if (uniqueItems.length > 0) {
                newMoviesLists[listName] = uniqueItems;
            }
        }
      });
      
      setHeroItems((newMoviesLists['Recent Movie Releases'] || newMoviesLists['Trending Movies'] || []).slice(0, 7));
      setMovieLists(newMoviesLists);

    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  }, []);

  useEffect(() => {
    if (view === 'home') {
      fetchInitialData();
    }
  }, [view, fetchInitialData]);
  
  const handleSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    const currentPath = window.location.pathname;
    
    if (trimmedQuery) {
        const newPath = `/search?q=${encodeURIComponent(trimmedQuery)}`;
        if (window.location.pathname + window.location.search !== newPath) {
            window.history.pushState(null, '', newPath);
        }
    } else if (currentPath === '/search') {
        window.history.pushState(null, '', '/');
    }
    processUrl();
  }, [processUrl]);

  const handleSelectMedia = (id: number, type: MediaType) => {
    window.history.pushState(null, '', `/${type}/${id}`);
    processUrl();
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    window.history.back();
  };
  
  const navigate = (newView: View) => {
    let path = '/';
    if (newView === 'myList') path = '/my-list';
    else if (newView === 'movies') path = '/movies';
    else if (newView === 'genres') path = '/genres';
    
    if (window.location.pathname !== path || window.location.search) {
      window.history.pushState(null, '', path);
      processUrl();
    }
    window.scrollTo(0, 0);
  };

  const handleNavigateStatic = (key: string) => {
    const path = `/${key}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      processUrl();
    }
    window.scrollTo(0, 0);
  };

  const pageFetcher = useCallback((params: Record<string, any>, page: number): Promise<TMDbResponse<MediaItem>> => {
    if (params.sort_by === 'vote_average.desc' || params.sort_by === 'vote_average.asc') {
        params['vote_count.gte'] = 200;
    }
    return getDiscoverMovies(params, page);
  }, []);

  const genreTabs = [
    { key: '28', label: 'Action' },
    { key: '35', label: 'Comedy' },
    { key: '27', label: 'Horror' },
    { key: '53', label: 'Thriller' },
    { key: '878', label: 'Sci-Fi' },
    { key: '10749', label: 'Romance' },
    { key: '99', label: 'Documentary' },
    { key: '80', label: 'Crime' },
    { key: '18', label: 'Drama' },
  ];

  const renderContent = () => {
    if (view === 'details' && selectedMedia) {
      return (
        <MovieDetails 
          mediaId={selectedMedia.id} 
          mediaType={selectedMedia.type} 
          onBack={handleBack}
          myList={myList}
          setMyList={setMyList}
          onSelectMedia={handleSelectMedia}
          onPlay={handlePlay}
        />
      );
    }

    if (view === 'movies') {
      return <MediaGridPage title="All Movies" fetcher={pageFetcher} onSelectMedia={handleSelectMedia} />;
    }

    if (view === 'genres') {
      return <MediaGridPage title="Movies by Genre" tabs={genreTabs} fetcher={pageFetcher} onSelectMedia={handleSelectMedia} />;
    }

    if (view === 'myList') {
      const myMovieList = myList.filter(item => item.media_type === 'movie');
      const myTvList = myList.filter(item => item.media_type === 'tv');
      return (
        <div className="p-4 md:p-8 pt-24 space-y-8 min-h-[60vh]">
          {myMovieList.length > 0 && <MediaGrid title="My Movie List" items={myMovieList} onSelectMedia={handleSelectMedia} />}
          {myTvList.length > 0 && <MediaGrid title="My TV Show List" items={myTvList} onSelectMedia={handleSelectMedia} />}
          {myList.length === 0 && <p className="text-center text-gray-400">Your list is empty. Add movies and TV shows to see them here.</p>}
        </div>
      );
    }
    
    if (view === 'search') {
      return <div className="p-4 md:p-8 pt-24"><MediaGrid title={`Results for "${searchQuery}"`} items={searchResults} onSelectMedia={handleSelectMedia} /></div>;
    }

    if (view === 'static' && staticPageKey) {
      return <StaticPage pageKey={staticPageKey} />;
    }
    
    // Home view
    return (
      <>
        {heroItems.length > 0 && (
          <Hero 
            items={heroItems} 
            onSelectMedia={handleSelectMedia} 
            myList={myList}
            setMyList={setMyList}
            onPlay={handlePlay}
          />
        )}
        <div className="p-4 md:p-8 space-y-8 -mt-16 md:-mt-24 lg:-mt-32 relative z-10">
          <div className="-mx-4 md:-mx-8 mb-8">
            <Marquee 
              text="Join us on Telegram for Latest Movies..."
              link="https://t.me/CineflixMoviesOfficial"
              icon={<TelegramIcon />}
            />
          </div>
          {Object.entries(movieLists).map(([title, items]) => (
            <MovieList key={title} title={title} items={items} onSelectMedia={handleSelectMedia} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="bg-brand-dark min-h-screen text-white flex flex-col">
      <Header onSearch={handleSearch} onNavigate={navigate} currentView={view} searchQuery={searchQuery} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer onNavigateStatic={handleNavigateStatic} />
    </div>
  );
};

export default App;
