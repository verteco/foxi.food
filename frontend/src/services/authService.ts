import apiClient from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_restaurant_owner?: boolean;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_restaurant_owner?: boolean;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/api/token/', credentials);
    const { access, refresh } = response.data;
    
    // Store tokens
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    // Get user profile
    const userResponse = await apiClient.get('/api/user/profile/');
    
    return {
      access,
      refresh,
      user: userResponse.data,
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/api/register/', data);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/api/token/blacklist/', {
          refresh_token: refreshToken,
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const response = await apiClient.get('/api/user/profile/');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const response = await apiClient.post('/api/token/refresh/', {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem('accessToken', access);
      return access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export default new AuthService();
