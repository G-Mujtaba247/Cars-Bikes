/**
 * FavoritesPage Component - Saved vehicles dashboard
 */
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';
import VehicleCard from '../components/VehicleCard';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useVehicle();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-3">
              <Sparkles className="w-4 h-4 text-primary-300" />
              <span className="text-xs uppercase tracking-wider text-primary-300">Saved Picks</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
              Your <span className="gradient-text">Wishlist</span>
            </h1>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="glass-card p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-5">
              <Heart className="w-8 h-8 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No favorites yet</h2>
            <p className="text-gray-400 mb-8">
              Save your favorite cars and bikes to compare later and keep track of models you love.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/cars" className="btn-gradient inline-flex items-center gap-2">
                Explore Cars <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/bikes" className="btn-outline inline-flex items-center gap-2">
                Explore Bikes
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-400">
              {favorites.length} saved vehicle{favorites.length > 1 ? 's' : ''}
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {favorites.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
