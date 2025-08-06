import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Restaurant {
  id: number;
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
      const response = await axios.get('http://localhost:8000/api/restaurants/?ordering=name');
      setRestaurants(response.data.results?.slice(0, 6) || []); // Take first 6 restaurants
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Keep mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  const mockRestaurants = [
    {
      id: 1,
      name: 'Pizza Palazzo',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      deliveryTime: '25-35 min',
      deliveryFee: '2.50€',
      categories: ['Pizza', 'Talianské']
    },
    {
      id: 2,
      name: 'Sushi Master',
      image: '/api/placeholder/300/200',
      rating: 4.9,
      deliveryTime: '30-40 min',
      deliveryFee: '3.00€',
      categories: ['Sushi', 'Ázijské']
    },
    {
      id: 3,
      name: 'Burger Kingdom',
      image: '/api/placeholder/300/200',
      rating: 4.7,
      deliveryTime: '20-30 min',
      deliveryFee: '2.00€',
      categories: ['Burger', 'Americké']
    },
    {
      id: 4,
      name: 'Zdravé Chute',
      image: '/api/placeholder/300/200',
      rating: 4.6,
      deliveryTime: '35-45 min',
      deliveryFee: '2.90€',
      categories: ['Zdravé', 'Saláty']
    },
    {
      id: 5,
      name: 'Pasta Corner',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      deliveryTime: '25-35 min',
      deliveryFee: '2.50€',
      categories: ['Pasta', 'Talianské']
    },
    {
      id: 6,
      name: 'Pho Vietnam',
      image: '/api/placeholder/300/200',
      rating: 4.7,
      deliveryTime: '30-40 min',
      deliveryFee: '2.80€',
      categories: ['Vietnamské', 'Polievky']
    }
  ];

  // Use real restaurants if loaded, otherwise fallback to mock data
  const displayRestaurants = restaurants.length > 0 ? restaurants : mockRestaurants;

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
          {displayRestaurants.map((restaurant) => {
            // Check if this is API data or mock data
            const isApiData = 'cuisine_type' in restaurant;
            const restaurantData = restaurant as any;
            
            return (
              <div key={restaurant.id} className="restaurant-card">
                <div className="relative">
                  <img
                    src={isApiData 
                      ? (restaurantData.cover_image || '/api/placeholder/300/200')
                      : restaurantData.image
                    }
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  {!isApiData && restaurantData.rating && (
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-800 shadow-sm">
                      ⭐ {restaurantData.rating}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 text-sm">
                    {(restaurant as any).description || 'Skvělá restaurace s lahodným jídlem'}
                  </p>
                  
                  {/* Categories for API vs Mock data */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {isApiData ? (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                        {restaurantData.cuisine_type}
                      </span>
                    ) : (
                      restaurantData.categories?.map((category: string) => (
                        <span
                          key={category}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      {isApiData ? (
                        <>
                          <span>🚚 {restaurantData.delivery_fee}€</span>
                          <span>📦 Min. {restaurantData.minimum_order}€</span>
                        </>
                      ) : (
                        <>
                          <span>🕒 {restaurantData.deliveryTime}</span>
                          <span>🚚 {restaurantData.deliveryFee}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
