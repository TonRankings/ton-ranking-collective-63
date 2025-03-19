
import { useState, useEffect } from 'react';
import AppCard from './AppCard';
import { App } from '../lib/data';

interface RankingListProps {
  title: string;
  description?: string;
  apps: App[];
}

const RankingList = ({ title, description, apps }: RankingListProps) => {
  const [visible, setVisible] = useState(false);

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
      className="py-10"
    >
      <div className="mb-8">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, index) => (
          <AppCard 
            key={app.id} 
            app={app} 
            rank={index + 1} 
            delay={100 * index}
          />
        ))}
      </div>
    </section>
  );
};

export default RankingList;
