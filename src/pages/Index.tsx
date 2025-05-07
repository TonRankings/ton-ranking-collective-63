import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryList from '../components/CategoryList';
import RankingList from '../components/RankingList';
import SearchBar from '../components/SearchBar';
import { Gamepad, Wallet, Users, CreditCard, Image, ArrowLeft } from 'lucide-react';
import { categories, getAppsByCategory, getTopApps, getMostDownloadedApps } from '../lib/data';

// Import the category page components
import GamesContent from './Games';
import FinanceContent from './Finance';
import SocialContent from './Social';
import UtilitiesContent from './Utilities';
import NFTContent from './NFT';
const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  // Get apps based on selected category
  const appsToShow = selectedCategory === 'all' ? getTopApps(10) : getAppsByCategory(selectedCategory);

  // Get most downloaded apps
  const mostDownloadedApps = getMostDownloadedApps(10);

  // Category page links
  const categoryPages = [{
    id: 'games',
    name: 'Games',
    description: 'Play games with TON integration',
    icon: Gamepad,
    color: 'bg-primary/10',
    iconColor: 'text-primary',
    link: '/games'
  }, {
    id: 'finance',
    name: 'Finance',
    description: 'Financial applications with TON',
    icon: Wallet,
    color: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    link: '/finance'
  }, {
    id: 'social',
    name: 'Social',
    description: 'Connect with others using TON',
    icon: Users,
    color: 'bg-green-500/10',
    iconColor: 'text-green-500',
    link: '/social'
  }, {
    id: 'utilities',
    name: 'Utilities',
    description: 'Useful tools with TON integration',
    icon: CreditCard,
    color: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    link: '/utilities'
  }, {
    id: 'nft',
    name: 'NFT',
    description: 'Non-fungible token applications',
    icon: Image,
    color: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    link: '/nft'
  }];

  // Handle category click - now displays content instead of navigating
  const handleCategoryClick = (categoryId: string) => {
    setActivePage(categoryId);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Return to main home view
  const handleReturnToMain = () => {
    setActivePage(null);
    setSelectedCategory('all');
  };

  // Render the appropriate content based on activePage
  const renderCategoryContent = () => {
    switch (activePage) {
      case 'games':
        return <GamesContent />;
      case 'finance':
        return <FinanceContent />;
      case 'social':
        return <SocialContent />;
      case 'utilities':
        return <UtilitiesContent />;
      case 'nft':
        return <NFTContent />;
      default:
        return <div className="">
            {/* Title removed from here */}
            
            {/* Always display the search bar regardless of showSearch state */}
            <div className="max-w-xl mx-auto mb-8">
                <SearchBar fullWidth autoFocus={false} />
            </div>
            
            <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

            {/* Category Pages Section - removed as requested */}
          </div>;
    }
  };
  return <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="app-container max-w-3xl mx-auto pb-20">
        <div className="pt-8 pb-6">
          {activePage && <button onClick={handleReturnToMain} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to rankings
            </button>}
          
          {renderCategoryContent()}
          
          {!activePage && <div className="mt-10">
              <RankingList title={selectedCategory === 'all' ? "Top Rated Apps" : `Top ${categories.find(c => c.id === selectedCategory)?.name || ''} Apps`} description={selectedCategory === 'all' ? "The highest rated TON integrated apps across all categories" : categories.find(c => c.id === selectedCategory)?.description} apps={appsToShow} />
              
              {selectedCategory === 'all' && <RankingList title="Most Popular Apps" description="The most downloaded TON integrated apps by users" apps={mostDownloadedApps} />}
            </div>}
        </div>
      </main>
      
      <footer className="py-8 border-t border-muted">
        <div className="app-container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TON RanKings. All rights reserved.</p>
          <p className="mt-2">A curated collection of the best TON-integrated mini apps on Telegram.</p>
        </div>
      </footer>
    </div>;
};
export default Index;
