
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Download, ExternalLink, Share2 } from 'lucide-react';
import { getAppById, getAppsByCategory } from '../lib/data';
import AppCard from '../components/AppCard';
import { toast } from '../components/ui/use-toast';

const AppDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const app = id ? getAppById(id) : undefined;
  
  useEffect(() => {
    if (!app) {
      navigate('/not-found');
      return;
    }
    
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, [app, navigate]);

  const relatedApps = app 
    ? getAppsByCategory(app.category).filter(a => a.id !== app.id).slice(0, 3) 
    : [];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `TON RanKings - ${app?.name}`,
        text: app?.description,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share it with others",
      });
    }
  };

  if (!app) return null;

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="app-container py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to rankings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div 
            className={`lg:col-span-2 transform transition-all duration-700 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
          >
            <div className="glass-card rounded-2xl overflow-hidden subtle-shadow">
              <div className="relative">
                <div className={`blur-load ${imageLoaded ? 'loaded' : ''}`}>
                  <img
                    src={app.imageUrl}
                    alt={app.name}
                    onLoad={() => setImageLoaded(true)}
                    className="w-full h-64 object-cover transition-opacity duration-500"
                  />
                </div>
                
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-foreground rounded-full px-3 py-1 text-sm font-medium">
                  {app.tonIntegration === 'wallet' ? 'Wallet Integration' : 
                   app.tonIntegration === 'payments' ? 'Payments Integration' : 
                   app.tonIntegration === 'nft' ? 'NFT Integration' : 'Multiple Integrations'}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold">{app.name}</h1>
                  <div className="flex items-center bg-secondary/50 rounded-full px-3 py-1">
                    <Star size={18} className="text-amber-500 mr-1" />
                    <span className="font-medium">{app.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">{app.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-medium capitalize">{app.category}</p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Downloads</p>
                    <p className="font-medium">{formatNumber(app.downloads)}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary text-white rounded-full py-2.5 px-4 font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    Open in Telegram
                    <ExternalLink size={16} />
                  </a>
                  
                  <button
                    onClick={handleShare}
                    className="bg-secondary rounded-full p-2.5 hover:bg-secondary/80 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            className={`lg:col-span-1 transform transition-all duration-700 delay-100 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
          >
            <div className="glass-card rounded-2xl p-6 subtle-shadow">
              <h2 className="text-xl font-semibold mb-4">Related Apps</h2>
              
              <div className="space-y-6">
                {relatedApps.length > 0 ? (
                  relatedApps.map((relatedApp, index) => (
                    <Link 
                      key={relatedApp.id}
                      to={`/app/${relatedApp.id}`}
                      className="flex items-center gap-4 hover:bg-muted/50 p-3 rounded-lg transition-colors"
                    >
                      <img 
                        src={relatedApp.imageUrl} 
                        alt={relatedApp.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium">{relatedApp.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {relatedApp.description}
                        </p>
                        <div className="flex items-center mt-1 text-sm">
                          <Star size={14} className="text-amber-500 mr-1" />
                          <span>{relatedApp.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No related apps found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetail;
