
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryList from '../components/CategoryList';
import RankingList from '../components/RankingList';
import SearchBar from '../components/SearchBar';
import { Gamepad } from 'lucide-react';
import { categories, getAppsByCategory, getTopApps, getMostDownloadedApps } from '../lib/data';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  // Get apps based on selected category
  const appsToShow = selectedCategory === 'all' 
    ? getTopApps(10) 
    : getAppsByCategory(selectedCategory);

  // Get most downloaded apps
  const mostDownloadedApps = getMostDownloadedApps(10);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="app-container max-w-3xl mx-auto pb-20">
        <div className="pt-8 pb-6">
          <div className={`transform transition-all duration-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-2xl font-bold mb-6 text-center">TON App Rankings</h1>
            
            {!showSearch ? (
              <div className="max-w-xl mx-auto mb-8">
                <SearchBar 
                  fullWidth 
                  onFocus={() => setShowSearch(true)}
                />
              </div>
            ) : null}
            
            <CategoryList 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory} 
            />

            {/* Games Section Promo */}
            {selectedCategory === 'all' && (
              <div className="my-8 glass-card p-6 rounded-xl hover-scale cursor-pointer">
                <Link to="/games" className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Gamepad className="text-primary" size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Explore Game Categories</h3>
                      <p className="text-muted-foreground">Browse T2E, P2E, competitive games and more</p>
                    </div>
                  </div>
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                    View Games
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-10">
            <RankingList 
              title={selectedCategory === 'all' ? "Top Rated Apps" : `Top ${categories.find(c => c.id === selectedCategory)?.name || ''} Apps`}
              description={selectedCategory === 'all' 
                ? "The highest rated TON integrated apps across all categories" 
                : categories.find(c => c.id === selectedCategory)?.description}
              apps={appsToShow}
            />
            
            {selectedCategory === 'all' && (
              <RankingList 
                title="Most Popular Apps"
                description="The most downloaded TON integrated apps by users"
                apps={mostDownloadedApps}
              />
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t border-muted">
        <div className="app-container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TON RanKings. All rights reserved.</p>
          <p className="mt-2">A curated collection of the best TON-integrated mini apps on Telegram.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
