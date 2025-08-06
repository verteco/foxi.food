import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRole } from '../contexts/RoleContext';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useRole();
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'users' | 'orders' | 'analytics'>('overview');

  // Dummy admin data
  const platformStats = {
    totalRestaurants: 247,
    activeRestaurants: 198,
    totalUsers: 15432,
    todayOrders: 1247,
    totalRevenue: 89432.50,
    monthlyRevenue: 234567.80
  };

  const restaurants = [
    { id: 1, name: 'Pizza Palace', owner: 'Mária Pizzová', status: 'active', orders: 847, revenue: 12340.50 },
    { id: 2, name: 'Sushi Zen', owner: 'Tomáš Sushi', status: 'active', orders: 523, revenue: 8920.30 },
    { id: 3, name: 'Burger Haven', owner: 'Peter Burger', status: 'pending', orders: 234, revenue: 4560.80 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
              👨‍💼
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">{currentUser?.firstName} {currentUser?.lastName} • Správca platformy</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b">
            {[
              { key: 'overview', label: 'Prehľad', icon: '📊' },
              { key: 'restaurants', label: 'Reštaurácie', icon: '🏪' },
              { key: 'users', label: 'Používatelia', icon: '👥' },
              { key: 'orders', label: 'Objednávky', icon: '📦' },
              { key: 'analytics', label: 'Analytika', icon: '📈' }
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
              <h2 className="text-xl font-bold mb-6">Prehľad platformy</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-blue-600">Celkom reštaurácií</h3>
                  <p className="text-3xl font-bold text-blue-900">{platformStats.totalRestaurants}</p>
                  <p className="text-sm text-blue-700">{platformStats.activeRestaurants} aktívnych</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-green-600">Registrovaní používatelia</h3>
                  <p className="text-3xl font-bold text-green-900">{platformStats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-purple-600">Dnešné objednávky</h3>
                  <p className="text-3xl font-bold text-purple-900">{platformStats.todayOrders}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-yellow-600">Celkové tržby</h3>
                  <p className="text-3xl font-bold text-yellow-900">€{platformStats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-pink-600">Mesačné tržby</h3>
                  <p className="text-3xl font-bold text-pink-900">€{platformStats.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Nedávna aktivita</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-green-600">✅</span>
                    <span>Nová reštaurácia "Dragon Palace" bola schválená</span>
                    <span className="text-sm text-gray-500 ml-auto">pred 2 hodinami</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600">📊</span>
                    <span>Mesačný report bol vygenerovaný</span>
                    <span className="text-sm text-gray-500 ml-auto">pred 4 hodinami</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-red-600">⚠️</span>
                    <span>Complaint proti "Bad Restaurant" bol vyriešený</span>
                    <span className="text-sm text-gray-500 ml-auto">včera</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'restaurants' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Správa reštaurácií</h2>
                <button className="bg-foxi-orange text-white px-4 py-2 rounded-lg hover:bg-foxi-orange-dark">
                  + Pridať reštauráciu
                </button>
              </div>
              
              <div className="space-y-4">
                {restaurants.map(restaurant => (
                  <div key={restaurant.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            restaurant.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {restaurant.status === 'active' ? 'Aktívne' : 'Čaká na schválenie'}
                          </span>
                        </div>
                        <p className="text-gray-600">Majiteľ: {restaurant.owner}</p>
                        <div className="flex space-x-4 text-sm text-gray-600 mt-2">
                          <span>📦 {restaurant.orders} objednávok</span>
                          <span>💰 €{restaurant.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-foxi-orange hover:text-foxi-orange-dark">
                          Upraviť
                        </button>
                        <button className="text-blue-600 hover:text-blue-700">
                          Zobraziť
                        </button>
                        {restaurant.status === 'pending' && (
                          <button className="text-green-600 hover:text-green-700">
                            Schváliť
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Správa používateľov</h2>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-600">Správa používateľov - v implementácii</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Všetky objednávky</h2>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-600">Správa objednávok - v implementácii</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Analytika a reporty</h2>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-600">Pokročilá analytika - v implementácii</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
