/**
 * VehicleCard Component - Reusable card for displaying vehicle information
 * Features: Hover effects, comparison toggle, price formatting, rating display
 */
import { Link } from 'react-router-dom';
import { Fuel, Gauge, Settings, Star, GitCompare, Check, IndianRupee } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';
import { formatPrice } from '../data/vehicles';

export default function VehicleCard({ vehicle, index = 0 }) {
  const { addToCompare, removeFromCompare, isInComparison } = useVehicle();
  const inComparison = isInComparison(vehicle.id);

  // Staggered animation delay based on index
  const animationDelay = `${index * 100}ms`;

  return (
    <div
      className="glass-card-hover group relative overflow-hidden animate-fade-in"
      style={{ animationDelay }}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 overflow-hidden rounded-t-2xl">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${vehicle.type === 'car' ? 'badge-primary' : 'badge-accent'}`}>
            {vehicle.type === 'car' ? '🚗 Car' : '🏍️ Bike'}
          </span>
        </div>

        {/* Compare Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            inComparison ? removeFromCompare(vehicle.id) : addToCompare(vehicle);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
            inComparison
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-black/40 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white'
          }`}
          title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
        >
          {inComparison ? <Check className="w-4 h-4" /> : <GitCompare className="w-4 h-4" />}
        </button>

        {/* Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-white">{vehicle.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Brand */}
        <p className="text-xs text-primary-400 font-medium uppercase tracking-wider mb-1">
          {vehicle.brand}
        </p>

        {/* Name & Year */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors duration-300">
            {vehicle.name}
          </h3>
          <span className="text-xs text-gray-500">{vehicle.year}</span>
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <Fuel className="w-3.5 h-3.5 text-primary-400 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase">Fuel</span>
            <span className="text-xs text-gray-300 font-medium">{vehicle.fuelType}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <Gauge className="w-3.5 h-3.5 text-accent-400 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase">Mileage</span>
            <span className="text-xs text-gray-300 font-medium">{vehicle.mileage}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <Settings className="w-3.5 h-3.5 text-green-400 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase">Engine</span>
            <span className="text-xs text-gray-300 font-medium">{vehicle.engine}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-green-400" />
            <span className="text-lg font-bold text-white">{formatPrice(vehicle.price)}</span>
          </div>
          <Link
            to={`/vehicle/${vehicle.id}`}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-accent-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
