import React, { useState } from 'react';

interface FoodItemModalProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    ingredients?: string[];
    allergens?: string[];
  };
  onClose: () => void;
  onAddToCart: (item: any, quantity: number) => void;
}

const FoodItemModal: React.FC<FoodItemModalProps> = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleAddToCart = () => {
    onAddToCart({ ...item, specialInstructions }, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
            <span className="text-2xl font-bold text-foxi-orange">€{item.price.toFixed(2)}</span>
          </div>

          <p className="text-gray-600 mb-6">{item.description}</p>

          {/* Ingredients */}
          {item.ingredients && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Ingrediencie:</h3>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Alergény:</h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen, index) => (
                  <span
                    key={index}
                    className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm border border-red-200"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-900 mb-2">
              Špeciálne pokyny (voliteľné):
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Napríklad: bez cibuľky, extra syr..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foxi-orange resize-none"
              rows={3}
            />
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-900">Množstvo:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary text-lg px-8"
            >
              Pridať za €{(item.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItemModal;
