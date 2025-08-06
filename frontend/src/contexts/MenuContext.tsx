import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MenuItem, MenuCategory, menuService } from '../services';

interface MenuState {
  categories: MenuCategory[];
  items: MenuItem[];
  currentItem: MenuItem | null;
  isLoading: boolean;
  error: string | null;
  currentRestaurantId: number | null;
}

type MenuAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MENU'; payload: { categories: MenuCategory[]; restaurantId: number } }
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'SET_CURRENT_ITEM'; payload: MenuItem | null }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'DELETE_MENU_ITEM'; payload: number }
  | { type: 'ADD_CATEGORY'; payload: MenuCategory }
  | { type: 'UPDATE_CATEGORY'; payload: MenuCategory }
  | { type: 'DELETE_CATEGORY'; payload: number }
  | { type: 'CLEAR_ERROR' };

interface MenuContextType extends MenuState {
  // Menu operations
  fetchRestaurantMenu: (restaurantId: number) => Promise<void>;
  fetchMenuItem: (id: number) => Promise<void>;
  createMenuItem: (data: any) => Promise<MenuItem>;
  updateMenuItem: (data: any) => Promise<MenuItem>;
  deleteMenuItem: (id: number) => Promise<void>;
  searchMenuItems: (restaurantId: number, query: string) => Promise<MenuItem[]>;
  
  // Category operations
  fetchMenuCategories: (restaurantId: number) => Promise<void>;
  createMenuCategory: (restaurantId: number, data: any) => Promise<MenuCategory>;
  updateMenuCategory: (categoryId: number, data: any) => Promise<MenuCategory>;
  deleteMenuCategory: (categoryId: number) => Promise<void>;
  
  // Utility operations
  clearError: () => void;
  getItemsByCategory: (categoryId: number) => MenuItem[];
  getAvailableItems: () => MenuItem[];
}

const initialState: MenuState = {
  categories: [],
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,
  currentRestaurantId: null,
};

const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_MENU':
      const allItems = action.payload.categories.flatMap(cat => cat.items || []);
      return {
        ...state,
        categories: action.payload.categories,
        items: allItems,
        currentRestaurantId: action.payload.restaurantId,
        isLoading: false,
        error: null,
      };
    case 'SET_MENU_ITEMS':
      return { ...state, items: action.payload, isLoading: false };
    case 'SET_CURRENT_ITEM':
      return { ...state, currentItem: action.payload, isLoading: false };
    case 'ADD_MENU_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        categories: state.categories.map(cat => 
          cat.name === action.payload.category
            ? { ...cat, items: [...(cat.items || []), action.payload] }
            : cat
        ),
      };
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
        categories: state.categories.map(cat => ({
          ...cat,
          items: cat.items?.map(item => 
            item.id === action.payload.id ? action.payload : item
          ) || [],
        })),
        currentItem: state.currentItem?.id === action.payload.id 
          ? action.payload 
          : state.currentItem,
      };
    case 'DELETE_MENU_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        categories: state.categories.map(cat => ({
          ...cat,
          items: cat.items?.filter(item => item.id !== action.payload) || [],
        })),
        currentItem: state.currentItem?.id === action.payload 
          ? null 
          : state.currentItem,
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat => 
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
        items: state.items.filter(item => {
          const category = state.categories.find(cat => cat.id === action.payload);
          return category ? item.category !== category.name : true;
        }),
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(menuReducer, initialState);

  const fetchRestaurantMenu = async (restaurantId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const categories = await menuService.getRestaurantMenu(restaurantId);
      dispatch({ type: 'SET_MENU', payload: { categories, restaurantId } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při načítání menu' });
    }
  };

  const fetchMenuItem = async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const item = await menuService.getMenuItem(id);
      dispatch({ type: 'SET_CURRENT_ITEM', payload: item });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při načítání položky menu' });
    }
  };

  const createMenuItem = async (data: any): Promise<MenuItem> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const item = await menuService.createMenuItem(data);
      dispatch({ type: 'ADD_MENU_ITEM', payload: item });
      return item;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při vytváření položky menu' });
      throw error;
    }
  };

  const updateMenuItem = async (data: any): Promise<MenuItem> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const item = await menuService.updateMenuItem(data);
      dispatch({ type: 'UPDATE_MENU_ITEM', payload: item });
      return item;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při aktualizaci položky menu' });
      throw error;
    }
  };

  const deleteMenuItem = async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await menuService.deleteMenuItem(id);
      dispatch({ type: 'DELETE_MENU_ITEM', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při mazání položky menu' });
    }
  };

  const searchMenuItems = async (restaurantId: number, query: string): Promise<MenuItem[]> => {
    try {
      const items = await menuService.searchMenuItems(restaurantId, query);
      return items;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při vyhledávání' });
      return [];
    }
  };

  const fetchMenuCategories = async (restaurantId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const categories = await menuService.getMenuCategories(restaurantId);
      dispatch({ type: 'SET_MENU', payload: { categories, restaurantId } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při načítání kategorií' });
    }
  };

  const createMenuCategory = async (restaurantId: number, data: any): Promise<MenuCategory> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const category = await menuService.createMenuCategory(restaurantId, data);
      dispatch({ type: 'ADD_CATEGORY', payload: category });
      return category;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při vytváření kategorie' });
      throw error;
    }
  };

  const updateMenuCategory = async (categoryId: number, data: any): Promise<MenuCategory> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const category = await menuService.updateMenuCategory(categoryId, data);
      dispatch({ type: 'UPDATE_CATEGORY', payload: category });
      return category;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při aktualizaci kategorie' });
      throw error;
    }
  };

  const deleteMenuCategory = async (categoryId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await menuService.deleteMenuCategory(categoryId);
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při mazání kategorie' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const getItemsByCategory = (categoryId: number): MenuItem[] => {
    const category = state.categories.find(cat => cat.id === categoryId);
    return category?.items || [];
  };

  const getAvailableItems = (): MenuItem[] => {
    return state.items.filter(item => item.is_available);
  };

  const value: MenuContextType = {
    ...state,
    fetchRestaurantMenu,
    fetchMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    searchMenuItems,
    fetchMenuCategories,
    createMenuCategory,
    updateMenuCategory,
    deleteMenuCategory,
    clearError,
    getItemsByCategory,
    getAvailableItems,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export default MenuContext;
