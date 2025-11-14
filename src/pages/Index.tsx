
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CategoryList from '../components/CategoryList';
import RankingList from '../components/RankingList';
import SearchBar from '../components/SearchBar';
import { categories, getAppsByCategory, getTopApps, getTopRatedApps } from '../lib/data';

// Import the category page components
import GamesContent from './Games';
import FinanceContent from './Finance';
import UtilitiesContent from './Utilities';
import NFTContent from './NFT';
import ProjectsContent from './Projects';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  // Get apps based on selected category
  const appsToShow = selectedCategory === 'all' ? getTopApps(10) : getAppsByCategory(selectedCategory);

  // Get top rated apps
  const topRatedApps = getTopRatedApps(10);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Render content based on selected category
  const renderCategoryContent = () => {
    if (selectedCategory === 'all') {
      return (
        <div className="mt-6">
          <RankingList 
            title="Top Rated Apps"
            description="The highest rated TON integrated apps across all categories"
            apps={appsToShow} 
          />
        </div>
      );
    } else {
      switch (selectedCategory) {
        case 'games':
          return <GamesContent />;
        case 'finance':
          return <FinanceContent />;
        case 'utility':
          return <UtilitiesContent />;
        case 'nft':
          return <NFTContent />;
        case 'projects':
          return <ProjectsContent />;
        default:
          return (
            <div className="mt-6">
              <RankingList 
                title={`Top ${categories.find(c => c.id === selectedCategory)?.name || ''} Apps`}
                description={categories.find(c => c.id === selectedCategory)?.description}
                apps={appsToShow} 
              />
            </div>
          );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="app-container max-w-3xl mx-auto pt-20 pb-20">
        <div className="pt-4 pb-4">
          <div className="">
            {/* Always display the search bar */}
            <div className="max-w-xl mx-auto mb-6">
                <SearchBar fullWidth autoFocus={false} />
            </div>
            
            <CategoryList 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect} 
            />
          </div>
          
          {/* Dynamic content area - will change based on selected category */}
          <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {renderCategoryContent()}
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
