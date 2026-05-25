/**
 * Navbar Component - Main navigation bar with glassmorphism effect
 * Features: Responsive menu, active link highlighting, comparison badge
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, Bike, GitCompare, MessageCircle, Home, Search, BookOpen, LayoutDashboard, Palette } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';

const themes = [
  { id: 'fusion', label: 'Carbon Fusion', primaryColor: '#6366f1', accentColor: '#d946ef', class: '' },
  { id: 'red', label: 'Sport Red', primaryColor: '#ef4444', accentColor: '#f43f5e', class: 'theme-red' },
  { id: 'cyan', label: 'Electric Cyan', primaryColor: '#06b6d4', accentColor: '#3b82f6', class: 'theme-cyan' },
  { id: 'green', label: 'Acid Green', primaryColor: '#84cc16', accentColor: '#22c55e', class: 'theme-green' },
  { id: 'gold', label: 'Gold Prestige', primaryColor: '#f59e0b', accentColor: '#dd6b20', class: 'theme-gold' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('showroom-theme') || 'fusion';
  });
  
  const location = useLocation();
  const { comparisonList } = useVehicle();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync active theme to HTML class
  useEffect(() => {
    document.documentElement.classList.remove('theme-red', 'theme-cyan', 'theme-green', 'theme-gold');
    const selectedTheme = themes.find(t => t.id === activeTheme);
    if (selectedTheme && selectedTheme.class) {
      document.documentElement.classList.add(selectedTheme.class);
    }
    localStorage.setItem('showroom-theme', activeTheme);
  }, [activeTheme]);

  // Close menu and theme panel on route change
  useEffect(() => {
    setIsOpen(false);
    setShowThemePanel(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/cars', label: 'Cars', icon: Car },
    { path: '/bikes', label: 'Bikes', icon: Bike },
    { path: '/compare', label: 'Compare', icon: GitCompare, badge: comparisonList.length },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/admin', label: 'Admin', icon: LayoutDashboard },
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

          {/* Desktop Search & Theme Configurator */}
          <div className="hidden md:flex items-center gap-3 relative">
            <Link
              to="/cars"
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Accent Theme Swatcher */}
            <div className="relative">
              <button
                onClick={() => setShowThemePanel(!showThemePanel)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  showThemePanel
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title="Showroom Configurator"
              >
                <Palette className="w-5 h-5" />
              </button>

              {showThemePanel && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowThemePanel(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-slide-down">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Showroom Accent
                    </p>
                    <div className="space-y-1.5">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setActiveTheme(theme.id);
                            setShowThemePanel(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-200 text-left ${
                            activeTheme === theme.id
                              ? 'bg-primary-500/10 border border-primary-500/20 text-white'
                              : 'text-gray-300 border border-transparent'
                          }`}
                        >
                          <div className="flex">
                            <span
                              className="w-4 h-4 rounded-full border border-white/15"
                              style={{ backgroundColor: theme.primaryColor }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-white/15 -ml-2"
                              style={{ backgroundColor: theme.accentColor }}
                            />
                          </div>
                          <span className="text-sm font-medium">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
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
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
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

          {/* Mobile Theme Selector */}
          <div className="border-t border-white/5 pt-4 mt-2">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
              Showroom Accent Theme
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 ${
                    activeTheme === theme.id
                      ? 'bg-primary-500/20 border-primary-500/50 text-white'
                      : 'border-white/5 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                  title={theme.label}
                >
                  <div className="flex mb-1">
                    <span
                      className="w-3 h-3 rounded-full border border-white/15"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-white/15 -ml-1.5"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  </div>
                  <span className="text-[8px] truncate max-w-full font-medium">
                    {theme.label.split(' ')[1] || theme.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
