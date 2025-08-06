import apiClient from './api';

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine_type: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  cover_image?: string;
  rating: number;
  is_active: boolean;
  opening_hours: OpeningHours[];
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  id?: number;
  day_of_week: number; // 0-6 (Monday to Sunday)
  opening_time: string; // HH:MM format
  closing_time: string; // HH:MM format
  is_closed: boolean;
}

export interface CreateRestaurantData {
  name: string;
  description: string;
  cuisine_type: string;
  address: string;
  phone: string;
  email: string;
  logo?: File;
  cover_image?: File;
}

export interface UpdateRestaurantData extends Partial<CreateRestaurantData> {
  id: number;
}

class RestaurantService {
  async getAllRestaurants(page = 1, search = '', cuisine_type = ''): Promise<{
    results: Restaurant[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(cuisine_type && { cuisine_type }),
    });

    const response = await apiClient.get(`/api/restaurants/?${params}`);
    return response.data;
  }

  async getRestaurantById(id: number): Promise<Restaurant> {
    const response = await apiClient.get(`/api/restaurants/${id}/`);
    return response.data;
  }

  async createRestaurant(data: CreateRestaurantData): Promise<Restaurant> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await apiClient.post('/api/restaurants/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateRestaurant(data: UpdateRestaurantData): Promise<Restaurant> {
    const { id, ...updateData } = data;
    const formData = new FormData();
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await apiClient.patch(`/api/restaurants/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteRestaurant(id: number): Promise<void> {
    await apiClient.delete(`/api/restaurants/${id}/`);
  }

  async getMyRestaurant(): Promise<Restaurant | null> {
    try {
      const response = await apiClient.get('/api/restaurants/my-restaurant/');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateOpeningHours(restaurantId: number, openingHours: OpeningHours[]): Promise<OpeningHours[]> {
    const response = await apiClient.put(`/api/restaurants/${restaurantId}/opening-hours/`, {
      opening_hours: openingHours,
    });
    return response.data;
  }

  async getCuisineTypes(): Promise<string[]> {
    const response = await apiClient.get('/api/restaurants/cuisine-types/');
    return response.data;
  }

  async getPopularRestaurants(limit = 6): Promise<Restaurant[]> {
    const response = await apiClient.get(`/api/restaurants/popular/?limit=${limit}`);
    return response.data;
  }

  async searchRestaurants(query: string): Promise<Restaurant[]> {
    const response = await apiClient.get(`/api/restaurants/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export default new RestaurantService();
