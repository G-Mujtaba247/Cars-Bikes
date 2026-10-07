import React, { useState, useEffect } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Car, 
  Bike, 
  ChevronRight, 
  LayoutDashboard,
  Package,
  Star,
  Settings,
  AlertCircle,
  X,
  Save,
  Image as ImageIcon,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const AdminDashboard = () => {
  const { allVehicles, isLoading, addVehicle, updateVehicle, deleteVehicle, refreshData } = useVehicle();
  const { logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    type: 'car',
    price: '',
    year: new Date().getFullYear(),
    rating: 5,
    bodyType: '',
    fuelType: '',
    transmission: '',
    image: '',
    description: '',
  });

  const filteredVehicles = allVehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         v.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || v.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: allVehicles.length,
    cars: allVehicles.filter(v => v.type === 'car').length,
    bikes: allVehicles.filter(v => v.type === 'bike').length,
    averageRating: (allVehicles.reduce((acc, v) => acc + v.rating, 0) / allVehicles.length || 0).toFixed(1)
  };

  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setIsEditing(true);
      setCurrentVehicle(vehicle);
      setFormData({ ...vehicle });
    } else {
      setIsEditing(false);
      setCurrentVehicle(null);
      setFormData({
        name: '',
        brand: '',
        type: 'car',
        price: '',
        year: new Date().getFullYear(),
        rating: 5,
        bodyType: '',
        fuelType: '',
        transmission: '',
        image: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'year' || name === 'rating' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateVehicle(formData);
      } else {
        // Simple ID generation and data structure normalization
        const newId = `${formData.type}-${Date.now()}`;
        const newVehicle = { 
          ...formData, 
          id: newId, 
          reviews: 0, 
          featured: false,
          priceFormatted: `₹${formData.price.toLocaleString()}`,
          features: [
            "Advanced Braking System",
            "Digital Instrument Cluster",
            "LED Headlamps",
            "Premium Seating"
          ],
          specifications: {
            dimensions: "Variable",
            wheelbase: "Variable",
            groundClearance: formData.type === 'car' ? "165 mm" : "160 mm",
            fuelTankCapacity: formData.type === 'car' ? "45 L" : "12 L",
            kerbWeight: formData.type === 'car' ? "1200 kg" : "150 kg"
          },
          colors: ["Standard White", "Midnight Black", "Metallic Silver"]
        };
        await addVehicle(newVehicle);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert("Failed to save vehicle. Make sure the server is running.");
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(id, type);
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        alert("Failed to delete vehicle.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 font-display">Inventory Management</h1>
            <p className="text-gray-400">Manage your vehicle listings and stock levels</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-white">{user?.username}</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="btn-gradient flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add New Vehicle</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button 
              onClick={logout}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all duration-300"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Inventory', value: stats.total, icon: Package, color: 'text-blue-400' },
            { label: 'Cars', value: stats.cars, icon: Car, color: 'text-primary-400' },
            { label: 'Bikes', value: stats.bikes, icon: Bike, color: 'text-accent-400' },
            { label: 'Avg. Rating', value: stats.averageRating, icon: Star, color: 'text-yellow-400' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or brand..."
                className="input-glass pl-10 py-2 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter size={18} className="text-gray-400" />
              <select 
                className="input-glass py-2 text-sm w-full md:w-32"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="car">Cars</option>
                <option value="bike">Bikes</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Vehicle</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="animate-pulse flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
                        <span>Loading inventory...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No vehicles found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.name} 
                            className="w-10 h-10 rounded-lg object-cover bg-dark-800"
                          />
                          <div>
                            <p className="text-white font-medium">{vehicle.name}</p>
                            <p className="text-xs text-gray-500">{vehicle.brand} • {vehicle.year}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          vehicle.type === 'car' ? 'bg-primary-500/20 text-primary-400' : 'bg-accent-500/20 text-accent-400'
                        }`}>
                          {vehicle.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        ₹{vehicle.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star size={14} fill="currentColor" />
                          <span className="text-sm font-medium">{vehicle.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs text-green-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                          In Stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(vehicle)}
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Edit Vehicle"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(vehicle.id, vehicle.type)}
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            title="Delete Vehicle"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-white/5 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
              Showing {filteredVehicles.length} of {allVehicles.length} vehicles
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="glass-card w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-dark-900/50 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white font-display">
                {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Vehicle Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Honda Civic"
                    className="input-glass"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Brand</label>
                  <input 
                    type="text" 
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g. Honda"
                    className="input-glass"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Vehicle Type</label>
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="input-glass"
                    disabled={isEditing}
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Price (₹)</label>
                  <input 
                    type="number" 
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 1200000"
                    className="input-glass"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Year</label>
                  <input 
                    type="number" 
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleInputChange}
                    className="input-glass"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Body/Style</label>
                  <input 
                    type="text" 
                    name="bodyType"
                    required
                    value={formData.bodyType}
                    onChange={handleInputChange}
                    placeholder={formData.type === 'car' ? "e.g. Sedan" : "e.g. Cruiser"}
                    className="input-glass"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Fuel Type</label>
                  <select 
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="input-glass"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Transmission</label>
                  <input 
                    type="text" 
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    placeholder="e.g. Automatic"
                    className="input-glass"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-gray-400">Image URL</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="url" 
                      name="image"
                      required
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://images.unsplash.com/..."
                      className="input-glass pl-10"
                    />
                  </div>
                </div>
                {formData.image && (
                  <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-white/10">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop'; }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter vehicle description..."
                  className="input-glass resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn-gradient flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  <span>{isEditing ? 'Update Vehicle' : 'Add Vehicle'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
