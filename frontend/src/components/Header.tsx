import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { useRole } from '../contexts/RoleContext';
import Cart from './Cart';
import RoleSwitcher from './RoleSwitcher';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount } = useOrder();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <span className="text-2xl font-bold text-orange-500">Foxi.food</span>
              </Link>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-orange-500 font-medium">
                Domov
              </Link>
              <Link to="/restaurants" className="text-gray-600 hover:text-orange-500 font-medium">
                Restaurace
              </Link>
              <Link to="/how-it-works" className="text-gray-600 hover:text-orange-500 font-medium">
                Jak to funguje
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-orange-500 font-medium">
                Kontakt
              </Link>
            </nav>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-4">
              {/* Cart button */}
              {isAuthenticated && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-gray-600 hover:text-orange-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L5 7m2 6v6a1 1 0 001 1h8a1 1 0 001-1v-6M9 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </button>
              )}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Ahoj, {user?.first_name || user?.username}</span>
                  {user?.is_restaurant_owner && (
                    <Link to="/dashboard" className="text-gray-600 hover:text-orange-500 font-medium">
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-orange-500 font-medium"
                  >
                    Odhlásit se
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-orange-500 font-medium">
                    Přihlásit se
                  </Link>
                  <Link to="/restaurant-signup" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                    Registrace restaurace
                  </Link>
                </>
              )}
            </div>
          
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Cart component */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
