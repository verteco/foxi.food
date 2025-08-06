import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'customer' | 'restaurant_owner' | 'restaurant_employee' | 'admin';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  // Role-specific data
  restaurantId?: number; // for restaurant_owner and restaurant_employee
  restaurantName?: string;
  permissions?: string[]; // for employees
}

interface RoleContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  isCustomer: boolean;
  isRestaurantOwner: boolean;
  isRestaurantEmployee: boolean;
  isAdmin: boolean;
  switchUserForDemo: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Dummy users for demonstration
const DEMO_USERS: Record<UserRole, User> = {
  customer: {
    id: 1,
    email: 'jan.novak@example.com',
    firstName: 'Ján',
    lastName: 'Novák',
    role: 'customer',
    phone: '+421 900 123 456',
    avatar: '/api/placeholder/40/40'
  },
  restaurant_owner: {
    id: 2,
    email: 'maria.pizza@example.com',
    firstName: 'Mária',
    lastName: 'Pizzová',
    role: 'restaurant_owner',
    phone: '+421 900 234 567',
    restaurantId: 1,
    restaurantName: 'Pizza Palace',
    avatar: '/api/placeholder/40/40'
  },
  restaurant_employee: {
    id: 3,
    email: 'peter.kuchar@example.com',
    firstName: 'Peter',
    lastName: 'Kuchár',
    role: 'restaurant_employee',
    phone: '+421 900 345 678',
    restaurantId: 1,
    restaurantName: 'Pizza Palace',
    permissions: ['manage_menu', 'view_orders', 'update_order_status'],
    avatar: '/api/placeholder/40/40'
  },
  admin: {
    id: 4,
    email: 'admin@foxi.food',
    firstName: 'Admin',
    lastName: 'Adminov',
    role: 'admin',
    phone: '+421 900 456 789',
    avatar: '/api/placeholder/40/40'
  }
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize with customer for demo
  useEffect(() => {
    const savedUser = localStorage.getItem('foxi_demo_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Default to customer for demo
      setCurrentUser(DEMO_USERS.customer);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('foxi_demo_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('foxi_demo_user');
    }
  }, [currentUser]);

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('foxi_demo_user');
  };

  // Demo function to switch between user types
  const switchUserForDemo = (role: UserRole) => {
    setCurrentUser(DEMO_USERS[role]);
  };

  const userRole = currentUser?.role || null;

  const value: RoleContextType = {
    currentUser,
    userRole,
    setCurrentUser,
    logout,
    isCustomer: userRole === 'customer',
    isRestaurantOwner: userRole === 'restaurant_owner',
    isRestaurantEmployee: userRole === 'restaurant_employee',
    isAdmin: userRole === 'admin',
    switchUserForDemo
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
