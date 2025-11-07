import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { MediaItem, MediaType, TMDbResponse } from '../types';
import MovieCard from './MovieCard';
import Spinner from './Spinner';

interface MediaGridPageProps {
  title: string;
  tabs?: { key: string; label: string }[];
  fetcher: (params: Record<string, any>, page: number) => Promise<TMDbResponse<MediaItem>>;
  onSelectMedia: (id: number, type: MediaType) => void;
}

const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity Descending' },
    { value: 'popularity.asc', label: 'Popularity Ascending' },
    { value: 'vote_average.desc', label: 'Rating Descending' },
    { value: 'vote_average.asc', label: 'Rating Ascending' },
    { value: 'primary_release_date.desc', label: 'Release Date Descending' },
    { value: 'primary_release_date.asc', label: 'Release Date Ascending' },
];

const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1950; year--) {
        years.push(year);
    }
    return years;
};


const MediaGridPage: React.FC<MediaGridPageProps> = ({ title, tabs, fetcher, onSelectMedia }) => {
  const [activeTab, setActiveTab] = useState(tabs ? tabs[0].key : '');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [year, setYear] = useState('');
  const yearOptions = generateYearOptions();

  const observer = useRef<IntersectionObserver>();
  
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);


  useEffect(() => {
    // Reset state when tab or filter changes
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [activeTab, sortBy, year]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = { sort_by: sortBy };
        if (year) params.primary_release_year = year;
        if (tabs) params.with_genres = activeTab;

        const data = await fetcher(params, page);
        if (isMounted) {
          setItems(prevItems => (page === 1 ? data.results : [...prevItems, ...data.results]));
          setHasMore(data.page < data.total_pages);
        }
      } catch (error) {
        console.error(`Failed to fetch data:`, error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [activeTab, sortBy, year, page, fetcher, tabs]);

  const FilterSelect: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode}> = ({label, value, onChange, children}) => (
    <div>
        <label htmlFor={label} className="sr-only">{label}</label>
        <select
            id={label}
            value={value}
            onChange={onChange}
            className="bg-brand-darker border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-brand-red focus:border-brand-red block w-full p-2.5"
        >
            {children}
        </select>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-display tracking-wide mb-4 sm:mb-0">{title}</h1>
        {tabs && (
            <div className="flex items-center space-x-2 sm:space-x-4 border-b-2 border-gray-700">
            {tabs.map(tab => (
                <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none ${
                    activeTab === tab.key
                    ? 'border-b-2 border-brand-red text-white'
                    : 'border-b-2 border-transparent text-gray-400 hover:text-white'
                }`}
                >
                {tab.label}
                </button>
            ))}
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <FilterSelect label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
             {sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </FilterSelect>
        <FilterSelect label="Year" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All Years</option>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </FilterSelect>
        <button onClick={() => { setSortBy('popularity.desc'); setYear(''); }} className="bg-brand-red text-white font-semibold rounded-lg p-2.5 hover:bg-red-700 transition-colors duration-200 h-full">
            Reset
        </button>
      </div>
      
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {items.map((item, index) => {
            if (items.length === index + 1) {
              return <div ref={lastElementRef} key={`${item.id}-${index}`}><MovieCard item={item} onSelectMedia={onSelectMedia} /></div>
            } else {
              return <MovieCard key={`${item.id}-${index}`} item={item} onSelectMedia={onSelectMedia} />
            }
          })}
        </div>
      
      {loading && (
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      )}

      {!loading && !hasMore && items.length > 0 && (
         <p className="text-center text-gray-400 mt-8">You've reached the end.</p>
      )}

      {!loading && items.length === 0 && (
        <p className="text-center text-gray-400 mt-8">No items found for the selected filters.</p>
      )}
    </div>
  );
};

export default MediaGridPage;