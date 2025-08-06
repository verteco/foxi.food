import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRole } from '../contexts/RoleContext';

interface Order {
  id: number;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  orderTime: string;
  deliveryAddress: string;
  customerPhone: string;
  estimatedTime?: number;
}

const RestaurantEmployeeDashboard: React.FC = () => {
  const { currentUser } = useRole();
  const [activeTab, setActiveTab] = useState<'orders' | 'kitchen' | 'inventory' | 'profile'>('orders');

  // Dummy data
  const activeOrders: Order[] = [
    {
      id: 3001,
      customerName: 'Anna Nováková',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 12.50, notes: 'Extra cheese' },
        { name: 'Coca Cola', quantity: 2, price: 5.00 }
      ],
      total: 20.49,
      status: 'confirmed',
      orderTime: '15:20',
      deliveryAddress: 'Panská 15, Bratislava',
      customerPhone: '+421 900 123 456',
      estimatedTime: 25
    },
    {
      id: 3002,
      customerName: 'Martin Kováč',
      items: [
        { name: 'Pepperoni Pizza', quantity: 2, price: 27.80, notes: 'Well done' },
        { name: 'Garlic Bread', quantity: 1, price: 4.50 }
      ],
      total: 35.29,
      status: 'preparing',
      orderTime: '15:10',
      deliveryAddress: 'Sancová 32, Bratislava',
      customerPhone: '+421 900 234 567',
      estimatedTime: 15
    },
    {
      id: 3003,
      customerName: 'Lucia Svobodová',
      items: [
        { name: 'Hawaiian Pizza', quantity: 1, price: 13.90 },
        { name: 'Caesar Salad', quantity: 1, price: 8.90 }
      ],
      total: 25.79,
      status: 'ready',
      orderTime: '14:55',
      deliveryAddress: 'Metodova 8, Bratislava',
      customerPhone: '+421 900 345 678'
    }
  ];

  const inventoryItems = [
    { id: 1, name: 'Mozzarella cheese', current: 12, minimum: 5, unit: 'kg', status: 'ok' },
    { id: 2, name: 'Tomato sauce', current: 8, minimum: 10, unit: 'liter', status: 'low' },
    { id: 3, name: 'Pepperoni', current: 3, minimum: 5, unit: 'kg', status: 'low' },
    { id: 4, name: 'Pizza dough', current: 15, minimum: 8, unit: 'balls', status: 'ok' },
    { id: 5, name: 'Mushrooms', current: 1, minimum: 3, unit: 'kg', status: 'critical' }
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
      case 'pending': return 'Čaká na potvrdenie';
      case 'confirmed': return 'Potvrdená';
      case 'preparing': return 'Pripravuje sa';
      case 'ready': return 'Pripravená k vydaniu';
      case 'delivered': return 'Vydaná';
      default: return status;
    }
  };

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-green-600 bg-green-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const hasPermission = (permission: string) => {
    return currentUser?.permissions?.includes(permission) || false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Employee Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
              👨‍🍳
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentUser?.firstName} {currentUser?.lastName}
              </h1>
              <p className="text-gray-600">Zamestnanec • {currentUser?.restaurantName}</p>
              <div className="flex space-x-2 mt-1">
                {currentUser?.permissions?.map(perm => (
                  <span key={perm} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {perm.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                🟢 Na smene
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b">
            {[
              { key: 'orders', label: 'Objednávky', icon: '📋' },
              { key: 'kitchen', label: 'Kuchyňa', icon: '🍳' },
              { key: 'inventory', label: 'Sklad', icon: '📦' },
              { key: 'profile', label: 'Profil', icon: '👤' }
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
              <h2 className="text-xl font-bold mb-6">Aktívne objednávky</h2>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-600">Čakajú na spracovanie</h3>
                  <p className="text-2xl font-bold text-blue-900">
                    {activeOrders.filter(o => o.status === 'confirmed').length}
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-600">V príprave</h3>
                  <p className="text-2xl font-bold text-yellow-900">
                    {activeOrders.filter(o => o.status === 'preparing').length}
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-600">Pripravené</h3>
                  <p className="text-2xl font-bold text-green-900">
                    {activeOrders.filter(o => o.status === 'ready').length}
                  </p>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {activeOrders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-lg">#{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          {order.estimatedTime && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              ⏱️ {order.estimatedTime} min
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Zákazník:</strong> {order.customerName}</p>
                          <p><strong>Telefón:</strong> {order.customerPhone}</p>
                          <p><strong>Čas:</strong> {order.orderTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">€{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Položky:</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <span className="font-medium">{item.quantity}x {item.name}</span>
                            {item.notes && (
                              <p className="text-sm text-orange-600 italic">📝 {item.notes}</p>
                            )}
                          </div>
                          <span className="text-gray-600">€{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {hasPermission('update_order_status') && (
                      <div className="flex space-x-2">
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
                            Označiť ako pripravené
                          </button>
                        )}
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                          Detaily
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'kitchen' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Kuchyňa - Príkazy na prípravu</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeOrders.filter(o => ['preparing', 'ready'].includes(o.status)).map(order => (
                  <div key={order.id} className={`border-2 rounded-lg p-4 ${
                    order.status === 'preparing' ? 'border-yellow-300 bg-yellow-50' : 'border-green-300 bg-green-50'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">#{order.id}</h3>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{order.orderTime}</div>
                        {order.estimatedTime && (
                          <div className="text-lg font-bold text-orange-600">
                            ⏱️ {order.estimatedTime} min
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-white rounded p-3 border">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-lg">{item.quantity}x {item.name}</span>
                          </div>
                          {item.notes && (
                            <div className="bg-orange-100 text-orange-800 p-2 rounded text-sm">
                              <strong>Poznámka:</strong> {item.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {hasPermission('update_order_status') && order.status === 'preparing' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold"
                      >
                        ✅ HOTOVO
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Stav skladu</h2>
              
              {/* Low Stock Alert */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-yellow-800">Upozornenie na nízke zásoby</h3>
                    <p className="text-sm text-yellow-700">
                      {inventoryItems.filter(item => item.status !== 'ok').length} položiek potrebuje doplnenie
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {inventoryItems.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Minimálne množstvo: {item.minimum} {item.unit}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold">{item.current} {item.unit}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInventoryStatusColor(item.status)}`}>
                          {item.status === 'ok' ? '✅ OK' : 
                           item.status === 'low' ? '⚠️ Nízke' : '🚨 Kritické'}
                        </span>
                      </div>
                      <button className="mt-2 text-foxi-orange hover:text-foxi-orange-dark text-sm font-medium">
                        Objednať
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Môj pracovný profil</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reštaurácia</label>
                    <input
                      type="text"
                      value={currentUser?.restaurantName || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pozícia</label>
                    <input
                      type="text"
                      value="Zamestnanec"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Oprávnenia</label>
                    <div className="flex flex-wrap gap-2">
                      {currentUser?.permissions?.map(perm => (
                        <span key={perm} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {perm.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Work Stats */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Štatistiky práce</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">47</div>
                      <div className="text-sm text-blue-600">Objednávky dnes</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-900">18 min</div>
                      <div className="text-sm text-green-600">Priemerný čas prípravy</div>
                    </div>
                  </div>
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

export default RestaurantEmployeeDashboard;
