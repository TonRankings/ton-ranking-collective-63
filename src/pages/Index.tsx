
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryList from '../components/CategoryList';
import RankingList from '../components/RankingList';
import SearchBar from '../components/SearchBar';
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
    ? getTopApps(6) 
    : getAppsByCategory(selectedCategory);

  // Get most downloaded apps
  const mostDownloadedApps = getMostDownloadedApps(6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <main className="app-container pb-20">
        <div className="pt-24 pb-6">
          <div className={`transform transition-all duration-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="section-heading mb-8 text-center">Explore TON App Rankings</h2>
            
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
