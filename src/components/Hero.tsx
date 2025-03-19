
import { ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-6">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0"
        style={{ 
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      />
      
      <div className="relative z-10 text-center max-w-3xl">
        <div className="overflow-hidden mb-3">
          <div 
            className={`category-chip inline-block transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
            style={{ transition: 'transform 0.7s ease-out, opacity 0.7s ease-out' }}
          >
            Rankings Collection
          </div>
        </div>
        
        <h1 
          className={`text-5xl sm:text-6xl font-bold leading-tight mb-6 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
          style={{ transition: 'transform 0.8s ease-out, opacity 0.8s ease-out' }}
        >
          Discover Top <span className="text-primary">TON</span> Apps
        </h1>
        
        <p 
          className={`text-lg text-muted-foreground mb-10 max-w-xl mx-auto transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
          style={{ transition: 'transform 0.9s ease-out, opacity 0.9s ease-out' }}
        >
          Explore the best Telegram mini apps with TON integration, ranked by popularity, 
          features, and user experience.
        </p>
        
        <button
          onClick={scrollToContent}
          className={`inline-flex items-center justify-center text-sm font-medium h-10 gap-2 px-4 py-2 
                   bg-primary text-white rounded-full hover:bg-primary/90 transition-all
                   transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transition: 'transform 1s ease-out, opacity 1s ease-out, background-color 0.3s ease' }}
        >
          Explore rankings
          <ArrowDown size={16} />
        </button>
      </div>
      
      <div 
        className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce"
        style={{ 
          opacity: isVisible ? 0.7 : 0,
          transition: 'opacity 1.5s ease-in-out'
        }}
      >
        <ArrowDown size={24} strokeWidth={1.5} />
      </div>
    </section>
  );
};

export default Hero;
