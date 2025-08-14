import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

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

const PopularRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await apiClient.get('/api/restaurants/', { params: { ordering: 'name' } });
      setRestaurants(response.data.results?.slice(0, 6) || []); // Take first 6 restaurants
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Populárne reštaurácie
          </h2>
          <p className="text-lg text-gray-600">
            Najlepšie reštaurácie vo vašom okolí
          </p>
        </div>
        
        {loading && (
          <div className="text-center text-gray-600 mb-8">
            <p>Načítavam reštaurácie...</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-600">
              Žiadne reštaurácie neboli nájdené.
            </div>
          )}
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card">
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
                
                <p className="text-gray-600 mb-3 text-sm">
                  {restaurant.description || 'Skvelá reštaurácia s lahodným jedlom'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {restaurant.cuisine_type && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                      {restaurant.cuisine_type}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span>🚚 {restaurant.delivery_fee}€</span>
                    <span>📦 Min. {restaurant.minimum_order}€</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="/restaurants" className="btn-secondary">
            Zobraziť všetky reštaurácie
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularRestaurants;
