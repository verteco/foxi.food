import apiClient from './api';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string; // Decimal as string
  category: string;
  image?: string;
  is_available: boolean;
  restaurant: number;
  ingredients: string[];
  allergens: string[];
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  description: string;
  restaurant: number;
  order: number;
  items: MenuItem[];
}

export interface CreateMenuItemData {
  name: string;
  description: string;
  price: string;
  category: string;
  image?: File;
  is_available?: boolean;
  ingredients?: string[];
  allergens?: string[];
}

export interface UpdateMenuItemData extends Partial<CreateMenuItemData> {
  id: number;
}

class MenuService {
  async getRestaurantMenu(restaurantId: number): Promise<MenuCategory[]> {
    const response = await apiClient.get(`/api/restaurants/${restaurantId}/menu/`);
    return response.data;
  }

  async getMenuItem(id: number): Promise<MenuItem> {
    const response = await apiClient.get(`/api/menu-items/${id}/`);
    return response.data;
  }

  async createMenuItem(data: CreateMenuItemData): Promise<MenuItem> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await apiClient.post('/api/menu-items/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateMenuItem(data: UpdateMenuItemData): Promise<MenuItem> {
    const { id, ...updateData } = data;
    const formData = new FormData();
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await apiClient.patch(`/api/menu-items/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await apiClient.delete(`/api/menu-items/${id}/`);
  }

  async getMenuCategories(restaurantId: number): Promise<MenuCategory[]> {
    const response = await apiClient.get(`/api/restaurants/${restaurantId}/categories/`);
    return response.data;
  }

  async createMenuCategory(restaurantId: number, data: {
    name: string;
    description: string;
    order?: number;
  }): Promise<MenuCategory> {
    const response = await apiClient.post(`/api/restaurants/${restaurantId}/categories/`, data);
    return response.data;
  }

  async updateMenuCategory(categoryId: number, data: {
    name?: string;
    description?: string;
    order?: number;
  }): Promise<MenuCategory> {
    const response = await apiClient.patch(`/api/menu-categories/${categoryId}/`, data);
    return response.data;
  }

  async deleteMenuCategory(categoryId: number): Promise<void> {
    await apiClient.delete(`/api/menu-categories/${categoryId}/`);
  }

  async searchMenuItems(restaurantId: number, query: string): Promise<MenuItem[]> {
    const response = await apiClient.get(`/api/restaurants/${restaurantId}/menu/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export default new MenuService();
