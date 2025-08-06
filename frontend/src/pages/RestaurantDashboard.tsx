import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine_type: string;
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
  items: MenuItem[];
}

interface MenuItem {
  id: number;
  name: string;
  price: string;
  is_available: boolean;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  restaurant_name?: string;
  status: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  item_name: string;
  quantity: number;
  price: string;
}

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  rating: number;
  menuItems: number;
}

const RestaurantDashboard: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    rating: 4.8,
    menuItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // For demo purposes, using restaurant ID 1
  const restaurantId = 1;
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurant details
      const restaurantResponse = await axios.get(`http://localhost:8000/api/restaurants/${restaurantId}/`);
      setRestaurant(restaurantResponse.data);
      
      // Fetch orders
      const ordersResponse = await axios.get('http://localhost:8000/api/orders/');
      const restaurantOrders = ordersResponse.data; // Show all orders for demo
      setOrders(restaurantOrders);
      
      // Calculate stats
      const today = new Date().toDateString();
      const todayOrders = restaurantOrders.filter((order: Order) => 
        new Date(order.created_at).toDateString() === today
      );
      
      const todayRevenue = todayOrders.reduce((sum: number, order: Order) => 
        sum + parseFloat(order.total_amount), 0
      );
      
      const menuItemsCount = restaurantResponse.data.categories?.reduce(
        (count: number, category: Category) => count + category.items.length, 0
      ) || 0;
      
      setStats({
        todayOrders: todayOrders.length,
        todayRevenue,
        rating: 4.8, // Mock rating for now
        menuItems: menuItemsCount
      });
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Chyba pri načítavaní údajov');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/api/placeholder/120/40"
                alt="Foxi.food"
                className="h-8 w-auto"
              />
              <span className="ml-4 text-gray-500">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                {restaurant?.name || 'Načítavam...'}
              </span>
              <button className="btn-secondary text-sm">
                Odhlásiť sa
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {restaurant ? 
              `Spravujte ${restaurant.name} - ${restaurant.cuisine_type}` :
              'Spravujte svoju reštauráciu a objednávky'
            }
          </p>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Načítavam dashboard...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.todayOrders}</div>
              <div className="text-gray-600">Dnešné objednávky</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-green-600">€{stats.todayRevenue.toFixed(2)}</div>
              <div className="text-gray-600">Dnešné tržby</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.rating}</div>
              <div className="text-gray-600">Hodnotenie</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-purple-600">{stats.menuItems}</div>
              <div className="text-gray-600">Položky menu</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Najnovšie objednávky</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Objednávka #{order}001</div>
                        <div className="text-sm text-gray-600">2x Pizza Margherita, 1x Cola</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">€24.50</div>
                        <div className="text-sm text-orange-600">Pripravuje sa</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Rýchle akcie</h2>
              </div>
              <div className="p-6 space-y-4">
                <button className="w-full btn-primary">
                  Pridať novú položku do menu
                </button>
                <button className="w-full btn-secondary">
                  Spravovať menu
                </button>
                <button className="w-full btn-secondary">
                  Nastavenia reštaurácie
                </button>
                <button className="w-full btn-secondary">
                  Zobrazenie štatistík
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
