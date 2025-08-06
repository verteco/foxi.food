import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  cuisine_type: string;
  opening_hours: any;
  delivery_fee: string;
  minimum_order: string;
  delivery_radius: number;
  logo?: string;
  cover_image?: string;
  is_active: boolean;
  is_accepting_orders: boolean;
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
  description: string;
  items: MenuItem[];
  is_active: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
  is_available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  variations: MenuItemVariation[];
}

interface MenuItemVariation {
  id: number;
  name: string;
  price_adjustment: string;
  is_available: boolean;
}

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchRestaurant(id);
    }
  }, [id]);

  const fetchRestaurant = async (restaurantId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/restaurants/${restaurantId}/`);
      setRestaurantData(response.data);
    } catch (err) {
      setError('Reštaurácia nebola nájdená');
      console.error('Error fetching restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data as fallback
  const mockRestaurant = {
    id: 1,
    name: 'Pizza Palazzo',
    image: '/api/placeholder/800/300',
    coverImage: '/api/placeholder/800/300',
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: '25-35 min',
    deliveryFee: '2.50€',
    minimumOrder: '15.00€',
    categories: ['Pizza', 'Talianské'],
    description: 'Autentické talianske pizze pečené v kamennej peci. Používame len najčerstvejšie ingrediencie a tradičné recepty.',
    address: 'Hlavná 123, Bratislava',
    phone: '+421 123 456 789',
    isOpen: true,
    openingHours: {
      monday: '11:00 - 22:00',
      tuesday: '11:00 - 22:00',
      wednesday: '11:00 - 22:00',
      thursday: '11:00 - 22:00',
      friday: '11:00 - 23:00',
      saturday: '12:00 - 23:00',
      sunday: '12:00 - 22:00'
    }
  };

  // Menu categories will be computed from API data or fallback

  const menuItems = [
    {
      id: 1,
      name: 'Pizza Margherita',
      description: 'Klasická pizza s paradajkovou omáčkou, mozzarellou a čerstvou bazalkou',
      price: 8.90,
      image: '/api/placeholder/300/200',
      category: 'Pizza',
      ingredients: ['Paradajková omáčka', 'Mozzarella', 'Čerstvá bazalka', 'Olivový olej'],
      allergens: ['Lepok', 'Mlieko'],
      isVegetarian: true,
      isPopular: true
    },
    {
      id: 2,
      name: 'Pizza Prosciutto',
      description: 'Pizza s paradajkovou omáčkou, mozzarellou a prosciutto di Parma',
      price: 12.90,
      image: '/api/placeholder/300/200',
      category: 'Pizza',
      ingredients: ['Paradajková omáčka', 'Mozzarella', 'Prosciutto di Parma', 'Rukola'],
      allergens: ['Lepok', 'Mlieko']
    },
    {
      id: 3,
      name: 'Caesar Šalát',
      description: 'Klasický caesar šalát s kuracím mäsom, parmazánom a krutónmi',
      price: 9.50,
      image: '/api/placeholder/300/200',
      category: 'Šaláty',
      ingredients: ['Ľadový šalát', 'Kuracie mäso', 'Parmazán', 'Krutóny', 'Caesar dresing'],
      allergens: ['Lepok', 'Mlieko', 'Vajcia']
    },
    {
      id: 4,
      name: 'Bruschetta',
      description: 'Grilovaný chlieb s čerstvými paradajkami, bazalkou a cesnakom',
      price: 6.50,
      image: '/api/placeholder/300/200',
      category: 'Predjedlá',
      ingredients: ['Ciabatta', 'Čerstvé paradajky', 'Bazalka', 'Cesnak', 'Olivový olej'],
      allergens: ['Lepok'],
      isVegetarian: true
    },
    {
      id: 5,
      name: 'Tiramisu',
      description: 'Klasický taliansky dezert s mascarpone a kávou',
      price: 5.90,
      image: '/api/placeholder/300/200',
      category: 'Dezerty',
      ingredients: ['Mascarpone', 'Káva', 'Kakaový prášok', 'Savoiardi'],
      allergens: ['Mlieko', 'Vajcia', 'Lepok']
    },
    {
      id: 6,
      name: 'Coca Cola',
      description: 'Osviežujúci nápoj 0.33L',
      price: 2.50,
      image: '/api/placeholder/300/200',
      category: 'Nápoje'
    }
  ];

  const addToCart = (item: any, selectedVariations: any[] = []) => {
    const cartItem = {
      id: Date.now(),
      item,
      variations: selectedVariations,
      quantity: 1
    };
    setCart([...cart, cartItem]);
  };

  // Use API data if available, otherwise use mock data
  const restaurant = restaurantData || mockRestaurant;
  const menuCategories = restaurantData?.categories?.map(cat => cat.name) || ['all', 'Pizza', 'Predjedlá', 'Šaláty', 'Cestoviny', 'Dezerty', 'Nápoje'];
  const allMenuItems = restaurantData?.categories?.flatMap(cat => cat.items) || menuItems;
  
  const filteredMenuItems = (allMenuItems as any[]).filter((item: any) => {
    if (selectedCategory === 'all') return true;
    // For API data, find the category this item belongs to
    if (restaurantData) {
      const itemCategory = restaurantData.categories?.find(cat => cat.items.some(i => i.id === item.id));
      return itemCategory?.name === selectedCategory;
    }
    // For mock data, use category property
    return (item as any).category === selectedCategory;
  });

  const cartTotal = cart.reduce((total: number, cartItem: any) => {
    const itemPrice = typeof cartItem.item.price === 'string' ? parseFloat(cartItem.item.price) : cartItem.item.price;
    return total + (itemPrice * cartItem.quantity);
  }, 0);
  const cartItemCount = cart.reduce((total: number, cartItem: any) => total + cartItem.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Načítavam reštauráciu...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="btn-primary"
            >
              Späť
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Restaurant Header */}
      <section className="relative">
        <img
          src={(restaurant as any).cover_image || (restaurant as any).coverImage || '/api/placeholder/800/300'}
          alt={restaurant.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                ⭐ {(restaurant as any).rating || '4.5'} ({(restaurant as any).reviewCount || '0'} hodnotení)
              </span>
              <span>🕒 {(restaurant as any).deliveryTime || '30-45 min'}</span>
              <span>🚚 {(restaurant as any).deliveryFee || (restaurant as any).delivery_fee || '2.50'}€</span>
              <span>📦 Min. objednávka {(restaurant as any).minimumOrder || (restaurant as any).minimum_order || '15.00'}€</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Content */}
          <div className="lg:col-span-3">
            {/* Restaurant Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">O reštaurácii</h2>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Adresa:</p>
                  <p className="text-gray-600">{restaurant.address}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Telefón:</p>
                  <p className="text-gray-600">{restaurant.phone}</p>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-wrap gap-2">
                {menuCategories.map((category) => (
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
            </div>

            {/* Menu Items */}
            <div className="space-y-6">
              {filteredMenuItems.map((item: any) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-32 md:h-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {item.name}
                          {item.isPopular && (
                            <span className="bg-foxi-orange text-white text-xs px-2 py-1 rounded-full">
                              Populárne
                            </span>
                          )}
                          {item.isVegetarian && (
                            <span className="text-green-600 text-xs">🌱</span>
                          )}
                        </h3>
                        <span className="text-xl font-bold text-foxi-orange">
                          €{parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      
                      {item.ingredients && (
                        <p className="text-sm text-gray-500 mb-3">
                          <strong>Ingrediencie:</strong> {item.ingredients.join(', ')}
                        </p>
                      )}
                      
                      {item.allergens && (
                        <p className="text-sm text-red-600 mb-3">
                          <strong>Alergény:</strong> {item.allergens.join(', ')}
                        </p>
                      )}
                      
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="btn-primary"
                      >
                        Pridať do košíka
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Váš košík ({cartItemCount})
              </h3>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Váš košík je prázdny
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.quantity}x €{item.price}</p>
                        </div>
                        <span className="font-semibold text-gray-900">
                          €{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Medzisúčet:</span>
                      <span className="font-semibold">€{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Poplatky za doručenie:</span>
                      <span className="font-semibold">{(restaurant as any).deliveryFee || (restaurant as any).delivery_fee || '2.50'}€</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Celkom:</span>
                      <span>€{(cartTotal + 2.50).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    className="w-full btn-primary"
                    disabled={cartTotal < 15}
                  >
                    {cartTotal < 15 
                      ? `Min. objednávka ${(restaurant as any).minimumOrder || (restaurant as any).minimum_order || '15.00'}€`
                      : 'Pokračovať k objednávke'
                    }
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Food Item Modal - To be implemented */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedItem.name}</h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">{selectedItem.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">€{parseFloat(selectedItem.price).toFixed(2)}</span>
              <button 
                onClick={() => {
                  addToCart(selectedItem);
                  setSelectedItem(null);
                }}
                className="btn-primary"
              >
                Pridať do košíka
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RestaurantDetailPage;
