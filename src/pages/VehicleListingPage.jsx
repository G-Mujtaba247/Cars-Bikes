/**
 * VehicleListingPage Component - Listing page for Cars or Bikes
 * Features: Filter sidebar, search, sort, grid/list view, pagination
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, Bike, Grid3X3, List, Search, X } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';
import VehicleCard from '../components/VehicleCard';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';

export default function VehicleListingPage({ type = 'car' }) {
  const { filteredVehicles, setCategory, setSearch, filters } = useVehicle();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const vehiclesPerPage = 8;

  // Set the vehicle category when the page loads or type changes
  useEffect(() => {
    setCategory(type);
    setCurrentPage(1);
  }, [type, setCategory]);

  // Handle URL search params for brand/fuel filtering
  useEffect(() => {
    const brand = searchParams.get('brand');
    const fuel = searchParams.get('fuel');
    if (brand || fuel) {
      // URL-based filtering could be added here
    }
  }, [searchParams]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, startIndex + vehiclesPerPage);

  const handleSearch = (query) => {
    setSearch(query);
    setCurrentPage(1);
  };

  const isCar = type === 'car';

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isCar ? 'bg-primary-500/20' : 'bg-accent-500/20'
              }`}>
                {isCar ? (
                  <Car className="w-5 h-5 text-primary-400" />
                ) : (
                  <Bike className="w-5 h-5 text-accent-400" />
                )}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
                  {isCar ? 'Cars' : 'Bikes'}
                </h1>
              </div>
            </div>
            <p className="text-gray-400">
              Explore our collection of {filteredVehicles.length} {isCar ? 'cars' : 'bikes'} with detailed specifications
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80">
            <SearchBar
              variant="compact"
              placeholder={`Search ${isCar ? 'cars' : 'bikes'}...`}
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.brands.length > 0 || filters.fuelTypes.length > 0 || filters.searchQuery) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Active filters:</span>
            {filters.searchQuery && (
              <span className="badge-primary flex items-center gap-1">
                <Search className="w-3 h-3" />
                "{filters.searchQuery}"
                <button onClick={() => setSearch('')} className="ml-1 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.brands.map(brand => (
              <span key={brand} className="badge-primary">{brand}</span>
            ))}
            {filters.fuelTypes.map(fuel => (
              <span key={fuel} className="badge-accent">{fuel}</span>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar vehicleType={type} />

          {/* Vehicle Grid */}
          <div className="flex-1">
            {currentVehicles.length > 0 ? (
              <>
                {/* Results count */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-500">
                    Showing {startIndex + 1}-{Math.min(startIndex + vehiclesPerPage, filteredVehicles.length)} of {filteredVehicles.length} results
                  </p>
                </div>

                {/* Vehicle Grid */}
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentVehicles.map((vehicle, index) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No vehicles found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory(type);
                  }}
                  className="btn-gradient"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
