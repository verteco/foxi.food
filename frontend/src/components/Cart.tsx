import React, { useState } from 'react';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, removeFromCart, updateCartItemQuantity, createOrder } = useOrder();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    address: '',
    phone: '',
    specialInstructions: '',
  });

  const handleQuantityChange = (menuItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(menuItemId);
    } else {
      updateCartItemQuantity(menuItemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!deliveryData.address || !deliveryData.phone) {
      alert('Prosím vyplňte dodací adresu a telefon');
      return;
    }

    if (cart.length === 0) {
      alert('Váš košík je prázdný');
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        restaurant: cart[0]?.menu_item_details?.id || 1,
        items: cart.map(item => ({
          menu_item: item.menu_item,
          quantity: item.quantity,
          special_instructions: item.special_instructions || '',
        })),
        delivery_address: deliveryData.address,
        delivery_phone: deliveryData.phone,
        special_instructions: deliveryData.specialInstructions,
      };

      await createOrder(orderData);
      onClose();
      alert('Objednávka byla úspěšně vytvořena!');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Chyba při vytváření objednávky. Zkuste to znovu.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-lg font-semibold">Nákupní košík</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Váš košík je prázdný</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.menu_item} className="flex items-center space-x-3">
                    <img
                      src={item.menu_item_details.image || '/placeholder-food.jpg'}
                      alt={item.menu_item_details.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.menu_item_details.name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.menu_item_details.price} Kč
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.menu_item, item.quantity - 1)}
                        className="h-8 w-8 rounded-full bg-gray-200 text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.menu_item, item.quantity + 1)}
                        className="h-8 w-8 rounded-full bg-gray-200 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Form */}
          {cart.length > 0 && (
            <div className="border-t px-4 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dodací adresa
                  </label>
                  <input
                    type="text"
                    value={deliveryData.address}
                    onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Vaše adresa"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={deliveryData.phone}
                    onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Váš telefon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Poznámky
                  </label>
                  <textarea
                    value={deliveryData.specialInstructions}
                    onChange={(e) => setDeliveryData({ ...deliveryData, specialInstructions: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    rows={2}
                    placeholder="Speciální požadavky..."
                  />
                </div>

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Celkem:</span>
                  <span>{cartTotal.toFixed(2)} Kč</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
                >
                  {isCheckingOut ? 'Zpracovávám...' : 'Objednat'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
