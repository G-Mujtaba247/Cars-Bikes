/**
 * VehicleContext - Global state management for vehicle data, filters, and comparison
 * Uses React Context API with useReducer for complex state management
 */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import * as api from '../services/api';

// Initial state for the vehicle context
const initialState = {
  // Vehicle data
  cars: [],
  bikes: [],
  allVehicles: [],
  
  // Filtered results
  filteredVehicles: [],
  
  // Active filters
  filters: {
    type: 'all', // 'all', 'car', 'bike'
    searchQuery: '',
    brands: [],
    fuelTypes: [],
    priceRange: { min: 0, max: 100000000 },
    engineCapacity: { min: 0, max: 2000 },
    sortBy: 'name', // 'name', 'price-asc', 'price-desc', 'rating', 'mileage'
  },
  
  // Comparison
  comparisonList: [], // Max 2 vehicles
  
  // UI state
  isLoading: false,
  activeCategory: 'all',
};

// Action types
const ACTIONS = {
  SET_FILTER: 'SET_FILTER',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_SEARCH: 'SET_SEARCH',
  SET_CATEGORY: 'SET_CATEGORY',
  ADD_TO_COMPARE: 'ADD_TO_COMPARE',
  REMOVE_FROM_COMPARE: 'REMOVE_FROM_COMPARE',
  CLEAR_COMPARISON: 'CLEAR_COMPARISON',
  SET_FILTERED_VEHICLES: 'SET_FILTERED_VEHICLES',
  SET_LOADING: 'SET_LOADING',
  SET_DATA: 'SET_DATA',
  ADD_VEHICLE: 'ADD_VEHICLE',
  UPDATE_VEHICLE: 'UPDATE_VEHICLE',
  DELETE_VEHICLE: 'DELETE_VEHICLE',
};

// Reducer function
function vehicleReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    case ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: { ...initialState.filters, type: state.filters.type },
      };
    
    case ACTIONS.SET_SEARCH:
      return {
        ...state,
        filters: { ...state.filters, searchQuery: action.payload },
      };
    
    case ACTIONS.SET_CATEGORY:
      return {
        ...state,
        activeCategory: action.payload,
        filters: { ...state.filters, type: action.payload },
      };
    
    case ACTIONS.ADD_TO_COMPARE:
      if (state.comparisonList.length >= 2) return state;
      if (state.comparisonList.find(v => v.id === action.payload.id)) return state;
      return {
        ...state,
        comparisonList: [...state.comparisonList, action.payload],
      };
    
    case ACTIONS.REMOVE_FROM_COMPARE:
      return {
        ...state,
        comparisonList: state.comparisonList.filter(v => v.id !== action.payload),
      };
    
    case ACTIONS.CLEAR_COMPARISON:
      return {
        ...state,
        comparisonList: [],
      };
    
    case ACTIONS.SET_FILTERED_VEHICLES:
      return {
        ...state,
        filteredVehicles: action.payload,
      };
    
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ACTIONS.SET_DATA:
      return {
        ...state,
        cars: action.payload.cars,
        bikes: action.payload.bikes,
        allVehicles: action.payload.allVehicles,
      };
    
    case ACTIONS.ADD_VEHICLE:
      const addedVehicle = action.payload;
      const newCars = addedVehicle.type === 'car' ? [...state.cars, addedVehicle] : state.cars;
      const newBikes = addedVehicle.type === 'bike' ? [...state.bikes, addedVehicle] : state.bikes;
      return {
        ...state,
        cars: newCars,
        bikes: newBikes,
        allVehicles: [...state.allVehicles, addedVehicle],
      };

    case ACTIONS.UPDATE_VEHICLE:
      const updatedVehicle = action.payload;
      const updatedCars = updatedVehicle.type === 'car' 
        ? state.cars.map(v => v.id === updatedVehicle.id ? updatedVehicle : v) 
        : state.cars;
      const updatedBikes = updatedVehicle.type === 'bike' 
        ? state.bikes.map(v => v.id === updatedVehicle.id ? updatedVehicle : v) 
        : state.bikes;
      return {
        ...state,
        cars: updatedCars,
        bikes: updatedBikes,
        allVehicles: state.allVehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v),
      };

    case ACTIONS.DELETE_VEHICLE:
      const { id, type } = action.payload;
      return {
        ...state,
        cars: type === 'car' ? state.cars.filter(v => v.id !== id) : state.cars,
        bikes: type === 'bike' ? state.bikes.filter(v => v.id !== id) : state.bikes,
        allVehicles: state.allVehicles.filter(v => v.id !== id),
      };
    
    default:
      return state;
  }
}

