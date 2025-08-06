import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    alert('Ďakujeme za vašu správu! Odpovieme vám čo najskôr.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kontaktujte nás
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Máte otázky alebo potrebujete pomoc? Sme tu pre vás. Kontaktujte nás kedykoľvek.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Napíšte nám
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Meno a priezvisko *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                  placeholder="Vaše meno"
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

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Predmet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                >
                  <option value="">Vyberte predmet</option>
                  <option value="general">Všeobecný dotaz</option>
                  <option value="order">Problém s objednávkou</option>
                  <option value="restaurant">Registrácia reštaurácie</option>
                  <option value="technical">Technický problém</option>
                  <option value="partnership">Partnerstvo</option>
                  <option value="other">Iné</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Správa *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foxi-orange focus:border-transparent"
                  placeholder="Napíšte nám vašu správu..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Odoslať správu
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Kontaktné údaje
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 text-foxi-orange mt-1">
                    📧
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">info@foxi.food</p>
                    <p className="text-gray-600">podpora@foxi.food</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 text-foxi-orange mt-1">
                    📞
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Telefón</h4>
                    <p className="text-gray-600">+421 123 456 789</p>
                    <p className="text-sm text-gray-500">Pondelok - Piatok: 9:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 text-foxi-orange mt-1">
                    📍
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Adresa</h4>
                    <p className="text-gray-600">
                      Technologická 1<br />
                      841 04 Bratislava<br />
                      Slovenská republika
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Rýchle odpovede
              </h3>
              <div className="space-y-3">
                <a href="/how-it-works" className="block text-foxi-orange hover:text-orange-600">
                  → Ako to funguje?
                </a>
                <a href="#" className="block text-foxi-orange hover:text-orange-600">
                  → Časté otázky (FAQ)
                </a>
                <a href="#" className="block text-foxi-orange hover:text-orange-600">
                  → Obchodné podmienky
                </a>
                <a href="#" className="block text-foxi-orange hover:text-orange-600">
                  → Ochrana osobných údajov
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Otváracie hodiny podpory
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pondelok - Piatok</span>
                  <span className="text-gray-900">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sobota</span>
                  <span className="text-gray-900">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nedeľa</span>
                  <span className="text-gray-900">Zatvorené</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
