
import { useState, useEffect } from 'react';
import { Gamepad, Trophy, Ticket, Coins, Award } from 'lucide-react';
import { getAppsByCategory } from '../lib/data';
import AppCard from '../components/AppCard';
import Header from '../components/Header';

// Define game subcategories
const gameCategories = [{
  id: 'tap2earn',
  name: 'Tap to Earn (T2E)',
  description: 'Simple tap games that reward players with cryptocurrency',
  icon: Ticket,
  color: 'bg-amber-500'
}, {
  id: 'play2earn',
  name: 'Play to Earn (P2E)',
  description: 'More complex games with cryptocurrency rewards for skilled play',
  icon: Gamepad,
  color: 'bg-emerald-500'
}, {
  id: 'competitive',
  name: 'Competitive Games',
  description: 'Games that involve competition between players for rewards',
  icon: Trophy,
  color: 'bg-blue-500'
}, {
  id: 'strategy',
  name: 'Strategy Games',
  description: 'Strategic games involving planning and resource management',
  icon: Award,
  color: 'bg-purple-500'
}, {
  id: 'collectible',
  name: 'Collectible Games',
  description: 'Games focused on collecting digital items and NFTs',
  icon: Coins,
  color: 'bg-rose-500'
}];
const Games = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get all game apps
  const gameApps = getAppsByCategory('games');
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  // Return to main games view
  const handleReturnToMain = () => {
    setSelectedCategory(null);
  };

  // Filter apps based on selected subcategory
  // For now, we'll just show all game apps since our data doesn't have subcategories
  // In a real app, you would filter them based on a subcategory property

  return <div className="min-h-screen bg-background">
      <div className="app-container pt-20 pb-16">
        <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-3xl font-bold mb-2">TON Games</h1>
          <p className="text-muted-foreground mb-6">
            Explore different types of games with TON blockchain integration
          </p>
          
          {/* Game categories section */}
          {!selectedCategory ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-stagger">
              {gameCategories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className="glass-card hover-scale rounded-xl overflow-hidden transition-all duration-300">
                  <div className="p-6 flex items-center">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white mr-4`}>
                      <category.icon size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>
                </button>)}
            </div> : <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {gameCategories.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <button onClick={handleReturnToMain} className="text-sm px-4 py-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
                  View all categories
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameApps.map((app, index) => <AppCard key={app.id} app={app} delay={index * 100} />)}
              </div>
              
              {gameApps.length === 0 && <div className="text-center py-16 glass-card rounded-2xl">
                  <Gamepad size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">No games found</h2>
                  <p className="text-muted-foreground">
                    There are no games in this category yet
                  </p>
                </div>}
            </div>}
        </div>
      </div>
    </div>;
};
export default Games;
