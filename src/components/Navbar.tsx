import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from './ui/utils';
import { fetchSettings } from '@/hooks/useSiteSettings';

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [siteName, setSiteName] = useState('XSC Blog');

  useEffect(() => {
    fetchSettings().then((s) => setSiteName(s.site_name));
  }, []);

  useEffect(() => {
    if (!isHome) {
      setScrolledPastHero(true);
      return;
    }

    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > window.innerHeight - 64);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const isTransparent = isHome && !scrolledPastHero;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        isTransparent ? "bg-transparent" : "bg-white"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link
          to="/"
          className={cn(
            "text-xl font-semibold transition-colors",
            isTransparent ? "text-white" : "text-gray-900"
          )}
        >
          {siteName}
        </Link>
        <Link
          to="/blogs"
          className={cn(
            "text-sm font-medium transition-colors",
            isTransparent
              ? "text-white/80 hover:text-white"
              : "text-gray-900 hover:text-gray-600"
          )}
        >
          全部博文
        </Link>
        <Link
          to="/about"
          className={cn(
            "text-sm font-medium transition-colors",
            isTransparent
              ? "text-white/80 hover:text-white"
              : "text-gray-900 hover:text-gray-600"
          )}
        >
          关于我
        </Link>
      </div>
    </nav>
  );
}
