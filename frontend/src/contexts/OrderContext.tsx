import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Order, OrderItem, OrderStatus, orderService } from '../services';

interface CartItem extends Omit<OrderItem, 'id' | 'price'> {
  menu_item_details: {
    id: number;
    name: string;
    price: string;
    image?: string;
  };
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  myOrders: Order[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  orderStatistics: any;
  cartTotal: number;
}

type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  | { type: 'SET_MY_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'SET_ORDER_STATISTICS'; payload: any }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_CART_ITEM'; payload: { menuItemId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CALCULATE_CART_TOTAL' }
  | { type: 'CLEAR_ERROR' };

interface OrderContextType extends OrderState {
  // Order operations
  fetchOrders: (params?: any) => Promise<void>;
  fetchOrderById: (id: number) => Promise<void>;
  fetchMyOrders: () => Promise<void>;
  createOrder: (data: any) => Promise<Order>;
  updateOrderStatus: (orderId: number, data: any) => Promise<Order>;
  cancelOrder: (orderId: number, reason?: string) => Promise<Order>;
  fetchOrderStatistics: (restaurantId: number, period?: string) => Promise<void>;
  
  // Cart operations
  addToCart: (item: CartItem) => void;
  removeFromCart: (menuItemId: number) => void;
  updateCartItemQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  
  // Utility operations
  clearError: () => void;
  getOrderStatusDisplayName: (status: OrderStatus) => string;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  myOrders: [],
  cart: [],
  isLoading: false,
  error: null,
  orderStatistics: null,
  cartTotal: 0,
};

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, isLoading: false };
    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload, isLoading: false };
    case 'SET_MY_ORDERS':
      return { ...state, myOrders: action.payload, isLoading: false };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        myOrders: [action.payload, ...state.myOrders],
        currentOrder: action.payload,
      };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        ),
        myOrders: state.myOrders.map(order => 
          order.id === action.payload.id ? action.payload : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.id 
          ? action.payload 
          : state.currentOrder,
      };
    case 'SET_ORDER_STATISTICS':
      return { ...state, orderStatistics: action.payload };
    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(
        item => item.menu_item === action.payload.menu_item
      );
      
      let newCart;
      if (existingItemIndex >= 0) {
        newCart = state.cart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newCart = [...state.cart, action.payload];
      }
      
      return { ...state, cart: newCart };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.menu_item !== action.payload),
      };
    
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.menu_item === action.payload.menuItemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [], cartTotal: 0 };
    
    case 'CALCULATE_CART_TOTAL':
      const total = state.cart.reduce((sum, item) => {
        const price = parseFloat(item.menu_item_details.price);
        return sum + (price * item.quantity);
      }, 0);
      return { ...state, cartTotal: total };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Recalculate cart total whenever cart changes
  React.useEffect(() => {
    dispatch({ type: 'CALCULATE_CART_TOTAL' });
  }, [state.cart]);

  const fetchOrders = async (params?: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await orderService.getOrders(params);
      dispatch({ type: 'SET_ORDERS', payload: response.results });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při načítání objednávek' });
    }
  };

  const fetchOrderById = async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const order = await orderService.getOrderById(id);
      dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při načítání objednávky' });
    }
  };

  const fetchMyOrders = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await orderService.getMyOrders();
      dispatch({ type: 'SET_MY_ORDERS', payload: response.results });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při načítání vašich objednávek' });
    }
  };

  const createOrder = async (data: any): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const order = await orderService.createOrder(data);
      dispatch({ type: 'ADD_ORDER', payload: order });
      dispatch({ type: 'CLEAR_CART' });
      return order;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při vytváření objednávky' });
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: number, data: any): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const order = await orderService.updateOrderStatus(orderId, data);
      dispatch({ type: 'UPDATE_ORDER', payload: order });
      return order;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při aktualizaci objednávky' });
      throw error;
    }
  };

  const cancelOrder = async (orderId: number, reason?: string): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const order = await orderService.cancelOrder(orderId, reason);
      dispatch({ type: 'UPDATE_ORDER', payload: order });
      return order;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při rušení objednávky' });
      throw error;
    }
  };

  const fetchOrderStatistics = async (restaurantId: number, period = '30d') => {
    try {
      const stats = await orderService.getOrderStatistics(restaurantId, period);
      dispatch({ type: 'SET_ORDER_STATISTICS', payload: stats });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Chyba při načítání statistik' });
    }
  };

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (menuItemId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: menuItemId });
  };

  const updateCartItemQuantity = (menuItemId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { menuItemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartItemCount = (): number => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const getOrderStatusDisplayName = (status: OrderStatus): string => {
    return orderService.getOrderStatusDisplayName(status);
  };

  const value: OrderContextType = {
    ...state,
    fetchOrders,
    fetchOrderById,
    fetchMyOrders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    fetchOrderStatistics,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartItemCount,
    clearError,
    getOrderStatusDisplayName,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;
