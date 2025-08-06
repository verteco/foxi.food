import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RestaurantSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Basic Info
    restaurantName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Restaurant Details
    address: '',
    city: '',
    postalCode: '',
    cuisine: '',
    description: '',
    // Business Info
    businessLicense: '',
    taxId: '',
    bankAccount: '',
    // Contact Person
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    // Terms
    agreeToTerms: false,
    agreeToDataProcessing: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (step < 4) {
      // Validate current step before proceeding
      if (!validateStep()) {
        setError('Prosím vyplnte všetky povinné polia.');
        return;
      }
      setStep(step + 1);
    } else {
      // Final step - submit registration
      if (!validateStep()) {
        setError('Prosím vyplnte všetky povinné polia a súhlaste s podmienkami.');
        return;
      }
      
      setLoading(true);
      
      try {
        const registrationData = {
          restaurant_name: formData.restaurantName,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          owner_name: formData.contactName || 'Restaurant Owner',
          phone: formData.phone,
          address: `${formData.address}, ${formData.city} ${formData.postalCode}`,
          cuisine_type: formData.cuisine,
          description: formData.description
        };
        
        const response = await axios.post('http://localhost:8000/api/auth/register-restaurant/', registrationData);
        
        // Save authentication token
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Show success message and redirect
        alert('Úspech! Vaša reštaurácia bola zaregistrovaná. Presmerujeme vás na dashboard.');
        navigate('/restaurant-dashboard');
        
      } catch (err: any) {
        console.error('Registration error:', err);
        setError(
          err.response?.data?.error || 
          'Registrácia zlyhala. Skúste to znovu.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.restaurantName && formData.email && formData.password && formData.confirmPassword && formData.phone;
      case 2:
        return formData.address && formData.city && formData.postalCode && formData.cuisine;
      case 3:
        return formData.businessLicense && formData.taxId;
      case 4:
        return formData.contactName && formData.contactPhone && formData.agreeToTerms && formData.agreeToDataProcessing;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Základné informácie</h2>
            
            <div>
              <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-2">
                Názov reštaurácie *
              </label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                required
                value={formData.restaurantName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="Názov vašej reštaurácie"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="vas@email.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Heslo *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Potvrdiť heslo *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefón *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="+421 123 456 789"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Adresa a detaily reštaurácie</h2>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adresa *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="Ulica a číslo domu"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Mesto *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                  placeholder="Bratislava"
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  PSČ *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                  placeholder="12345"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                Typ kuchyne *
              </label>
              <select
                id="cuisine"
                name="cuisine"
                required
                value={formData.cuisine}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
              >
                <option value="">Vyberte typ kuchyne</option>
                <option value="slovak">Slovenská</option>
                <option value="italian">Talianska</option>
                <option value="chinese">Čínska</option>
                <option value="indian">Indická</option>
                <option value="mexican">Mexická</option>
                <option value="pizza">Pizza</option>
                <option value="burger">Burger</option>
                <option value="sushi">Sushi</option>
                <option value="healthy">Zdravé jedlo</option>
                <option value="dessert">Dezerty</option>
                <option value="other">Iné</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Popis reštaurácie
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="Stručne opíšte vašu reštauráciu, špecialitami a atmosférou..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Obchodné údaje</h2>
            
            <div>
              <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700 mb-2">
                Číslo živnostenského oprávnenia *
              </label>
              <input
                type="text"
                id="businessLicense"
                name="businessLicense"
                required
                value={formData.businessLicense}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="123-456789"
              />
            </div>

            <div>
              <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
                DIČ *
              </label>
              <input
                type="text"
                id="taxId"
                name="taxId"
                required
                value={formData.taxId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="1234567890"
              />
            </div>

            <div>
              <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-2">
                Číslo bankového účtu
              </label>
              <input
                type="text"
                id="bankAccount"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="SK89 1234 5678 9012 3456 7890"
              />
              <p className="text-sm text-gray-500 mt-1">
                Účet pre vyplatenie tržieb z objednávok
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Kontaktná osoba a dokončenie</h2>
            
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                Meno kontaktnej osoby *
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                required
                value={formData.contactName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="Meno Priezvisko"
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefón kontaktnej osoby *
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                required
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="+421 123 456 789"
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email kontaktnej osoby
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                placeholder="kontakt@restauracia.sk"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-foxi-orange border-gray-300 rounded focus:ring-foxi-orange mt-1"
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600">
                  Súhlasím s{' '}
                  <Link to="/terms" className="text-foxi-orange hover:text-orange-600">
                    obchodnými podmienkami
                  </Link>{' '}
                  a{' '}
                  <Link to="/privacy" className="text-foxi-orange hover:text-orange-600">
                    zásadami ochrany osobných údajov
                  </Link>
                  . *
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="agreeToDataProcessing"
                  name="agreeToDataProcessing"
                  type="checkbox"
                  required
                  checked={formData.agreeToDataProcessing}
                  onChange={handleChange}
                  className="w-4 h-4 text-foxi-orange border-gray-300 rounded focus:ring-foxi-orange mt-1"
                />
                <label htmlFor="agreeToDataProcessing" className="ml-2 text-sm text-gray-600">
                  Súhlasím so spracovaním osobných údajov za účelom registrácie reštaurácie a poskytovaním služieb. *
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Registrácia reštaurácie
            </h1>
            <p className="text-gray-600">
              Staňte sa naším partnerom a začnite prijímať objednávky online
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNumber <= step
                      ? 'bg-foxi-orange text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-foxi-orange h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Základné údaje</span>
              <span>Reštaurácia</span>
              <span>Obchodné údaje</span>
              <span>Dokončenie</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Späť
                </button>
              )}
              
              <button
                type="submit"
                disabled={!validateStep()}
                className={`px-6 py-3 rounded-lg font-medium ${
                  validateStep()
                    ? 'bg-foxi-orange text-white hover:bg-orange-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } ${step === 1 ? 'ml-auto' : ''}`}
              >
                {step === 4 ? 'Registrovať reštauráciu' : 'Pokračovať'}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Už máte účet?{' '}
              <Link to="/login" className="text-foxi-orange hover:text-orange-600 font-medium">
                Prihláste sa
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantSignupPage;
