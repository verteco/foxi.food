import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRole } from '../contexts/RoleContext';

interface Order {
  id: number;
  restaurantName: string;
  restaurantLogo?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryAddress: string;
}

const CustomerDashboard: React.FC = () => {
  const { currentUser } = useRole();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'favorites'>('orders');

  // Dummy order data
  const orders: Order[] = [
    {
      id: 1001,
      restaurantName: 'Pizza Palace',
      restaurantLogo: '/api/placeholder/40/40',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 12.50 },
        { name: 'Caesar Salad', quantity: 1, price: 8.90 }
      ],
      total: 24.39,
      status: 'on_the_way',
      orderDate: '2024-01-15 14:30',
      deliveryAddress: 'Hlavná 123, Bratislava'
    },
    {
      id: 1002,
      restaurantName: 'Sushi Zen',
      restaurantLogo: '/api/placeholder/40/40',
      items: [
        { name: 'Salmon Sashimi', quantity: 1, price: 15.90 },
        { name: 'California Roll', quantity: 2, price: 22.80 }
      ],
      total: 41.69,
      status: 'delivered',
      orderDate: '2024-01-14 19:45',
      deliveryAddress: 'Hlavná 123, Bratislava'
    },
    {
      id: 1003,
      restaurantName: 'Burger Haven',
      restaurantLogo: '/api/placeholder/40/40',
      items: [
        { name: 'Classic Burger', quantity: 2, price: 19.80 },
        { name: 'French Fries', quantity: 1, price: 4.50 }
      ],
      total: 27.29,
      status: 'delivered',
      orderDate: '2024-01-13 12:15',
      deliveryAddress: 'Hlavná 123, Bratislava'
    }
  ];

  const favoriteRestaurants = [
    { id: 1, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.8, logo: '/api/placeholder/60/60' },
    { id: 2, name: 'Sushi Zen', cuisine: 'Japanese', rating: 4.9, logo: '/api/placeholder/60/60' },
    { id: 3, name: 'Burger Haven', cuisine: 'American', rating: 4.7, logo: '/api/placeholder/60/60' }
  ];

  const addresses = [
    { id: 1, label: 'Domov', address: 'Hlavná 123, 81102 Bratislava', isDefault: true },
    { id: 2, label: 'Práca', address: 'Obchodná 45, 81106 Bratislava', isDefault: false }
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-purple-600 bg-purple-100';
      case 'on_the_way': return 'text-orange-600 bg-orange-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Čaká na potvrdenie';
      case 'confirmed': return 'Potvrdená';
      case 'preparing': return 'Pripravuje sa';
      case 'on_the_way': return 'Na ceste';
      case 'delivered': return 'Doručená';
      case 'cancelled': return 'Zrušená';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-foxi-orange rounded-full flex items-center justify-center text-white text-xl font-bold">
              {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Vitajte späť, {currentUser?.firstName}!
              </h1>
              <p className="text-gray-600">Spravujte svoje objednávky a profil</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b">
            {[
              { key: 'orders', label: 'Moje objednávky', icon: '📦' },
              { key: 'profile', label: 'Profil', icon: '👤' },
              { key: 'addresses', label: 'Adresy', icon: '📍' },
              { key: 'favorites', label: 'Obľúbené', icon: '❤️' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-foxi-orange border-b-2 border-foxi-orange'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Moje objednávky</h2>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={order.restaurantLogo} 
                          alt={order.restaurantName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.restaurantName}</h3>
                          <p className="text-sm text-gray-600">Objednávka #{order.id}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-gray-600">
                          <span>{item.quantity}x {item.name}</span>
                          <span>€{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <div>{order.orderDate}</div>
                        <div>{order.deliveryAddress}</div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        €{order.total.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-4">
                      <button className="text-foxi-orange hover:text-foxi-orange-dark font-medium">
                        Zobraziť detail
                      </button>
                      {order.status === 'delivered' && (
                        <button className="text-foxi-orange hover:text-foxi-orange-dark font-medium">
                          Objednať znova
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Môj profil</h2>
              <div className="max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meno</label>
                    <input
                      type="text"
                      value={currentUser?.firstName || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-foxi-orange focus:border-foxi-orange"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priezvisko</label>
                    <input
                      type="text"
                      value={currentUser?.lastName || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-foxi-orange focus:border-foxi-orange"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-foxi-orange focus:border-foxi-orange"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefón</label>
                    <input
                      type="tel"
                      value={currentUser?.phone || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-foxi-orange focus:border-foxi-orange"
                      readOnly
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-foxi-orange text-white px-6 py-2 rounded-lg hover:bg-foxi-orange-dark transition-colors">
                    Upraviť profil
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Moje adresy</h2>
              <div className="space-y-4">
                {addresses.map(address => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{address.label}</h3>
                        {address.isDefault && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Predvolená
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{address.address}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-foxi-orange hover:text-foxi-orange-dark">
                        Upraviť
                      </button>
                      {!address.isDefault && (
                        <button className="text-red-600 hover:text-red-700">
                          Zmazať
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-600 hover:border-foxi-orange hover:text-foxi-orange transition-colors">
                  + Pridať novú adresu
                </button>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Obľúbené reštaurácie</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRestaurants.map(restaurant => (
                  <div key={restaurant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={restaurant.logo}
                        alt={restaurant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-medium">{restaurant.rating}</span>
                      </div>
                      <button className="text-foxi-orange hover:text-foxi-orange-dark font-medium">
                        Objednať
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
