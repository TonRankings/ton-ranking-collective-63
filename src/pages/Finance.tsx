
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Bitcoin, DollarSign, Euro } from 'lucide-react';
import { getAppsByCategory } from '../lib/data';
import AppCard from '../components/AppCard';
import Header from '../components/Header';

// Define finance subcategories
const financeCategories = [
  {
    id: 'wallets',
    name: 'Wallets',
    description: 'Self-custodial and managed wallets for storing TON',
    icon: Wallet,
    color: 'bg-blue-500'
  },
  {
    id: 'payments',
    name: 'Payment Solutions',
    description: 'Services for sending and receiving payments using TON',
    icon: CreditCard,
    color: 'bg-green-500'
  },
  {
    id: 'exchanges',
    name: 'Exchanges',
    description: 'Platforms for trading TON and other cryptocurrencies',
    icon: Bitcoin,
    color: 'bg-purple-500'
  },
  {
    id: 'defi',
    name: 'DeFi Apps',
    description: 'Decentralized finance applications built on TON',
    icon: DollarSign,
    color: 'bg-amber-500'
  },
  {
    id: 'investments',
    name: 'Investment Tools',
    description: 'Tools for investing and managing portfolios',
    icon: Euro,
    color: 'bg-rose-500'
  }
];

const Finance = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get all finance apps
  const financeApps = getAppsByCategory('finance');
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="app-container pt-20 pb-16">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to rankings
        </Link>
        
        <div 
          className={`transform transition-all duration-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-3xl font-bold mb-2">TON Finance Apps</h1>
          <p className="text-muted-foreground mb-8">
            Explore different types of financial applications with TON blockchain integration
          </p>
          
          {/* Finance categories section */}
          {!selectedCategory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 animate-stagger">
              {financeCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
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
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {financeCategories.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm px-4 py-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
                >
                  View all categories
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {financeApps.map((app, index) => (
                  <AppCard key={app.id} app={app} delay={index * 100} />
                ))}
              </div>
              
              {financeApps.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <Wallet size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">No finance apps found</h2>
                  <p className="text-muted-foreground">
                    There are no finance apps in this category yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;
