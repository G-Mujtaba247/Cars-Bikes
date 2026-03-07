/**
 * FilterSidebar Component - Advanced filtering for vehicle listings
 * Features: Price range slider, brand checkboxes, fuel type filter, sort options
 */
import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, RotateCcw } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';
import { getBrands, getFuelTypes } from '../data/vehicles';

export default function FilterSidebar({ vehicleType = 'all' }) {
  const { filters, setFilter, resetFilters } = useVehicle();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    brand: true,
    fuel: true,
    price: true,
  });

  const brands = getBrands(vehicleType);
  const fuelTypes = getFuelTypes(vehicleType);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleBrand = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    setFilter({ brands: newBrands });
  };

  const toggleFuelType = (fuel) => {
    const newFuelTypes = filters.fuelTypes.includes(fuel)
      ? filters.fuelTypes.filter(f => f !== fuel)
      : [...filters.fuelTypes, fuel];
    setFilter({ fuelTypes: newFuelTypes });
  };

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'mileage', label: 'Best Mileage' },
  ];

  const pricePresets = vehicleType === 'bike'
    ? [
        { label: 'Under ₹2L', min: 0, max: 200000 },
        { label: '₹2L - ₹5L', min: 200000, max: 500000 },
        { label: '₹5L - ₹10L', min: 500000, max: 1000000 },
        { label: 'Above ₹10L', min: 1000000, max: 100000000 },
      ]
    : [
        { label: 'Under ₹10L', min: 0, max: 1000000 },
        { label: '₹10L - ₹20L', min: 1000000, max: 2000000 },
        { label: '₹20L - ₹50L', min: 2000000, max: 5000000 },
        { label: 'Above ₹50L', min: 5000000, max: 100000000 },
      ];

  const activeFilterCount =
    filters.brands.length +
    filters.fuelTypes.length +
    (filters.priceRange.min > 0 || filters.priceRange.max < 100000000 ? 1 : 0);

  // Filter content (shared between mobile/desktop)
  const FilterContent = () => (
    <div className="space-y-4">
      {/* Sort By */}
      <div className="glass-card p-4">
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full text-sm font-semibold text-white mb-3"
        >
          Sort By
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
              expandedSections.sort ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.sort && (
          <div className="space-y-1">
            {sortOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter({ sortBy: value })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  filters.sortBy === value
                    ? 'bg-primary-500/20 text-primary-300 font-medium'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="glass-card p-4">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full text-sm font-semibold text-white mb-3"
        >
          Brand
          {filters.brands.length > 0 && (
            <span className="badge-primary text-[10px] mr-auto ml-2">
              {filters.brands.length}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
              expandedSections.brand ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.brand && (
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-all duration-200"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    filters.brands.includes(brand)
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-600'
                  }`}
                >
                  {filters.brands.includes(brand) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-300">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Fuel Type Filter */}
      <div className="glass-card p-4">
        <button
          onClick={() => toggleSection('fuel')}
          className="flex items-center justify-between w-full text-sm font-semibold text-white mb-3"
        >
          Fuel Type
          {filters.fuelTypes.length > 0 && (
            <span className="badge-accent text-[10px] mr-auto ml-2">
              {filters.fuelTypes.length}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
              expandedSections.fuel ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.fuel && (
          <div className="flex flex-wrap gap-2">
            {fuelTypes.map((fuel) => (
              <button
                key={fuel}
                onClick={() => toggleFuelType(fuel)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filters.fuelTypes.includes(fuel)
                    ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                }`}
              >
                {fuel}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="glass-card p-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-sm font-semibold text-white mb-3"
        >
          Price Range
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
              expandedSections.price ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.price && (
          <div className="space-y-2">
            {pricePresets.map(({ label, min, max }) => (
              <button
                key={label}
                onClick={() => setFilter({ priceRange: { min, max } })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  filters.priceRange.min === min && filters.priceRange.max === max
                    ? 'bg-primary-500/20 text-primary-300 font-medium border border-primary-500/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-300 text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 btn-gradient flex items-center gap-2 shadow-2xl"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-dark-900 border-l border-white/10 overflow-y-auto p-4 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary-400" />
            Filters
          </h2>
          <FilterContent />
        </div>
      </div>
    </>
  );
}
