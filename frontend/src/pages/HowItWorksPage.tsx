import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ako to funguje
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Objednávanie jedla cez Foxi.food je jednoduché. Stačí vybrať, objednať a vychutnať si svoje obľúbené jedlo.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-foxi-orange w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Vyberte reštauráciu
            </h3>
            <p className="text-gray-600">
              Prehliadajte si ponuku našich partnerských reštaurácií a vyberte si tú, ktorá vás zaujme.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-foxi-orange w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Objednajte jedlo
            </h3>
            <p className="text-gray-600">
              Vyberte si jedlá z menu, pridajte ich do košíka a dokončite objednávku s vašimi údajmi.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-foxi-orange w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Vychutnajte si jedlo
            </h3>
            <p className="text-gray-600">
              Jedlo vám doručíme priamo k dverám alebo si ho môžete vyzdvihnúť v reštaurácii.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Prečo si vybrať Foxi.food?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-foxi-orange text-4xl mb-4">🚚</div>
              <h4 className="font-semibold text-gray-900 mb-2">Rýchle doručenie</h4>
              <p className="text-sm text-gray-600">Doručenie do 30-45 minút</p>
            </div>
            
            <div className="text-center">
              <div className="text-foxi-orange text-4xl mb-4">💳</div>
              <h4 className="font-semibold text-gray-900 mb-2">Bezpečné platby</h4>
              <p className="text-sm text-gray-600">Kartou alebo v hotovosti</p>
            </div>
            
            <div className="text-center">
              <div className="text-foxi-orange text-4xl mb-4">⭐</div>
              <h4 className="font-semibold text-gray-900 mb-2">Kvalitné reštaurácie</h4>
              <p className="text-sm text-gray-600">Overené partnerské reštaurácie</p>
            </div>
            
            <div className="text-center">
              <div className="text-foxi-orange text-4xl mb-4">📱</div>
              <h4 className="font-semibold text-gray-900 mb-2">Jednoduché objednávanie</h4>
              <p className="text-sm text-gray-600">Intuitívne a rýchle</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Často kladené otázky
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Aké sú náklady na doručenie?
              </h4>
              <p className="text-gray-600">
                Poplatky za doručenie sa líšia podľa reštaurácie a vzdialenosti. Presná suma sa zobrazí pri dokončovaní objednávky.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Môžem svoju objednávku zrušiť?
              </h4>
              <p className="text-gray-600">
                Objednávku je možné zrušiť do 5 minút od jej odoslania. Po tomto čase kontaktujte reštauráciu priamo.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Ako môžem sledovať svoju objednávku?
              </h4>
              <p className="text-gray-600">
                Po odoslaní objednávky dostanete SMS s odkazom na sledovanie stavu objednávky v reálnom čase.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
