
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryList from '../components/CategoryList';
import RankingList from '../components/RankingList';
import SearchBar from '../components/SearchBar';
import { Gamepad, Wallet, Users, CreditCard, Nft } from 'lucide-react';
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

  // Category page links
  const categoryPages = [
    {
      id: 'games',
      name: 'Games',
      description: 'Play games with TON integration',
      icon: Gamepad,
      color: 'bg-primary/10',
      iconColor: 'text-primary',
      link: '/games'
    },
    {
      id: 'finance',
      name: 'Finance',
      description: 'Financial applications with TON',
      icon: Wallet,
      color: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      link: '/finance'
    },
    {
      id: 'social',
      name: 'Social',
      description: 'Connect with others using TON',
      icon: Users,
      color: 'bg-green-500/10',
      iconColor: 'text-green-500',
      link: '/social'
    },
    {
      id: 'utilities',
      name: 'Utilities',
      description: 'Useful tools with TON integration',
      icon: CreditCard,
      color: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      link: '/utilities'
    },
    {
      id: 'nft',
      name: 'NFT',
      description: 'Non-fungible token applications',
      icon: Nft,
      color: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      link: '/nft'
    }
  ];

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

            {/* Category Pages Section */}
            {selectedCategory === 'all' && (
              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryPages.map((category) => (
                  <Link 
                    key={category.id}
                    to={category.link} 
                    className="glass-card p-6 rounded-xl hover-scale cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className={`${category.color} p-3 rounded-full mr-4`}>
                        <category.icon className={category.iconColor} size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
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
