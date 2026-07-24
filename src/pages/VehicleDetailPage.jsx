/**
 * VehicleDetailPage Component - Detailed vehicle information page
 * Features: Image gallery, specs table, features list, compare button, similar vehicles
 */
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, Fuel, Gauge, Settings, Zap, GitCompare, Check,
  Calendar, Users, Layers, Weight, Droplets, ChevronRight, Share2, Heart
} from 'lucide-react';
import { formatPrice } from '../utils/vehicles';
import { useVehicle } from '../context/VehicleContext';
import VehicleCard from '../components/VehicleCard';

// Extends specs parsing utility
function parseNumber(str) {
  if (!str) return 0;
  const match = String(str).match(/([0-9.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

// Custom Cockpit circular dashboard spec dial gauge
function DashboardDial({ value, max, label, unit, colorClass, icon: Icon }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  // Sweep is 270 degrees (3/4 of a circle)
  const activeLength = circumference * 0.75;
  const strokeDashoffset = circumference - (percentage / 100) * activeLength;

  return (
    <div className="flex flex-col items-center p-5 bg-black/45 backdrop-blur-xl border border-white/5 rounded-2xl relative overflow-hidden group hover:border-primary-500/25 transition-all duration-350">
      {/* Visual background gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Dial SVG */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
          {/* Base track (grey background circle with 90deg gap) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#161f30"
            strokeWidth="7"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          {/* Active sweeping needle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="var(--color-primary-500)"
            strokeWidth="7"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center digital values */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {Icon && <Icon className={`w-4 h-4 ${colorClass} mb-0.5`} />}
          <span className="text-base font-extrabold text-white font-display">
            {value ? value.toFixed(1).replace('.0', '') : '0'}
          </span>
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
            {unit}
          </span>
        </div>
      </div>

      <span className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allVehicles, addToCompare, removeFromCompare, isInComparison, isLoading, error } = useVehicle();
  const [vehicle, setVehicle] = useState(null);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [activeSpecTab, setActiveSpecTab] = useState('overview');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const v = allVehicles.find(v => v.id === id);
    if (v) {
      setVehicle(v);
      // Get similar vehicles (same type, different vehicle)
      const similar = allVehicles
        .filter(sv => sv.type === v.type && sv.id !== v.id)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
      setSimilarVehicles(similar);
    } else {
      navigate('/');
    }
    // Scroll to top on vehicle change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, navigate, allVehicles, isLoading, error]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 pt-20">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Vehicle</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="btn-gradient">Back to Home</button>
        </div>
      </div>
    );
  }

  if (isLoading || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900">
        <div className="w-12 h-12 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin mb-4" />
        <p className="text-gray-500 animate-pulse">Fetching details...</p>
      </div>
    );
  }

  const inComparison = isInComparison(vehicle.id);
  const isCar = vehicle.type === 'car';

  const powerNum = parseNumber(vehicle.power);
  const torqueNum = parseNumber(vehicle.torque);
  // Parse mileage number, falling back to mileageValue if defined
  const mileageNum = vehicle.mileageValue || parseNumber(vehicle.mileage);

  const maxPower = isCar ? Math.max(500, powerNum) : Math.max(220, powerNum);
  const maxTorque = isCar ? Math.max(600, torqueNum) : Math.max(150, torqueNum);
  const maxMileage = isCar ? Math.max(35, mileageNum) : Math.max(80, mileageNum);

  // Overview specs
  const overviewSpecs = [
    { icon: Settings, label: 'Engine', value: vehicle.engine, color: 'text-blue-400' },
    { icon: Zap, label: 'Power', value: vehicle.power, color: 'text-yellow-400' },
    { icon: Zap, label: 'Torque', value: vehicle.torque, color: 'text-orange-400' },
    { icon: Gauge, label: 'Mileage', value: vehicle.mileage, color: 'text-green-400' },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType, color: 'text-accent-400' },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission, color: 'text-indigo-400' },
    { icon: Calendar, label: 'Year', value: vehicle.year, color: 'text-gray-400' },
    { icon: Layers, label: 'Body Type', value: vehicle.bodyType, color: 'text-cyan-400' },
  ];

  if (vehicle.seatingCapacity) {
    overviewSpecs.push({ icon: Users, label: 'Seats', value: `${vehicle.seatingCapacity} Seater`, color: 'text-purple-400' });
  }

  const specTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'features', label: 'Features' },
    { id: 'colors', label: 'Colors' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={isCar ? '/cars' : '/bikes'} className="hover:text-primary-400 transition-colors">
            {isCar ? 'Cars' : 'Bikes'}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-300">{vehicle.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Vehicle Image */}
          <div className="relative group">
            <div className="glass-card overflow-hidden rounded-3xl">
              <div className="relative aspect-[4/3]">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 via-transparent to-transparent" />
                
                {/* Type Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`badge ${isCar ? 'badge-primary' : 'badge-accent'} text-sm`}>
                    {isCar ? '🚗 Car' : '🏍️ Bike'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      liked
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-black/40 backdrop-blur-sm text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-red-400' : ''}`} />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-sm text-white/70 hover:bg-white/20 flex items-center justify-center transition-all duration-300">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-white">{vehicle.rating}</span>
                  <span className="text-xs text-gray-300">({vehicle.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-primary-400 font-semibold uppercase tracking-wider mb-2">
              {vehicle.brand}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-4">
              {vehicle.name}
            </h1>
            <p className="text-gray-400 leading-relaxed mb-6">
              {vehicle.description}
            </p>

            {/* Price */}
            <div className="glass-card p-4 mb-6 inline-flex items-center gap-2">
              <span className="text-sm text-gray-500">Starting at</span>
              <span className="text-2xl font-bold text-green-400">{vehicle.priceFormatted}</span>
              <span className="text-xs text-gray-600">onwards</span>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {overviewSpecs.slice(0, 6).map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="glass-card p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  inComparison ? removeFromCompare(vehicle.id) : addToCompare(vehicle)
                }
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  inComparison
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'btn-gradient'
                }`}
              >
                {inComparison ? (
                  <>
                    <Check className="w-5 h-5" />
                    In Comparison
                  </>
                ) : (
                  <>
                    <GitCompare className="w-5 h-5" />
                    Add to Compare
                  </>
                )}
              </button>

              {inComparison && (
                <Link
                  to="/compare"
                  className="btn-outline flex items-center gap-2"
                >
                  View Comparison
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ===================== PERFORMANCE COCKPIT INSTRUMENT PANEL ===================== */}
        <div className="carbon-texture p-6 sm:p-8 rounded-3xl mb-12 relative overflow-hidden headlight-glow">
          {/* Dashboard bezel rivets */}
          <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-white/10" />
          
          <div className="absolute inset-0 bg-mesh opacity-10" />

          <h2 className="text-sm font-extrabold font-display text-white mb-6 flex items-center gap-2 px-1 relative z-10 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-slow" />
            Performance Instrument Cluster
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            <DashboardDial
              value={powerNum}
              max={maxPower}
              label="Engine Power"
              unit="BHP"
              colorClass="text-yellow-400"
              icon={Zap}
            />
            <DashboardDial
              value={torqueNum}
              max={maxTorque}
              label="Engine Torque"
              unit="Nm"
              colorClass="text-orange-400"
              icon={Settings}
            />
            <DashboardDial
              value={mileageNum}
              max={maxMileage}
              label={vehicle.fuelType === 'Electric' ? 'Battery Range' : 'Fuel Efficiency'}
              unit={vehicle.fuelType === 'Electric' ? 'km/chg' : 'km/l'}
              colorClass="text-green-400"
              icon={Gauge}
            />
          </div>
        </div>

        {/* ===================== DETAIL TABS ===================== */}
        <div className="mb-12">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
            {specTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSpecTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeSpecTab === tab.id
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {/* Overview Tab */}
            {activeSpecTab === 'overview' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {overviewSpecs.map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="glass-card p-5 flex items-center gap-4 group hover:border-primary-500/20 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                      <p className="text-base font-semibold text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Specifications Tab */}
            {activeSpecTab === 'specifications' && (
              <div className="glass-card overflow-hidden">
                <div className="p-4 bg-white/5 border-b border-white/10">
                  <h3 className="font-bold text-white">Technical Specifications</h3>
                </div>
                {Object.entries(vehicle.specifications).map(([key, value], index) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-4 ${
                      index % 2 === 0 ? 'bg-white/[0.02]' : ''
                    } border-b border-white/5`}
                  >
                    <span className="text-sm text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-medium text-white">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Features Tab */}
            {activeSpecTab === 'features' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {vehicle.features.map((feature, index) => (
                  <div
                    key={feature}
                    className="glass-card p-4 flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary-400" />
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Colors Tab */}
            {activeSpecTab === 'colors' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {vehicle.colors.map((color, index) => (
                  <div
                    key={color}
                    className="glass-card p-5 flex items-center gap-4 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl border border-white/20"
                      style={{
                        background: getColorGradient(color),
                      }}
                    />
                    <span className="text-sm font-medium text-gray-300">{color}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SIMILAR VEHICLES ===================== */}
        {similarVehicles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-display text-white">
                Similar <span className="gradient-text">{isCar ? 'Cars' : 'Bikes'}</span>
              </h2>
              <Link
                to={isCar ? '/cars' : '/bikes'}
                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarVehicles.map((sv, index) => (
                <VehicleCard key={sv.id} vehicle={sv} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Helper function to generate a gradient based on color name
 */
function getColorGradient(colorName) {
  const colorMap = {
    white: '#ffffff',
    black: '#1a1a1a',
    red: '#ef4444',
    blue: '#3b82f6',
    silver: '#94a3b8',
    grey: '#6b7280',
    gray: '#6b7280',
    pearl: '#f1f5f9',
    bronze: '#a0522d',
    orange: '#f97316',
    green: '#22c55e',
    violet: '#8b5cf6',
    purple: '#a855f7',
    teal: '#14b8a6',
    lime: '#84cc16',
  };

  const name = colorName.toLowerCase();
  let foundColor = '#6366f1'; // Default indigo

  for (const [key, value] of Object.entries(colorMap)) {
    if (name.includes(key)) {
      foundColor = value;
      break;
    }
  }

  return `linear-gradient(135deg, ${foundColor}dd, ${foundColor}88)`;
}
