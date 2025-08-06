import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: delivery info, 2: payment, 3: confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderCreated, setOrderCreated] = useState<any>(null);
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryNotes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Get restaurant ID from URL params
  const restaurantId = searchParams.get('restaurant') || '1';

  // Mock cart data
  const cartItems = [
    {
      id: 1,
      name: 'Pizza Margherita',
      price: 8.90,
      quantity: 2,
      restaurant: 'Pizza Palazzo',
      specialInstructions: 'Extra bazalka'
    },
    {
      id: 2,
      name: 'Caesar Šalát',
      price: 9.50,
      quantity: 1,
      restaurant: 'Pizza Palazzo'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.50;
  const total = subtotal + deliveryFee;

  const handleDeliveryInfoChange = (field: string, value: string) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prepare customer data
      const customerData = {
        name: `${deliveryInfo.firstName} ${deliveryInfo.lastName}`,
        email: deliveryInfo.email,
        phone: deliveryInfo.phone,
        address: `${deliveryInfo.address}, ${deliveryInfo.city} ${deliveryInfo.postalCode}`
      };
      
      // Prepare items data (mock menu item IDs for now)
      const itemsData = cartItems.map(item => ({
        menu_item_id: item.id, // This should match actual menu item IDs
        quantity: item.quantity,
        special_instructions: item.specialInstructions || ''
      }));
      
      // Prepare order data
      const orderData = {
        restaurant: parseInt(restaurantId),
        delivery_address: `${deliveryInfo.address}, ${deliveryInfo.city} ${deliveryInfo.postalCode}`,
        delivery_phone: deliveryInfo.phone,
        delivery_notes: deliveryInfo.deliveryNotes,
        customer_data: customerData,
        items_data: itemsData
      };
      
      // Submit order to backend
      const response = await axios.post('http://localhost:8000/api/orders/', orderData);
      
      // Order created successfully
      setOrderCreated(response.data);
      setStep(3);
      
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(
        err.response?.data?.error || 
        'Chyba pri vytváraní objednávky. Skúste to znovu.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-foxi-orange' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 1 ? 'border-foxi-orange bg-foxi-orange text-white' : 'border-gray-300'
                }`}>
                  1
                </div>
                <span className="ml-2 font-medium">Doručenie</span>
              </div>
              
              <div className={`w-8 h-1 ${step >= 2 ? 'bg-foxi-orange' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${step >= 2 ? 'text-foxi-orange' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 2 ? 'border-foxi-orange bg-foxi-orange text-white' : 'border-gray-300'
                }`}>
                  2
                </div>
                <span className="ml-2 font-medium">Platba</span>
              </div>
              
              <div className={`w-8 h-1 ${step >= 3 ? 'bg-foxi-orange' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${step >= 3 ? 'text-foxi-orange' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 3 ? 'border-foxi-orange bg-foxi-orange text-white' : 'border-gray-300'
                }`}>
                  3
                </div>
                <span className="ml-2 font-medium">Potvrdenie</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Information */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informácie o doručení</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meno</label>
                    <input
                      type="text"
                      value={deliveryInfo.firstName}
                      onChange={(e) => handleDeliveryInfoChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priezvisko</label>
                    <input
                      type="text"
                      value={deliveryInfo.lastName}
                      onChange={(e) => handleDeliveryInfoChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefón</label>
                    <input
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={(e) => handleDeliveryInfoChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={deliveryInfo.email}
                      onChange={(e) => handleDeliveryInfoChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresa</label>
                  <input
                    type="text"
                    value={deliveryInfo.address}
                    onChange={(e) => handleDeliveryInfoChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                    placeholder="Ulica a číslo domu"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mesto</label>
                    <input
                      type="text"
                      value={deliveryInfo.city}
                      onChange={(e) => handleDeliveryInfoChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PSČ</label>
                    <input
                      type="text"
                      value={deliveryInfo.postalCode}
                      onChange={(e) => handleDeliveryInfoChange('postalCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poznámky pre doručovateľa (voliteľné)</label>
                  <textarea
                    value={deliveryInfo.deliveryNotes}
                    onChange={(e) => handleDeliveryInfoChange('deliveryNotes', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange resize-none"
                    rows={3}
                    placeholder="Napríklad: 3. poschodie, dvere vľavo..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Spôsob platby</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="border border-gray-300 rounded-lg p-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="font-medium">Platobná karta</span>
                        <div className="ml-3 flex space-x-2">
                          <img src="/api/placeholder/40/25" alt="Visa" className="h-6" />
                          <img src="/api/placeholder/40/25" alt="Mastercard" className="h-6" />
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span className="font-medium">Hotovosť pri doručení</span>
                    </label>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="font-medium">PayPal</span>
                        <img src="/api/placeholder/60/25" alt="PayPal" className="ml-3 h-6" />
                      </div>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Údaje o karte</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Číslo karty</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Platnosť</label>
                          <input
                            type="text"
                            placeholder="MM/RR"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Objednávka prijatá!</h2>
                <p className="text-gray-600 mb-6">
                  Ďakujeme za vašu objednávku. Číslo objednávky je <strong>#12345</strong>
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    Odhadovaný čas doručenia: <strong>25-35 minút</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Sledovať objednávku môžete v sekcii "Moje objednávky"
                  </p>
                </div>
                <button className="btn-primary">
                  Sledovať objednávku
                </button>
              </div>
            )}

            {/* Navigation buttons */}
            {step < 3 && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevStep}
                  className={`btn-secondary ${step === 1 ? 'invisible' : ''}`}
                >
                  Späť
                </button>
                <button
                  onClick={step === 2 ? handlePlaceOrder : handleNextStep}
                  className="btn-primary"
                >
                  {step === 2 ? 'Objednať' : 'Pokračovať'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Súhrn objednávky</h3>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.quantity}x €{item.price}</p>
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-500 italic">{item.specialInstructions}</p>
                      )}
                    </div>
                    <span className="font-semibold text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Medzisúčet:</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Doručenie:</span>
                  <span>€{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                  <span>Celkom:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Odhadovaný čas doručenia:</strong><br />
                  25-35 minút
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderPage;
