/**
 * Navbar Component - Main navigation bar with glassmorphism effect
 * Features: Responsive menu, active link highlighting, comparison badge
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, Bike, GitCompare, MessageCircle, Home, Search } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { comparisonList } = useVehicle();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/cars', label: 'Cars', icon: Car },
    { path: '/bikes', label: 'Bikes', icon: Bike },
    { path: '/compare', label: 'Compare', icon: GitCompare, badge: comparisonList.length },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
            </div>
            <div>
              <span className="text-xl font-bold font-display gradient-text">
                Cars & Bikes
              </span>
              <span className="hidden sm:block text-[10px] text-gray-500 -mt-1 tracking-wider uppercase">
                Information Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon, badge }) => (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full text-xs text-white flex items-center justify-center font-bold animate-pulse">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Search Icon */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/cars"
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-dark-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-2">
          {navLinks.map(({ path, label, icon: Icon, badge }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive(path)
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                {label}
              </div>
              {badge > 0 && (
                <span className="w-6 h-6 bg-accent-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
