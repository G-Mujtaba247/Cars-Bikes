/**
 * VehicleContext - Global state management for vehicle data, filters, and comparison
 * Uses React Context API with useReducer for complex state management
 */
import { createContext, useContext, useReducer, useCallback } from 'react';
import { carsData, bikesData, allVehicles } from '../data/vehicles';

// Initial state for the vehicle context
const initialState = {
  // Vehicle data
  cars: carsData,
  bikes: bikesData,
  allVehicles: allVehicles,
  
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
  
  // Apply filters and return filtered vehicles
  const applyFilters = useCallback(() => {
    const { type, searchQuery, brands, fuelTypes, priceRange, sortBy } = state.filters;
    
    // Start with appropriate dataset
    let filtered = type === 'car' ? [...carsData] : type === 'bike' ? [...bikesData] : [...allVehicles];
    
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
  const setFilter = (filterUpdate) => dispatch({ type: ACTIONS.SET_FILTER, payload: filterUpdate });
  const resetFilters = () => dispatch({ type: ACTIONS.RESET_FILTERS });
  const setSearch = (query) => dispatch({ type: ACTIONS.SET_SEARCH, payload: query });
  const setCategory = (category) => dispatch({ type: ACTIONS.SET_CATEGORY, payload: category });
  
  const addToCompare = (vehicle) => {
    if (state.comparisonList.length >= 2) {
      alert('You can compare up to 2 vehicles at a time. Remove one to add another.');
      return;
    }
    dispatch({ type: ACTIONS.ADD_TO_COMPARE, payload: vehicle });
  };
  
  const removeFromCompare = (vehicleId) => dispatch({ type: ACTIONS.REMOVE_FROM_COMPARE, payload: vehicleId });
  const clearComparison = () => dispatch({ type: ACTIONS.CLEAR_COMPARISON });
  
  const isInComparison = (vehicleId) => state.comparisonList.some(v => v.id === vehicleId);
  
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
