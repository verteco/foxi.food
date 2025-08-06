import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-foxi-purple to-purple-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tvoje obľúbené jedlo<br />
            doručené bleskovo až k tvojim dverám
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Objednaj si z top reštaurácií vo svojom meste
          </p>
          
          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="flex items-center">
                <div className="flex-1 px-4">
                  <input
                    type="text"
                    placeholder="Zadaj svoju adresu..."
                    className="w-full text-gray-800 text-lg focus:outline-none"
                  />
                </div>
                <button className="bg-foxi-orange hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                  Hľadať reštaurácie
                </button>
              </div>
            </div>
          </div>
          
          {/* Popular searches */}
          <div className="mt-8">
            <p className="text-purple-200 mb-4">Populárne vyhľadávania:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Pizza', 'Sushi', 'Burger', 'Ázijské jedlo', 'Zdravé jedlo'].map((search) => (
                <button
                  key={search}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
