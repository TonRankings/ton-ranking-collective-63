
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Gamepad } from 'lucide-react';

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
          <Link to="/" className="font-semibold text-xl tracking-tight flex items-center gap-2 transition-all hover:opacity-80">
            <span className="text-primary">TON</span>
            <span>RanKings</span>
          </Link>
        </div>
      </div>
    </header>;
};

export default Header;
