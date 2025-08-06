import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Static fallback categories
  const fallbackCategories = [
    { name: 'Pizza', image: '/api/placeholder/120/120', color: 'bg-red-100' },
    { name: 'Burger', image: '/api/placeholder/120/120', color: 'bg-yellow-100' },
    { name: 'Sushi', image: '/api/placeholder/120/120', color: 'bg-green-100' },
    { name: 'Pasta', image: '/api/placeholder/120/120', color: 'bg-orange-100' },
    { name: 'Ázijské', image: '/api/placeholder/120/120', color: 'bg-purple-100' },
    { name: 'Dezerty', image: '/api/placeholder/120/120', color: 'bg-pink-100' },
    { name: 'Zdravé', image: '/api/placeholder/120/120', color: 'bg-blue-100' },
    { name: 'Nápoje', image: '/api/placeholder/120/120', color: 'bg-indigo-100' },
  ];

  useEffect(() => {
    fetchCuisineTypes();
  }, []);

  const fetchCuisineTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/restaurants/');
      
      // Extract unique cuisine types from restaurants
      const cuisineTypes: string[] = Array.from(new Set(response.data.map((restaurant: any) => restaurant.cuisine_type)));
      
      // Map cuisine types to categories with colors
      const colors = [
        'bg-red-100', 'bg-yellow-100', 'bg-green-100', 'bg-orange-100',
        'bg-purple-100', 'bg-pink-100', 'bg-blue-100', 'bg-indigo-100'
      ];
      
      const dynamicCategories = cuisineTypes.map((cuisineType: string, index: number) => ({
        name: cuisineType,
        image: '/api/placeholder/120/120',
        color: colors[index % colors.length]
      }));
      
      setCategories(dynamicCategories);
    } catch (error) {
      console.error('Error fetching cuisine types:', error);
      // Use fallback categories if API fails
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  // Use dynamic categories if loaded, otherwise use fallback
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Populárne kategórie
          </h2>
          <p className="text-lg text-gray-600">
            Vyber si zo širokej ponuky kategórií jedla
          </p>
        </div>
        
        {loading && (
          <div className="text-center text-gray-600 mb-8">
            <p>Načítavam kategórie...</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {displayCategories.map((category) => (
            <div
              key={category.name}
              className="group cursor-pointer text-center"
            >
              <div className={`${category.color} rounded-2xl p-6 mb-3 group-hover:scale-105 transition-transform duration-200`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 mx-auto object-cover rounded-full"
                />
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-foxi-orange transition-colors">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodCategories;
