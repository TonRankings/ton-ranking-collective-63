
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Gamepad, Tag } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <header className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-semibold tracking-tight flex items-center gap-2 transition-all hover:opacity-80">
            <img 
              src="/lovable-uploads/31c9a471-e00a-4044-af87-4899946c79a3.png"
              alt="TON RanKings" 
              className="h-30" 
            />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              to="/games" 
              className={`text-sm hover:text-primary transition-colors ${location.pathname === '/games' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Games
            </Link>
            <Link 
              to="/finance" 
              className={`text-sm hover:text-primary transition-colors ${location.pathname === '/finance' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Finance
            </Link>
            <Link 
              to="/tge" 
              className={`text-sm hover:text-primary transition-colors flex items-center ${location.pathname === '/tge' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Tag size={14} className="mr-1" />
              TGE Tracker
            </Link>
          </nav>
        </div>
      </div>
    </header>;
};

export default Header;
