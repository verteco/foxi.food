import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Restaurant {
  id: number;
  slug?: string;
  name: string;
  description: string;
  cuisine_type: string;
  delivery_fee: string;
  minimum_order: string;
  logo: string | null;
  cover_image: string | null;
  is_active: boolean;
  is_accepting_orders: boolean;
}

const RestaurantsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/restaurants/');
      setRestaurants(response.data.results || []);
    } catch (err) {
      setError('Chyba pri načítavaní reštaurácií');
      console.error('Error fetching reštaurácií:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(restaurants.map(r => r.cuisine_type)))];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (selectedCategory === 'all') return true;
    return restaurant.cuisine_type === selectedCategory;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'delivery_fee':
        if ('delivery_fee' in a && 'delivery_fee' in b) {
          return parseFloat(a.delivery_fee) - parseFloat(b.delivery_fee);
        }
        return 0;
      case 'minimum_order':
        if ('minimum_order' in a && 'minimum_order' in b) {
          return parseFloat(a.minimum_order) - parseFloat(b.minimum_order);
        }
        return 0;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Reštaurácie vo vašom okolí
            </h1>
            <p className="text-lg text-gray-600">
              Objavte najlepšie reštaurácie a objednajte si svoje obľúbené jedlo
            </p>
          </div>

          {/* Search and Address */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Hľadať reštaurácie..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Zadajte adresu doručenia"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                  />
                </div>
                <button className="btn-primary">
                  Hľadať
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-foxi-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'Všetky' : category}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
            >
              <option value="name">Podľa názvu</option>
              <option value="delivery_fee">Najnižší poplatok za doručenie</option>
              <option value="minimum_order">Najnižšia minimálna objednávka</option>
            </select>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-lg text-gray-600">Načítavam reštaurácie...</div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-lg text-red-600">{error}</div>
            <button 
              onClick={fetchRestaurants}
              className="mt-4 btn-primary"
            >
              Skúsiť znova
            </button>
          </div>
        </section>
      )}

      {/* Restaurants Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedRestaurants.length === 0 && !loading && !error && (
            <div className="text-center text-gray-600">
              <p className="text-lg">Žiadne reštaurácie neboli nájdené.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedRestaurants.map((restaurant) => {
              const isOpen = restaurant.is_accepting_orders;
              const slug = restaurant.slug || restaurant.id;
              
              return (
                <div key={restaurant.id} className="restaurant-card bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md relative">
                  {isOpen ? (
                    <Link to={`/restaurant/${slug}`} className="block">
                      <div className="relative">
                        <img
                          src={restaurant.cover_image || '/api/placeholder/300/200'}
                          alt={restaurant.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {restaurant.name}
                        </h3>
                        
                        <p className="text-gray-600 mb-3">
                          {restaurant.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {restaurant.cuisine_type && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                              {restaurant.cuisine_type}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-4">
                            <span>🚚 {restaurant.delivery_fee}€</span>
                            <span>📦 Min. {restaurant.minimum_order}€</span>
                          </div>
                        </div>

                        <div className="block w-full text-center py-3 rounded-lg font-semibold transition-colors bg-foxi-orange hover:bg-orange-600 text-white">
                          Zobraziť menu
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="relative">
                        <img
                          src={restaurant.cover_image || '/api/placeholder/300/200'}
                          alt={restaurant.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                          <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                            Zatvorené
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {restaurant.name}
                        </h3>
                        
                        <p className="text-gray-600 mb-3">
                          {restaurant.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {restaurant.cuisine_type && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                              {restaurant.cuisine_type}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-4">
                            <span>🚚 {restaurant.delivery_fee}€</span>
                            <span>📦 Min. {restaurant.minimum_order}€</span>
                          </div>
                        </div>

                        <div className="w-full py-3 rounded-lg font-semibold transition-colors bg-gray-200 text-gray-500 cursor-not-allowed text-center">
                          Zatvorené
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RestaurantsPage;
