import React, { useState, useEffect } from 'react';
import { CineflixLogo } from './icons/CineflixLogo';
import { SearchIcon } from './icons/SearchIcon';
import { CloseIcon } from './icons/CloseIcon';
import type { View } from '../App';


interface HeaderProps {
  onSearch: (query: string) => void;
  onNavigate: (view: View) => void;
  currentView: string;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onNavigate, currentView, searchQuery }) => {
  const [query, setQuery] = useState(searchQuery);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    const timerId = setTimeout(() => {
      // Only call onSearch if the query has actually changed from the prop
      if (query !== searchQuery) {
        onSearch(query);
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(timerId);
    };
  }, [query, searchQuery, onSearch]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setQuery('');
    onSearch('');
  }

  const NavButton: React.FC<{view: View, children: React.ReactNode}> = ({ view, children }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => onNavigate(view)}
        className={`text-sm font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
      >
        {children}
      </button>
    );
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent bg-gradient-to-b from-black/70 to-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="flex-shrink-0">
               <CineflixLogo className="h-8 w-auto" />
            </button>
            <nav className="hidden md:flex items-center space-x-4">
                <NavButton view="home">Home</NavButton>
                <NavButton view="genres">Genres</NavButton>
                <NavButton view="movies">Movies</NavButton>
                <NavButton view="myList">My List</NavButton>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-xs">
               <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Search titles..."
                  className="w-full pl-10 pr-10 py-2 text-sm bg-brand-dark/70 border border-gray-600/50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-transparent"
                />
                {query && (
                  <button onClick={clearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CloseIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;