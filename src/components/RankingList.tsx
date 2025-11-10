
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from '../lib/data';
import { Separator } from './ui/separator';
import { Download } from 'lucide-react';

interface RankingListProps {
  title: string;
  description?: string;
  apps: App[];
}

const RankingList = ({ title, description, apps }: RankingListProps) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = document.getElementById(title.replace(/\s+/g, '-').toLowerCase());
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [title]);

  if (apps.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">No apps found in this category.</p>
      </div>
    );
  }

  return (
    <section 
      id={title.replace(/\s+/g, '-').toLowerCase()} 
      className="py-6"
    >
      <div className="mb-6">
        <h2 className={`section-heading mb-2 transform transition-all duration-700 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {title}
        </h2>
        {description && (
          <p className={`text-muted-foreground transform transition-all duration-700 delay-100 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {description}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {apps.map((app, index) => (
          <div key={app.id}>
            <div 
              onClick={() => navigate(`/app/${app.id}`)}
              className="flex items-center py-4 px-4 cursor-pointer hover:bg-muted/30 hover:shadow-lg transition-all hover-scale rounded-lg"
            >
              <div className="w-10 text-center font-semibold text-lg text-muted-foreground mr-4">
                {index + 1}
              </div>
              
              <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden mr-4">
                <img 
                  src={app.imageUrl} 
                  alt={app.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-base">{app.name}</h3>
                <p className="text-sm text-muted-foreground">{app.category.charAt(0).toUpperCase() + app.category.slice(1)}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Download size={14} />
                  <span className="text-xs">{(app.downloads / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex items-center bg-secondary/50 rounded-full px-2 py-0.5">
                  <span className="text-sm font-medium">{app.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            {index < apps.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RankingList;
