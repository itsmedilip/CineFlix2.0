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
  
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [movieLists, setMovieLists] = useState<Record<string, MediaItem[]>>({});

  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [myList, setMyList] = useLocalStorage<MediaItem[]>('cineflix-myList', []);

  const handlePlay = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const fetchInitialData = useCallback(async () => {
    try {
      const listsToFetch = {
        'Recent Releases': getRecentReleases(),
        'Trending Movies': getTrendingByType('movie'),
        'Popular Movies': getPopular('movie'),
        'Top Rated Movies': getTopRated('movie'),
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
      const seenMovieIds = new Set<number>();

      responses.forEach((res, index) => {
        const listName = listNames[index];
        if (res && res.results) {
            // Filter out movies we've already seen in previous lists
            const uniqueItems = res.results.filter(item => !seenMovieIds.has(item.id));
            
            // Add the new unique movie IDs to our set
            uniqueItems.forEach(item => seenMovieIds.add(item.id));
            
            // Only add the list if it has unique items
            if (uniqueItems.length > 0) {
                newMoviesLists[listName] = uniqueItems;
            }
        }
      });
      
      setTrending(newMoviesLists['Trending Movies'] || []);
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
  
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setView(currentView => currentView === 'search' ? 'home' : currentView);
      return;
    }
    setView('search');
    const response = await searchMedia(query);
    setSearchResults(response.results);
  }, []);

  const handleSelectMedia = (id: number, type: MediaType) => {
    setSelectedMedia({ id, type });
    setView('details');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    const previousView = view === 'details' 
      ? (searchQuery ? 'search' : (sessionStorage.getItem('lastView') as View || 'home'))
      : 'home';
    setSelectedMedia(null);
    setView(previousView);
  };
  
  const navigate = (newView: View) => {
    sessionStorage.setItem('lastView', view);
    setView(newView);
    setSelectedMedia(null);
    setStaticPageKey(null);
    window.scrollTo(0, 0);
    if (newView !== 'search') {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleNavigateStatic = (key: string) => {
    sessionStorage.setItem('lastView', view);
    setView('static');
    setStaticPageKey(key);
    window.scrollTo(0, 0);
  };

  const heroItem = trending.length > 0 ? trending[0] : null;

  const pageFetcher = useCallback((params: Record<string, any>, page: number): Promise<TMDbResponse<MediaItem>> => {
    // Add vote_count minimum for rating sort to get better quality results
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
      const myMovieList = myList.filter(item => item.media_type === 'movie' || !item.media_type);
      return <div className="p-4 md:p-8 pt-24"><MediaGrid title="My Movie List" items={myMovieList} onSelectMedia={handleSelectMedia} /></div>;
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
        {heroItem && (
          <Hero 
            item={heroItem} 
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
      <Header onSearch={handleSearch} onNavigate={navigate} currentView={view} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer onNavigateStatic={handleNavigateStatic} />
    </div>
  );
};

export default App;
