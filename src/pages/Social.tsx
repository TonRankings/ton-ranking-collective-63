
import { useState, useEffect } from 'react';
import { Users, Globe, Linkedin, Twitter, Instagram } from 'lucide-react';
import { getAppsByCategory } from '../lib/data';
import AppCard from '../components/AppCard';
import Header from '../components/Header';

// Define social subcategories
const socialCategories = [
  {
    id: 'messaging',
    name: 'Messaging',
    description: 'Communication apps with TON integration',
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    id: 'communities',
    name: 'Communities',
    description: 'Platforms for creating and managing social groups',
    icon: Globe,
    color: 'bg-green-500'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Professional networking with TON integration',
    icon: Linkedin,
    color: 'bg-purple-500'
  },
  {
    id: 'microblogging',
    name: 'Microblogging',
    description: 'Short-form content platforms with TON rewards',
    icon: Twitter,
    color: 'bg-cyan-500'
  },
  {
    id: 'content',
    name: 'Content Sharing',
    description: 'Media sharing platforms with creator rewards',
    icon: Instagram,
    color: 'bg-pink-500'
  }
];

const Social = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get all social apps
  const socialApps = getAppsByCategory('social');
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="app-container pt-20 pb-16">
        <div 
          className={`transform transition-all duration-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-3xl font-bold mb-2">TON Social Apps</h1>
          <p className="text-muted-foreground mb-8">
            Explore different types of social applications with TON blockchain integration
          </p>
          
          {/* Social categories section */}
          {!selectedCategory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 animate-stagger">
              {socialCategories.map((category) => (
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
                  {socialCategories.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm px-4 py-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
                >
                  View all categories
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialApps.map((app, index) => (
                  <AppCard key={app.id} app={app} delay={index * 100} />
                ))}
              </div>
              
              {socialApps.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">No social apps found</h2>
                  <p className="text-muted-foreground">
                    There are no social apps in this category yet
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

export default Social;
