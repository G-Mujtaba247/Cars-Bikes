/**
 * ComparePage Component - Vehicle comparison page
 * Features: Side-by-side comparison, vehicle selector, specs table, share comparison
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, Plus, ArrowRight, Car, Bike, X, Search } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';
import ComparisonTable from '../components/ComparisonTable';
import { allVehicles } from '../data/vehicles';

export default function ComparePage() {
  const { comparisonList, addToCompare, clearComparison } = useVehicle();
  const [showSelector, setShowSelector] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState('');

  const filteredForSelector = allVehicles.filter(v => {
    const q = selectorSearch.toLowerCase();
    return (
      !comparisonList.find(cv => cv.id === v.id) &&
      (v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-primary-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
              Compare Vehicles
            </h1>
          </div>
          <p className="text-gray-400">
            Compare vehicles side-by-side to find the perfect match
          </p>
        </div>

        {/* Comparison Content */}
        {comparisonList.length > 0 ? (
          <div className="space-y-6">
            {/* Add Vehicle Button */}
            {comparisonList.length < 2 && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowSelector(true)}
                  className="btn-gradient flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Vehicle to Compare
                </button>
              </div>
            )}

            {/* Comparison Table */}
            <ComparisonTable />

            {/* Verdict Section */}
            {comparisonList.length === 2 && (
              <div className="glass-card p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-4 font-display">
                  Quick <span className="gradient-text">Verdict</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {comparisonList.map((vehicle) => (
                    <div key={vehicle.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-white">{vehicle.name}</h4>
                          <p className="text-xs text-gray-500">{vehicle.brand}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {/* Price comparison bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Price</span>
                            <span className="text-green-400">{vehicle.priceFormatted}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  (vehicle.price /
                                    Math.max(...comparisonList.map(v => v.price))) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                        {/* Mileage bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Mileage</span>
                            <span className="text-blue-400">{vehicle.mileage}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  (vehicle.mileageValue /
                                    Math.max(...comparisonList.map(v => v.mileageValue))) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                        {/* Rating bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Rating</span>
                            <span className="text-yellow-400">★ {vehicle.rating}/5</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500"
                              style={{
                                width: `${(vehicle.rating / 5) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-card p-12 sm:p-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
              <GitCompare className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-display">
              No Vehicles to Compare
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Add vehicles to your comparison list from the vehicle listings or detail pages. 
              You can compare up to 2 vehicles at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowSelector(true)}
                className="btn-gradient flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Select Vehicles
              </button>
              <Link to="/cars" className="btn-outline flex items-center gap-2">
                <Car className="w-4 h-4" />
                Browse Cars
              </Link>
              <Link to="/bikes" className="btn-outline flex items-center gap-2">
                <Bike className="w-4 h-4" />
                Browse Bikes
              </Link>
            </div>
          </div>
        )}

        {/* Vehicle Selector Modal */}
        {showSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSelector(false)}
            />
            <div className="relative w-full max-w-lg bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
              {/* Modal Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Select a Vehicle</h3>
                <button
                  onClick={() => setShowSelector(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={selectorSearch}
                    onChange={(e) => setSelectorSearch(e.target.value)}
                    placeholder="Search vehicles..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Vehicle List */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredForSelector.length > 0 ? (
                  filteredForSelector.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => {
                        addToCompare(vehicle);
                        setShowSelector(false);
                        setSelectorSearch('');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-left"
                    >
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-14 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{vehicle.name}</p>
                        <p className="text-xs text-gray-500">
                          {vehicle.brand} • {vehicle.priceFormatted} • {vehicle.engine}
                        </p>
                      </div>
                      {vehicle.type === 'car' ? (
                        <Car className="w-4 h-4 text-primary-400" />
                      ) : (
                        <Bike className="w-4 h-4 text-accent-400" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No vehicles found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
