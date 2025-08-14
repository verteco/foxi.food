import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
            <p className="text-lg text-gray-600 mb-6">
              {description || 'Obsah tejto stránky sa momentálne pripravuje. Ďakujeme za trpezlivosť.'}
            </p>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Ilustračný obsah<br />
                <span className="text-sm">Táto stránka bude čoskoro aktualizovaná</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlaceholderPage;
