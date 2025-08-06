import apiClient from './api';

export interface OrderItem {
  id?: number;
  menu_item: number;
  menu_item_details?: {
    id: number;
    name: string;
    price: string;
    image?: string;
  };
  quantity: number;
  special_instructions?: string;
  price: string; // Total price for this item (quantity * unit_price)
}

export interface Order {
  id: number;
  restaurant: number;
  restaurant_details?: {
    id: number;
    name: string;
    address: string;
    phone: string;
  };
  customer: number;
  customer_details?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  total_amount: string;
  delivery_address: string;
  delivery_phone: string;
  special_instructions?: string;
  estimated_delivery_time?: string;
  created_at: string;
  updated_at: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface CreateOrderData {
  restaurant: number;
  items: {
    menu_item: number;
    quantity: number;
    special_instructions?: string;
  }[];
  delivery_address: string;
  delivery_phone: string;
  special_instructions?: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  estimated_delivery_time?: string;
}

class OrderService {
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await apiClient.post('/api/orders/', data);
    return response.data;
  }

  async getOrders(params?: {
    status?: OrderStatus;
    restaurant?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    results: Order[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`/api/orders/?${searchParams}`);
    return response.data;
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await apiClient.get(`/api/orders/${id}/`);
    return response.data;
  }

  async updateOrderStatus(orderId: number, data: UpdateOrderStatusData): Promise<Order> {
    const response = await apiClient.patch(`/api/orders/${orderId}/status/`, data);
    return response.data;
  }

  async cancelOrder(orderId: number, reason?: string): Promise<Order> {
    const response = await apiClient.patch(`/api/orders/${orderId}/cancel/`, {
      reason,
    });
    return response.data;
  }

  async getMyOrders(page = 1): Promise<{
    results: Order[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const response = await apiClient.get(`/api/orders/my-orders/?page=${page}`);
    return response.data;
  }

  async getRestaurantOrders(restaurantId: number, params?: {
    status?: OrderStatus;
    page?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<{
    results: Order[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`/api/restaurants/${restaurantId}/orders/?${searchParams}`);
    return response.data;
  }

  async getOrderStatistics(restaurantId: number, period = '30d'): Promise<{
    total_orders: number;
    total_revenue: string;
    average_order_value: string;
    orders_by_status: Record<OrderStatus, number>;
    revenue_by_day: Array<{
      date: string;
      revenue: string;
      orders: number;
    }>;
  }> {
    const response = await apiClient.get(`/api/restaurants/${restaurantId}/order-stats/?period=${period}`);
    return response.data;
  }

  // Real-time order updates (WebSocket would be better, but this is a polling alternative)
  async subscribeToOrderUpdates(
    orderId: number,
    onUpdate: (order: Order) => void,
    interval = 5000
  ): Promise<() => void> {
    const poll = async () => {
      try {
        const order = await this.getOrderById(orderId);
        onUpdate(order);
      } catch (error) {
        console.error('Error polling order updates:', error);
      }
    };

    const intervalId = setInterval(poll, interval);
    
    // Initial poll
    poll();

    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  getOrderStatusDisplayName(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Čeká na potvrzení',
      [OrderStatus.CONFIRMED]: 'Potvrzeno',
      [OrderStatus.PREPARING]: 'Připravuje se',
      [OrderStatus.READY]: 'Připraveno k vyzvednutí',
      [OrderStatus.OUT_FOR_DELIVERY]: 'Na cestě',
      [OrderStatus.DELIVERED]: 'Doručeno',
      [OrderStatus.CANCELLED]: 'Zrušeno',
    };
    return statusMap[status] || status;
  }
}

export default new OrderService();
