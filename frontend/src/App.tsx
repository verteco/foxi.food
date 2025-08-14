import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RestaurantProvider } from './contexts/RestaurantContext';
import { MenuProvider } from './contexts/MenuContext';
import { OrderProvider } from './contexts/OrderContext';
import { RoleProvider } from './contexts/RoleContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import OrderPage from './pages/OrderPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RestaurantSignupPage from './pages/RestaurantSignupPage';
// Role-based Dashboards
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantOwnerDashboard from './pages/RestaurantOwnerDashboard';
import RestaurantEmployeeDashboard from './pages/RestaurantEmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
// Footer Pages
import {
  PreZakaznikovPage,
  PrePartnerovPage,
  PreKurierovPage,
  CasteOtazkyPage,
  PodporaPage,
  OnlineUcetPage,
  PonukyANovinkyPage,
  KontaktPage,
  KarieraPage,
  MediaPage,
  ObchodnePodmienkyPage,
  OchranaUdajovPage,
  ONasPage,
  AkoToFungujePage,
  BlogPage,
  RegistraciaPage,
  DashboardPage,
  CenyPage
} from './pages/FooterPages';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <RestaurantProvider>
          <MenuProvider>
            <OrderProvider>
              <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/restaurants" element={<RestaurantsPage />} />
                  <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/restaurant-signup" element={<RestaurantSignupPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/order" 
                    element={
                      <ProtectedRoute>
                        <OrderPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Role-based Dashboard Routes */}
                  <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                  <Route path="/owner-dashboard" element={<RestaurantOwnerDashboard />} />
                  <Route path="/employee-dashboard" element={<RestaurantEmployeeDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  
                  {/* Legacy dashboard route */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute requireOwner={true}>
                        <RestaurantDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Footer Pages */}
                  {/* Customer Links */}
                  <Route path="/pre-zakaznikov" element={<PreZakaznikovPage />} />
                  <Route path="/pre-partnerov" element={<PrePartnerovPage />} />
                  <Route path="/pre-kurierov" element={<PreKurierovPage />} />
                  
                  {/* Useful Links */}
                  <Route path="/caste-otazky" element={<CasteOtazkyPage />} />
                  <Route path="/podpora" element={<PodporaPage />} />
                  <Route path="/online-ucet" element={<OnlineUcetPage />} />
                  <Route path="/ponuky-a-novinky" element={<PonukyANovinkyPage />} />
                  
                  {/* Business Links */}
                  <Route path="/kontakt" element={<KontaktPage />} />
                  <Route path="/kariera" element={<KarieraPage />} />
                  <Route path="/media" element={<MediaPage />} />
                  <Route path="/obchodne-podmienky" element={<ObchodnePodmienkyPage />} />
                  <Route path="/ochrana-udajov" element={<OchranaUdajovPage />} />
                  
                  {/* Additional Pages */}
                  <Route path="/o-nas" element={<ONasPage />} />
                  <Route path="/ako-to-funguje" element={<AkoToFungujePage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/registracia" element={<RegistraciaPage />} />
                  <Route path="/ceny" element={<CenyPage />} />
                </Routes>
              </div>
            </Router>
          </OrderProvider>
        </MenuProvider>
      </RestaurantProvider>
    </RoleProvider>
    </AuthProvider>
  );
}

export default App;
