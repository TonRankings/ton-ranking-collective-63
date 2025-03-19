
import { useEffect, useState } from 'react';
import { Star, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { App } from '../lib/data';

interface AppCardProps {
  app: App;
  rank?: number;
  delay?: number;
}

const AppCard = ({ app, rank, delay = 0 }: AppCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className={`glass-card rounded-2xl overflow-hidden hover-scale subtle-shadow transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative">
        <div 
          className={`blur-load relative ${isLoaded ? 'loaded' : ''}`}
          style={{ backgroundColor: '#f0f0f0' }}
        >
          <img
            src={app.imageUrl}
            alt={app.name}
            onLoad={handleImageLoad}
            className="w-full h-48 object-cover transition-opacity duration-500"
          />
        </div>
        
        {rank && (
          <div className="absolute top-3 left-3 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm">
            {rank}
          </div>
        )}
        
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-foreground rounded-full px-2 py-1 text-xs font-medium">
          {app.tonIntegration === 'wallet' ? 'Wallet' : 
           app.tonIntegration === 'payments' ? 'Payments' : 
           app.tonIntegration === 'nft' ? 'NFT' : 'Multiple'}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{app.name}</h3>
          <div className="flex items-center bg-secondary/50 rounded-full px-2 py-0.5">
            <Star size={14} className="text-amber-500 mr-1" />
            <span className="text-sm font-medium">{app.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mt-2 mb-4 line-clamp-2">{app.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-muted-foreground text-sm">
            <Download size={14} className="mr-1" />
            <span>{formatNumber(app.downloads)}</span>
          </div>
          
          <div className="flex gap-2">
            <Link
              to={`/app/${app.id}`}
              className="text-xs px-3 py-1.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
            >
              Details
            </Link>
            
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1"
            >
              Open <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
