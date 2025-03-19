
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import SearchBar from './SearchBar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="font-semibold text-xl tracking-tight flex items-center gap-2 transition-all"
        >
          <span className="text-primary">TON</span>
          <span>RanKings</span>
        </Link>

        <div className="flex items-center space-x-4">
          {showSearch ? (
            <div className="animate-fade-in flex items-center">
              <SearchBar onFocus={() => {}} />
              <button
                onClick={() => setShowSearch(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