// Create context
const VehicleContext = createContext();

/**
 * VehicleProvider component - Wraps the app with vehicle context
 */
export function VehicleProvider({ children }) {
  const [state, dispatch] = useReducer(vehicleReducer, initialState);
  
  // Fetch data on mount
  const loadData = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const [cars, bikes] = await Promise.all([api.fetchCars(), api.fetchBikes()]);
      const allVehicles = [...cars, ...bikes];
      dispatch({ type: ACTIONS.SET_DATA, payload: { cars, bikes, allVehicles } });
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Apply filters and return filtered vehicles
  const applyFilters = useCallback(() => {
    const { type, searchQuery, brands, fuelTypes, priceRange, sortBy } = state.filters;
    
    // Start with appropriate dataset
    let filtered = type === 'car' ? [...state.cars] : type === 'bike' ? [...state.bikes] : [...state.allVehicles];
    
    // Apply search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.bodyType.toLowerCase().includes(q) ||
        v.fuelType.toLowerCase().includes(q)
      );
    }
    
    // Apply brand filter
    if (brands.length > 0) {
      filtered = filtered.filter(v => brands.includes(v.brand));
    }
    
    // Apply fuel type filter
    if (fuelTypes.length > 0) {
      filtered = filtered.filter(v => fuelTypes.includes(v.fuelType));
    }
    
    // Apply price range
    if (priceRange.min > 0 || priceRange.max < 100000000) {
      filtered = filtered.filter(v => v.price >= priceRange.min && v.price <= priceRange.max);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'mileage':
        filtered.sort((a, b) => b.mileageValue - a.mileageValue);
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  }, [state.filters]);
  
  // Action creators
  const setFilter = useCallback((filterUpdate) => dispatch({ type: ACTIONS.SET_FILTER, payload: filterUpdate }), []);
  const resetFilters = useCallback(() => dispatch({ type: ACTIONS.RESET_FILTERS }), []);
  const setSearch = useCallback((query) => dispatch({ type: ACTIONS.SET_SEARCH, payload: query }), []);
  const setCategory = useCallback((category) => dispatch({ type: ACTIONS.SET_CATEGORY, payload: category }), []);
  
  const addToCompare = useCallback((vehicle) => {
    if (state.comparisonList.length >= 2) {
      alert('You can compare up to 2 vehicles at a time. Remove one to add another.');
      return;
    }
    dispatch({ type: ACTIONS.ADD_TO_COMPARE, payload: vehicle });
  }, [state.comparisonList]);
  
  const removeFromCompare = useCallback((vehicleId) => dispatch({ type: ACTIONS.REMOVE_FROM_COMPARE, payload: vehicleId }), []);
  const clearComparison = useCallback(() => dispatch({ type: ACTIONS.CLEAR_COMPARISON }), []);
  
  const isInComparison = useCallback((vehicleId) => state.comparisonList.some(v => v.id === vehicleId), [state.comparisonList]);
  
  const addVehicleAction = useCallback(async (vehicle) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const added = await api.addVehicle(vehicle);
      dispatch({ type: ACTIONS.ADD_VEHICLE, payload: added });
      return added;
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  const updateVehicleAction = useCallback(async (vehicle) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const updated = await api.updateVehicle(vehicle);
      dispatch({ type: ACTIONS.UPDATE_VEHICLE, payload: updated });
      return updated;
    } catch (error) {
      console.error("Failed to update vehicle:", error);
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  const deleteVehicleAction = useCallback(async (id, type) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await api.deleteVehicle(id, type);
      dispatch({ type: ACTIONS.DELETE_VEHICLE, payload: { id, type } });
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  const value = {
    ...state,
    filteredVehicles: applyFilters(),
    setFilter,
    resetFilters,
    setSearch,
    setCategory,
    addToCompare,
    removeFromCompare,
    clearComparison,
    isInComparison,
    addVehicle: addVehicleAction,
    updateVehicle: updateVehicleAction,
    deleteVehicle: deleteVehicleAction,
    refreshData: loadData,
  };
  
  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
}

/**
 * useVehicle hook - Access vehicle context
 */
export function useVehicle() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
}

export default VehicleContext;
