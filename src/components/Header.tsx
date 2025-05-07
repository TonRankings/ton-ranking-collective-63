
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
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <Link to="/" className="font-semibold tracking-tight flex items-center gap-2 transition-all hover:opacity-80">
          <img src="/lovable-uploads/31c9a471-e00a-4044-af87-4899946c79a3.png" alt="TON RanKings" className="h-20" />
        </Link>
      </div>
    </header>;
};
export default Header;
