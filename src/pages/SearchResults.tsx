import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { searchApps } from '../lib/data';
import AppCard from '../components/AppCard';
import SearchBar from '../components/SearchBar';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const searchResults = searchApps(query);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="app-container py-8">
        <button
          onClick={handleBackClick}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to rankings
        </button>

        <div 
          className={`max-w-xl mx-auto mb-10 transform transition-all duration-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <SearchBar fullWidth autoFocus />
        </div>

        <div 
          className={`transform transition-all duration-700 delay-100 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <h1 className="text-2xl font-semibold mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-muted-foreground mb-8">
            Found {searchResults.length} {searchResults.length === 1 ? 'app' : 'apps'} matching your search
          </p>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((app, index) => (
                <AppCard 
                  key={app.id} 
                  app={app} 
                  delay={100 * index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-card rounded-2xl">
              <Search size={48} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No results found</h2>
              <p className="text-muted-foreground">
                Try searching with different keywords or browse categories
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
