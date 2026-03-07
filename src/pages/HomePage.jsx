/**
 * HomePage Component - Landing page with hero section, search, and featured vehicles
 * Features: Animated hero, category cards, featured vehicles carousel, stats section
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Bike, Zap, Shield, Award, TrendingUp, ChevronRight, Star } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import VehicleCard from '../components/VehicleCard';
import { getFeaturedVehicles, carsData, bikesData, formatPrice } from '../data/vehicles';

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredBikes, setFeaturedBikes] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setFeaturedCars(getFeaturedVehicles('car'));
    setFeaturedBikes(getFeaturedVehicles('bike'));
  }, []);

  const stats = [
    { value: '20+', label: 'Vehicles', icon: Car },
    { value: '10+', label: 'Brands', icon: Award },
    { value: '4.5', label: 'Avg Rating', icon: Star },
    { value: '100%', label: 'Free', icon: Shield },
  ];

  const categories = [
    {
      title: 'Explore Cars',
      description: 'From sedans to SUVs, find your perfect car',
      icon: Car,
      link: '/cars',
      count: carsData.length,
      gradient: 'from-primary-500 to-blue-600',
      bg: 'from-primary-500/10 to-blue-600/10',
    },
    {
      title: 'Explore Bikes',
      description: 'Sports, cruisers, and naked bikes await',
      icon: Bike,
      link: '/bikes',
      count: bikesData.length,
      gradient: 'from-accent-500 to-pink-600',
      bg: 'from-accent-500/10 to-pink-600/10',
    },
    {
      title: 'Electric Vehicles',
      description: 'The future of mobility is here',
      icon: Zap,
      link: '/cars?fuel=Electric',
      count: 1,
      gradient: 'from-green-500 to-emerald-600',
      bg: 'from-green-500/10 to-emerald-600/10',
    },
  ];

  const allFeatured = activeTab === 'cars' ? featuredCars : activeTab === 'bikes' ? featuredBikes : [...featuredCars, ...featuredBikes];

  return (
    <div className="min-h-screen">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 animate-fade-in">
            <Sparkle />
            <span className="text-sm text-primary-300 font-medium">
              Discover Your Perfect Ride
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-6 text-balance animate-slide-up">
            <span className="text-white">Find Your </span>
            <span className="gradient-text">Dream Vehicle</span>
            <br />
            <span className="text-white">Today</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
            Explore detailed specifications, compare vehicles side-by-side, and get AI-powered 
            recommendations for cars and bikes.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <SearchBar variant="hero" placeholder="Search cars, bikes, brands..." />
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '600ms' }}>
            <Link
              to="/cars"
              className="btn-gradient flex items-center gap-2 group"
            >
              <Car className="w-4 h-4" />
              Explore Cars
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/bikes"
              className="btn-outline flex items-center gap-2 group"
            >
              <Bike className="w-4 h-4" />
              Explore Bikes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent" />
      </section>

      {/* ===================== STATS SECTION ===================== */}
      <section className="relative py-16 -mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(({ value, label, icon: Icon }, index) => (
                <div
                  key={label}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex w-12 h-12 rounded-xl bg-primary-500/10 items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white font-display">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CATEGORIES SECTION ===================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-white">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Choose your vehicle type and start exploring
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map(({ title, description, icon: Icon, link, count, gradient, bg }, index) => (
              <Link
                key={title}
                to={link}
                className="glass-card-hover p-6 group animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className={`w-7 h-7 bg-gradient-to-br ${gradient} bg-clip-text`} style={{ color: 'inherit' }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{count} vehicles</span>
                  <span className="flex items-center gap-1 text-sm text-primary-400 group-hover:gap-2 transition-all">
                    Explore <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED VEHICLES ===================== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
            <div>
              <h2 className="section-title text-white">
                Featured <span className="gradient-text">Vehicles</span>
              </h2>
              <p className="section-subtitle">Handpicked top-rated vehicles for you</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              {['all', 'cars', 'bikes'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allFeatured.map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/cars"
              className="btn-gradient inline-flex items-center gap-2 group"
            >
              View All Vehicles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== WHY CHOOSE US ===================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-white">
              Why Choose <span className="gradient-text">Our Portal</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Everything you need to make an informed vehicle decision
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Detailed Specs',
                description: 'Complete technical specifications for every vehicle',
                color: 'text-blue-400',
              },
              {
                icon: Shield,
                title: 'Compare Vehicles',
                description: 'Side-by-side comparison to find the best match',
                color: 'text-green-400',
              },
              {
                icon: Zap,
                title: 'AI Assistant',
                description: 'Get personalized recommendations from our AI chatbot',
                color: 'text-yellow-400',
              },
              {
                icon: Award,
                title: 'Expert Reviews',
                description: 'Curated data from industry experts and real users',
                color: 'text-accent-400',
              },
            ].map(({ icon: Icon, title, description, color }, index) => (
              <div
                key={title}
                className="glass-card p-6 text-center group hover:border-primary-500/20 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-accent-600/10 to-primary-600/10" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-500/20 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-4">
                Ready to Find Your <span className="gradient-text">Perfect Vehicle?</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8">
                Use our AI chatbot to get personalized recommendations or browse our extensive collection of cars and bikes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/cars" className="btn-gradient flex items-center gap-2">
                  Start Exploring <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/compare" className="btn-outline flex items-center gap-2">
                  Compare Vehicles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Simple sparkle component for the badge
function Sparkle() {
  return (
    <svg className="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  );
}
