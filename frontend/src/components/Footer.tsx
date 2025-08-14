import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="text-white py-8" style={{ backgroundColor: '#5957A1', zIndex: 1000 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <img
                src="/images/foxi-footer.svg"
                alt="Foxi.food"
                className="h-16 w-auto mr-2"
              />
            </div>
            <p className="text-white text-sm mb-4">
              Foxi Food s.r.o.<br />
              Adresa 01/234/5,<br />
              012 34 Bratislava<br />
              Slovensko
            </p>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-medium mb-4">Tvoje obľúbené jedlo<br />doručené bleskovo až k dverám.</h4>
            <ul className="space-y-2">
              <li><Link to="/pre-zakaznikov" className="text-white hover:text-gray-200 text-sm flex items-center"><span className="mr-2">›</span> Pre zákazníkov</Link></li>
              <li><Link to="/pre-partnerov" className="text-white hover:text-gray-200 text-sm flex items-center"><span className="mr-2">›</span> Pre partnerov</Link></li>
              <li><Link to="/pre-kurierov" className="text-white hover:text-gray-200 text-sm flex items-center"><span className="mr-2">›</span> Pre kuriérov</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Užitočné odkazy</h4>
              <ul className="space-y-1">
                <li><Link to="/caste-otazky" className="text-white hover:text-gray-200 text-sm">Časté otázky</Link></li>
                <li><Link to="/podpora" className="text-white hover:text-gray-200 text-sm">Podpora</Link></li>
                <li><Link to="/online-ucet" className="text-white hover:text-gray-200 text-sm">Online účet</Link></li>
                <li><Link to="/ponuky-a-novinky" className="text-white hover:text-gray-200 text-sm">Ponuky a novinky</Link></li>
              </ul>
              <div className="flex space-x-2 mt-4">
                <a href="#" className="text-white hover:text-gray-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22,12.07A10,10,0,0,1,12,22,10,10,0,0,1,2,12.07,10,10,0,0,1,12,2,10,10,0,0,1,22,12.07ZM8.22,15.77H10.3V16.5H8.22V15.77Zm0-9.23V9.73H16V6.54H8.22Zm0,5.54H16V9.27H8.22v2.81ZM8.22,15V13.5H13v1.54Z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-gray-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2.04C6.5,2.04,2,6.53,2,12.06C2,17.06,5.66,21.21,10.44,21.96V14.96H7.9V12.06H10.44V9.85C10.44,7.34,11.93,5.96,14.22,5.96C15.31,5.96,16.45,6.15,16.45,6.15V8.62H15.19C13.95,8.62,13.56,9.39,13.56,10.18V12.06H16.34L15.89,14.96H13.56V21.96A10,10,0,0,0,22,12.06C22,6.53,17.5,2.04,12,2.04Z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Obchod</h4>
              <ul className="space-y-1">
                <li><Link to="/kontakt" className="text-white hover:text-gray-200 text-sm">Kontakt</Link></li>
                <li><Link to="/kariera" className="text-white hover:text-gray-200 text-sm">Kariéra</Link></li>
                <li><Link to="/media" className="text-white hover:text-gray-200 text-sm">Média</Link></li>
                <li><Link to="/obchodne-podmienky" className="text-white hover:text-gray-200 text-sm">Obchodné podmienky</Link></li>
                <li><Link to="/ochrana-udajov" className="text-white hover:text-gray-200 text-sm">Ochrana údajov</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-6 mt-8 text-center text-sm">
          <p className="text-white">
            Copyright © 2025 Foxi.food
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
