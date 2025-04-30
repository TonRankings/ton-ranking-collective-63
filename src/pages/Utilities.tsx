
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, House, Globe, CreditCard, Wallet, DollarSign } from 'lucide-react';
import { getAppsByCategory } from '../lib/data';
import AppCard from '../components/AppCard';
import Header from '../components/Header';

// Define utility subcategories
const utilityCategories = [
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Tools to enhance workflow and productivity',
    icon: House,
    color: 'bg-emerald-500'
  },
  {
    id: 'web3',
    name: 'Web3 Tools',
    description: 'Tools for interacting with TON and other blockchains',
    icon: Globe,
    color: 'bg-blue-500'
  },
  {
    id: 'merchant',
    name: 'Merchant Tools',
    description: 'Services for businesses accepting TON payments',
    icon: CreditCard,
    color: 'bg-amber-500'
  },
  {
    id: 'identity',
    name: 'Identity & Security',
    description: 'Identity verification and security solutions',
    icon: Wallet,
    color: 'bg-purple-500'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Blockchain analytics and tracking tools',
    icon: DollarSign,
    color: 'bg-indigo-500'
  }
];

const Utilities = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get all utility apps
  const utilityApps = getAppsByCategory('utility');
  
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
          <h1 className="text-3xl font-bold mb-2">TON Utility Apps</h1>
          <p className="text-muted-foreground mb-8">
            Explore different types of utility applications with TON blockchain integration
          </p>
          
          {/* Utility categories section */}
          {!selectedCategory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 animate-stagger">
              {utilityCategories.map((category) => (
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
                  {utilityCategories.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm px-4 py-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
                >
                  View all categories
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {utilityApps.map((app, index) => (
                  <AppCard key={app.id} app={app} delay={index * 100} />
                ))}
              </div>
              
              {utilityApps.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <House size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">No utility apps found</h2>
                  <p className="text-muted-foreground">
                    There are no utility apps in this category yet
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

export default Utilities;
