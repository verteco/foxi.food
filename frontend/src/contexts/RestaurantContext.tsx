import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Restaurant, restaurantService } from '../services';

interface RestaurantState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  myRestaurant: Restaurant | null;
  popularRestaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    cuisine_type: string;
    page: number;
  };
  totalCount: number;
}

type RestaurantAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RESTAURANTS'; payload: { restaurants: Restaurant[]; totalCount: number } }
  | { type: 'SET_CURRENT_RESTAURANT'; payload: Restaurant | null }
  | { type: 'SET_MY_RESTAURANT'; payload: Restaurant | null }
  | { type: 'SET_POPULAR_RESTAURANTS'; payload: Restaurant[] }
  | { type: 'UPDATE_RESTAURANT'; payload: Restaurant }
  | { type: 'DELETE_RESTAURANT'; payload: number }
  | { type: 'SET_FILTERS'; payload: Partial<RestaurantState['filters']> }
  | { type: 'CLEAR_ERROR' };

interface RestaurantContextType extends RestaurantState {
  // Restaurant operations
  fetchRestaurants: (page?: number) => Promise<void>;
  fetchRestaurantById: (id: number) => Promise<void>;
  fetchMyRestaurant: () => Promise<void>;
  fetchPopularRestaurants: () => Promise<void>;
  createRestaurant: (data: any) => Promise<Restaurant>;
  updateRestaurant: (data: any) => Promise<Restaurant>;
  deleteRestaurant: (id: number) => Promise<void>;
  searchRestaurants: (query: string) => Promise<void>;
  
  // Filter operations
  setFilters: (filters: Partial<RestaurantState['filters']>) => void;
  clearFilters: () => void;
  
  // Utility operations
  clearError: () => void;
}

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  myRestaurant: null,
  popularRestaurants: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    cuisine_type: '',
    page: 1,
  },
  totalCount: 0,
};

const restaurantReducer = (state: RestaurantState, action: RestaurantAction): RestaurantState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_RESTAURANTS':
      return {
        ...state,
        restaurants: action.payload.restaurants,
        totalCount: action.payload.totalCount,
        isLoading: false,
        error: null,
      };
    case 'SET_CURRENT_RESTAURANT':
      return { ...state, currentRestaurant: action.payload, isLoading: false };
    case 'SET_MY_RESTAURANT':
      return { ...state, myRestaurant: action.payload, isLoading: false };
    case 'SET_POPULAR_RESTAURANTS':
      return { ...state, popularRestaurants: action.payload, isLoading: false };
    case 'UPDATE_RESTAURANT':
      return {
        ...state,
        restaurants: state.restaurants.map(r => 
          r.id === action.payload.id ? action.payload : r
        ),
        currentRestaurant: state.currentRestaurant?.id === action.payload.id 
          ? action.payload 
          : state.currentRestaurant,
        myRestaurant: state.myRestaurant?.id === action.payload.id 
          ? action.payload 
          : state.myRestaurant,
      };
    case 'DELETE_RESTAURANT':
      return {
        ...state,
        restaurants: state.restaurants.filter(r => r.id !== action.payload),
        currentRestaurant: state.currentRestaurant?.id === action.payload 
          ? null 
          : state.currentRestaurant,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(restaurantReducer, initialState);

  const fetchRestaurants = async (page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await restaurantService.getAllRestaurants(
        page,
        state.filters.search,
        state.filters.cuisine_type
      );
      dispatch({
        type: 'SET_RESTAURANTS',
        payload: {
          restaurants: response.results,
          totalCount: response.count,
        },
      });
      dispatch({ type: 'SET_FILTERS', payload: { page } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při načítání restaurací' });
    }
  };

  const fetchRestaurantById = async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const restaurant = await restaurantService.getRestaurantById(id);
      dispatch({ type: 'SET_CURRENT_RESTAURANT', payload: restaurant });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při načítání restaurace' });
    }
  };

  const fetchMyRestaurant = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const restaurant = await restaurantService.getMyRestaurant();
      dispatch({ type: 'SET_MY_RESTAURANT', payload: restaurant });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při načítání vaší restaurace' });
    }
  };

  const fetchPopularRestaurants = async () => {
    try {
      const restaurants = await restaurantService.getPopularRestaurants();
      dispatch({ type: 'SET_POPULAR_RESTAURANTS', payload: restaurants });
    } catch (error: any) {
      console.error('Error fetching popular restaurants:', error);
    }
  };

  const createRestaurant = async (data: any): Promise<Restaurant> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const restaurant = await restaurantService.createRestaurant(data);
      dispatch({ type: 'SET_MY_RESTAURANT', payload: restaurant });
      return restaurant;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při vytváření restaurace' });
      throw error;
    }
  };

  const updateRestaurant = async (data: any): Promise<Restaurant> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const restaurant = await restaurantService.updateRestaurant(data);
      dispatch({ type: 'UPDATE_RESTAURANT', payload: restaurant });
      return restaurant;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při aktualizaci restaurace' });
      throw error;
    }
  };

  const deleteRestaurant = async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await restaurantService.deleteRestaurant(id);
      dispatch({ type: 'DELETE_RESTAURANT', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při mazání restaurace' });
    }
  };

  const searchRestaurants = async (query: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const restaurants = await restaurantService.searchRestaurants(query);
      dispatch({
        type: 'SET_RESTAURANTS',
        payload: {
          restaurants,
          totalCount: restaurants.length,
        },
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při vyhledávání' });
    }
  };

  const setFilters = (filters: Partial<RestaurantState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({
      type: 'SET_FILTERS',
      payload: { search: '', cuisine_type: '', page: 1 },
    });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: RestaurantContextType = {
    ...state,
    fetchRestaurants,
    fetchRestaurantById,
    fetchMyRestaurant,
    fetchPopularRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    searchRestaurants,
    setFilters,
    clearFilters,
    clearError,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

export default RestaurantContext;
