// Export all services for easy importing
export { default as apiClient } from './api';
export { default as authService } from './authService';
export { default as restaurantService } from './restaurantService';
export { default as menuService } from './menuService';
export { default as orderService } from './orderService';

// Export types
export type { LoginCredentials, RegisterData, AuthResponse, User } from './authService';
export type { 
  Restaurant, 
  OpeningHours, 
  CreateRestaurantData, 
  UpdateRestaurantData 
} from './restaurantService';
export type { 
  MenuItem, 
  MenuCategory, 
  CreateMenuItemData, 
  UpdateMenuItemData 
} from './menuService';
export type { 
  Order, 
  OrderItem, 
  OrderStatus, 
  CreateOrderData, 
  UpdateOrderStatusData 
} from './orderService';
