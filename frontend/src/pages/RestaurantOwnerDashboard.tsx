import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRole } from '../contexts/RoleContext';

interface RestaurantStats {
  todayOrders: number;
  todayRevenue: number;
  weekRevenue: number;
  totalCustomers: number;
  averageRating: number;
  pendingOrders: number;
}

interface Order {
  id: number;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  orderTime: string;
  deliveryAddress: string;
  customerPhone: string;
}

const RestaurantOwnerDashboard: React.FC = () => {
  const { currentUser } = useRole();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'analytics' | 'settings'>('overview');

  // Dummy data
  const stats: RestaurantStats = {
    todayOrders: 47,
    todayRevenue: 1247.50,
    weekRevenue: 8932.80,
    totalCustomers: 1234,
    averageRating: 4.8,
    pendingOrders: 6
  };

  const recentOrders: Order[] = [
    {
      id: 2001,
      customerName: 'Ján Novák',
      items: [
        { name: 'Margherita Pizza', quantity: 2, price: 25.00 },
        { name: 'Caesar Salad', quantity: 1, price: 8.90 }
      ],
      total: 36.89,
      status: 'pending',
      orderTime: '14:30',
      deliveryAddress: 'Hlavná 123, Bratislava',
      customerPhone: '+421 900 123 456'
    },
    {
      id: 2002,
      customerName: 'Mária Svobodová',
      items: [
        { name: 'Quattro Stagioni', quantity: 1, price: 14.50 }
      ],
      total: 17.49,
      status: 'preparing',
      orderTime: '14:15',
      deliveryAddress: 'Obchodná 45, Bratislava',
      customerPhone: '+421 900 234 567'
    },
    {
      id: 2003,
      customerName: 'Peter Kováč',
      items: [
        { name: 'Pepperoni Pizza', quantity: 1, price: 13.90 },
        { name: 'Garlic Bread', quantity: 2, price: 7.80 }
      ],
      total: 24.69,
      status: 'ready',
      orderTime: '14:00',
      deliveryAddress: 'Mickiewiczova 12, Bratislava',
      customerPhone: '+421 900 345 678'
    }
  ];

  const menuItems = [
    { id: 1, name: 'Margherita Pizza', price: 12.50, category: 'Pizza', available: true, orders: 23 },
    { id: 2, name: 'Pepperoni Pizza', price: 13.90, category: 'Pizza', available: true, orders: 31 },
    { id: 3, name: 'Quattro Stagioni', price: 14.50, category: 'Pizza', available: false, orders: 18 },
    { id: 4, name: 'Caesar Salad', price: 8.90, category: 'Salads', available: true, orders: 12 }
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-red-600 bg-red-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-yellow-600 bg-yellow-100';
      case 'ready': return 'text-green-600 bg-green-100';
      case 'delivered': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Nová objednávka';
      case 'confirmed': return 'Potvrdená';
      case 'preparing': return 'Pripravuje sa';
      case 'ready': return 'Pripravená';
      case 'delivered': return 'Doručená';
      default: return status;
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    // In real app, this would call API
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-foxi-orange rounded-lg flex items-center justify-center text-white text-xl font-bold">
              🍕
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentUser?.restaurantName || 'Moja reštaurácia'}
              </h1>
              <p className="text-gray-600">Majiteľ: {currentUser?.firstName} {currentUser?.lastName}</p>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                🟢 Otvorené
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b">
            {[
              { key: 'overview', label: 'Prehľad', icon: '📊' },
              { key: 'orders', label: 'Objednávky', icon: '📋' },
              { key: 'menu', label: 'Menu', icon: '🍽️' },
              { key: 'analytics', label: 'Analytika', icon: '📈' },
              { key: 'settings', label: 'Nastavenia', icon: '⚙️' }
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
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Dnešný prehľad</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-600">Dnešné objednávky</h3>
                  <p className="text-2xl font-bold text-blue-900">{stats.todayOrders}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-600">Dnešné tržby</h3>
                  <p className="text-2xl font-bold text-green-900">€{stats.todayRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-600">Týždenné tržby</h3>
                  <p className="text-2xl font-bold text-purple-900">€{stats.weekRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-600">Zákazníci</h3>
                  <p className="text-2xl font-bold text-yellow-900">{stats.totalCustomers}</p>
                </div>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-pink-600">Hodnotenie</h3>
                  <p className="text-2xl font-bold text-pink-900">⭐ {stats.averageRating}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-600">Čaká na spracovanie</h3>
                  <p className="text-2xl font-bold text-red-900">{stats.pendingOrders}</p>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Posledné objednávky</h3>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-foxi-orange hover:text-foxi-orange-dark font-medium"
                  >
                    Zobraziť všetky →
                  </button>
                </div>
                <div className="space-y-3">
                  {recentOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">#{order.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{order.customerName} • {order.orderTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">€{order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{order.items.length} položiek</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Spravovanie objednávok</h2>
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-lg">Objednávka #{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Zákazník:</strong> {order.customerName}</p>
                          <p><strong>Telefón:</strong> {order.customerPhone}</p>
                          <p><strong>Adresa:</strong> {order.deliveryAddress}</p>
                          <p><strong>Čas objednávky:</strong> {order.orderTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">€{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Položky:</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm mb-1">
                          <span>{item.quantity}x {item.name}</span>
                          <span>€{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Potvrdiť
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                        >
                          Začať prípravu
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Pripravené
                        </button>
                      )}
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                        Detaily
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Správa menu</h2>
                <button className="bg-foxi-orange text-white px-4 py-2 rounded-lg hover:bg-foxi-orange-dark">
                  + Pridať položku
                </button>
              </div>
              
              <div className="space-y-4">
                {menuItems.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{item.name}</h3>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {item.category}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          item.available ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                        }`}>
                          {item.available ? 'Dostupné' : 'Nedostupné'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Objednané dnes: {item.orders}x</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-lg">€{item.price.toFixed(2)}</span>
                      <div className="flex space-x-2">
                        <button className="text-foxi-orange hover:text-foxi-orange-dark">
                          Upraviť
                        </button>
                        <button 
                          className={`${
                            item.available 
                              ? 'text-red-600 hover:text-red-700' 
                              : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          {item.available ? 'Deaktivovať' : 'Aktivovať'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Analytika a reporty</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Najobľúbenejšie položky</h3>
                    <div className="space-y-2">
                      {menuItems.sort((a, b) => b.orders - a.orders).map((item, index) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="text-sm">{index + 1}. {item.name}</span>
                          <span className="text-sm font-medium">{item.orders} objednávok</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Týždenne štatistiky</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Priemerná objednávka:</span>
                        <span className="font-medium">€26.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Čas prípravy:</span>
                        <span className="font-medium">18 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spokojnosť zákazníkov:</span>
                        <span className="font-medium">96%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zrušené objednávky:</span>
                        <span className="font-medium">2.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Nastavenia reštaurácie</h2>
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Základné informácie</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Názov reštaurácie</label>
                      <input
                        type="text"
                        value={currentUser?.restaurantName || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-foxi-orange focus:border-foxi-orange"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Typ kuchyne</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-foxi-orange focus:border-foxi-orange">
                        <option>Italian</option>
                        <option>Chinese</option>
                        <option>American</option>
                        <option>Mexican</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Otváracie hodiny</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pondelok - Piatok</label>
                      <div className="flex space-x-2">
                        <input type="time" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="10:00" />
                        <span className="self-center">-</span>
                        <input type="time" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="22:00" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Víkend</label>
                      <div className="flex space-x-2">
                        <input type="time" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="11:00" />
                        <span className="self-center">-</span>
                        <input type="time" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="23:00" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Doručovanie</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Poplatok za doručenie (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="2.99"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-foxi-orange focus:border-foxi-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimálna objednávka (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="15.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-foxi-orange focus:border-foxi-orange"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <button className="bg-foxi-orange text-white px-6 py-2 rounded-lg hover:bg-foxi-orange-dark transition-colors">
                    Uložiť zmeny
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RestaurantOwnerDashboard;
