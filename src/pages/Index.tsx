
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryList from '../components/CategoryList';
import RankingList from '../components/RankingList';
import SearchBar from '../components/SearchBar';
import { Gamepad, Wallet, Users, CreditCard, Image, ArrowLeft, Ticket, Trophy, Coins, Award } from 'lucide-react';
import { categories, getAppsByCategory, getTopApps, getMostDownloadedApps } from '../lib/data';

// Import the category page components
import GamesContent from './Games';
import FinanceContent from './Finance';
import SocialContent from './Social';
import UtilitiesContent from './Utilities';
import NFTContent from './NFT';

// Define game subcategories
const gameCategories = [
  {
    id: 'tap2earn',
    name: 'Tap to Earn (T2E)',
    description: 'Simple tap games that reward players with cryptocurrency',
    icon: Ticket,
    color: 'bg-amber-500'
  },
  {
    id: 'play2earn',
    name: 'Play to Earn (P2E)',
    description: 'More complex games with cryptocurrency rewards for skilled play',
    icon: Gamepad,
    color: 'bg-emerald-500'
  },
  {
    id: 'competitive',
    name: 'Competitive Games',
    description: 'Games that involve competition between players for rewards',
    icon: Trophy,
    color: 'bg-blue-500'
  },
  {
    id: 'strategy',
    name: 'Strategy Games',
    description: 'Strategic games involving planning and resource management',
    icon: Award,
    color: 'bg-purple-500'
  },
  {
    id: 'collectible',
    name: 'Collectible Games',
    description: 'Games focused on collecting digital items and NFTs',
    icon: Coins,
    color: 'bg-rose-500'
  }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [selectedGameCategory, setSelectedGameCategory] = useState<string | null>(null);
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

  // Handle category click for navigation
  const handleCategoryClick = (categoryId: string) => {
    setActivePage(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle game category click
  const handleGameCategoryClick = (categoryId: string) => {
    setSelectedGameCategory(categoryId);
    navigate(`/games?category=${categoryId}`);
  };

  // Return to main home view
  const handleReturnToMain = () => {
    setActivePage(null);
    setSelectedCategory('all');
    setSelectedGameCategory(null);
  };

  // Render the appropriate content based on activePage
  const renderCategoryContent = () => {
    switch (activePage) {
      case 'games':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                TON Games
              </h2>
              <button 
                onClick={handleReturnToMain}
                className="text-sm px-4 py-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
              >
                Back to rankings
              </button>
            </div>
            
            {/* Game categories section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 animate-stagger">
              {gameCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleGameCategoryClick(category.id)}
                  className="glass-card hover-scale rounded-xl overflow-hidden transition-all duration-300"
                >
                  <div className="p-6 flex items-center">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white mr-4`}>
                      <category.icon size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'finance':
        return <FinanceContent />;
      case 'social':
        return <SocialContent />;
      case 'utilities':
        return <UtilitiesContent />;
      case 'nft':
        return <NFTContent />;
      default:
        return (
          <div className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-2xl font-bold mb-6 text-center">TON App Rankings</h1>
            
            {/* Always display the search bar regardless of showSearch state */}
            <div className="max-w-xl mx-auto mb-8">
                <SearchBar fullWidth autoFocus={false} />
            </div>
            
            <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

            {/* Category Pages Section - removed as requested */}
          </div>
        );
    }
  };

  return <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="app-container max-w-3xl mx-auto pb-20">
        <div className="pt-8 pb-6">
          {activePage && (
            <button
              onClick={handleReturnToMain}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to rankings
            </button>
          )}
          
          {renderCategoryContent()}
          
          {!activePage && (
            <div className="mt-10">
              <RankingList title={selectedCategory === 'all' ? "Top Rated Apps" : `Top ${categories.find(c => c.id === selectedCategory)?.name || ''} Apps`} description={selectedCategory === 'all' ? "The highest rated TON integrated apps across all categories" : categories.find(c => c.id === selectedCategory)?.description} apps={appsToShow} />
              
              {selectedCategory === 'all' && <RankingList title="Most Popular Apps" description="The most downloaded TON integrated apps by users" apps={mostDownloadedApps} />}
            </div>
          )}
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
