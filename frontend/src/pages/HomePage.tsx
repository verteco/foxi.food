import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FoodCategories from '../components/FoodCategories';
import PopularRestaurants from '../components/PopularRestaurants';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <FoodCategories />
      <PopularRestaurants />
      <Footer />
    </div>
  );
};

export default HomePage;
