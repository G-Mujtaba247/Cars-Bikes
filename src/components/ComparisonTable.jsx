/**
 * ComparisonTable Component - Side-by-side vehicle comparison
 * Features: Spec highlighting, responsive layout, difference markers
 */
import { Link } from 'react-router-dom';
import { X, ExternalLink, Fuel, Gauge, Settings, Zap, CreditCard } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';
import { formatPrice } from '../data/vehicles';

export default function ComparisonTable() {
  const { comparisonList, removeFromCompare, clearComparison } = useVehicle();

  if (comparisonList.length === 0) {
    return null;
  }

  // Comparison specification rows
  const specRows = [
    { label: 'Price', key: 'priceFormatted', icon: CreditCard, color: 'text-green-400' },
    { label: 'Engine', key: 'engine', icon: Settings, color: 'text-primary-400' },
    { label: 'Power', key: 'power', icon: Zap, color: 'text-yellow-400' },
    { label: 'Torque', key: 'torque', icon: Zap, color: 'text-orange-400' },
    { label: 'Mileage', key: 'mileage', icon: Gauge, color: 'text-blue-400' },
    { label: 'Fuel Type', key: 'fuelType', icon: Fuel, color: 'text-accent-400' },
    { label: 'Transmission', key: 'transmission', icon: Settings, color: 'text-indigo-400' },
    { label: 'Body Type', key: 'bodyType', icon: null, color: 'text-gray-400' },
    { label: 'Year', key: 'year', icon: null, color: 'text-gray-400' },
    { label: 'Rating', key: 'rating', icon: null, color: 'text-yellow-400' },
  ];

  // Extra spec rows from specifications object
  const extraSpecRows = [
    { label: 'Dimensions', key: 'dimensions' },
    { label: 'Wheelbase', key: 'wheelbase' },
    { label: 'Ground Clearance', key: 'groundClearance' },
    { label: 'Kerb Weight', key: 'kerbWeight' },
    { label: 'Fuel Tank', key: 'fuelTankCapacity' },
  ];

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white font-display">
          Comparison Table
        </h2>
        <button
          onClick={clearComparison}
          className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Vehicle Headers */}
      <div className="grid grid-cols-3 gap-0 border-b border-white/10">
        <div className="p-4 bg-white/5 flex items-center">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Specification</span>
        </div>
        {comparisonList.map((vehicle) => (
          <div key={vehicle.id} className="p-4 relative group">
            <button
              onClick={() => removeFromCompare(vehicle.id)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-3">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-16 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="text-xs text-primary-400 font-medium">{vehicle.brand}</p>
                <h3 className="text-sm font-bold text-white">{vehicle.name}</h3>
                <span className={`text-xs ${vehicle.type === 'car' ? 'text-primary-400' : 'text-accent-400'}`}>
                  {vehicle.type === 'car' ? '🚗 Car' : '🏍️ Bike'}
                </span>
              </div>
            </div>
            <Link
              to={`/vehicle/${vehicle.id}`}
              className="mt-2 inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              View Details <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ))}
        {comparisonList.length < 2 && (
          <div className="p-4 flex items-center justify-center border-l border-white/5">
            <Link
              to="/cars"
              className="text-sm text-gray-500 hover:text-primary-400 transition-colors text-center"
            >
              + Add Vehicle
            </Link>
          </div>
        )}
      </div>

      {/* Main Specs */}
      {specRows.map(({ label, key, icon: Icon, color }, index) => (
        <div
          key={key}
          className={`grid grid-cols-3 gap-0 ${
            index % 2 === 0 ? 'bg-white/[0.02]' : ''
          } border-b border-white/5`}
        >
          <div className="p-3 sm:p-4 flex items-center gap-2 bg-white/5">
            {Icon && <Icon className={`w-4 h-4 ${color}`} />}
            <span className="text-sm text-gray-400">{label}</span>
          </div>
          {comparisonList.map((vehicle) => (
            <div key={vehicle.id} className="p-3 sm:p-4">
              <span className="text-sm font-medium text-white">
                {vehicle[key] || '—'}
              </span>
            </div>
          ))}
          {comparisonList.length < 2 && <div className="p-3 sm:p-4" />}
        </div>
      ))}

      {/* Detailed Specifications */}
      <div className="p-4 bg-white/5 border-t border-b border-white/10">
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Detailed Specifications
        </span>
      </div>
      {extraSpecRows.map(({ label, key }, index) => (
        <div
          key={key}
          className={`grid grid-cols-3 gap-0 ${
            index % 2 === 0 ? 'bg-white/[0.02]' : ''
          } border-b border-white/5`}
        >
          <div className="p-3 sm:p-4 bg-white/5">
            <span className="text-sm text-gray-400">{label}</span>
          </div>
          {comparisonList.map((vehicle) => (
            <div key={vehicle.id} className="p-3 sm:p-4">
              <span className="text-sm font-medium text-white">
                {vehicle.specifications?.[key] || '—'}
              </span>
            </div>
          ))}
          {comparisonList.length < 2 && <div className="p-3 sm:p-4" />}
        </div>
      ))}

      {/* Features Comparison */}
      <div className="p-4 bg-white/5 border-t border-b border-white/10">
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Key Features
        </span>
      </div>
      <div className="grid grid-cols-3 gap-0 border-b border-white/5">
        <div className="p-3 sm:p-4 bg-white/5">
          <span className="text-sm text-gray-400">Features</span>
        </div>
        {comparisonList.map((vehicle) => (
          <div key={vehicle.id} className="p-3 sm:p-4">
            <ul className="space-y-1">
              {vehicle.features?.slice(0, 6).map((feature) => (
                <li key={feature} className="text-xs text-gray-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {comparisonList.length < 2 && <div className="p-3 sm:p-4" />}
      </div>
    </div>
  );
}
