
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { getSettings } from '../services/storageService';
import { StudioSettings } from '../types';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    setSettings(getSettings());
    // Update whenever storage changes (e.g. from Admin tab in same window)
    const handleStorage = () => setSettings(getSettings());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const navLinks = [
    { name: 'Archive', path: '/' },
    { name: 'Journal', path: '/blog' },
    { name: 'Studio Lab', path: '/studio' },
    { name: 'Manifeste', path: '/philosophy' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin', isSpecial: true },
  ];

  const brandName = settings?.firmName || "YZ ARCHITECTE";
  const brandSub = settings?.firmSub || "Settat • Maroc";

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b-2 border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-5 hover:opacity-70 transition-opacity">
              <Logo className="w-12 h-12" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tighter leading-none">{brandName}</span>
                <span className="text-[8px] uppercase tracking-[0.5em] text-[#d4a373] mt-2 font-bold">{brandSub}</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all ${
                  link.isSpecial ? 'px-6 py-2 border-2 border-black bg-white hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' : ''
                } ${
                  location.pathname === link.path ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 focus:outline-none">
              <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#fdfaf6] border-b-2 border-black animate-in slide-in-from-top duration-300">
          <div className="px-8 pt-10 pb-16 space-y-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`block py-5 text-4xl font-bold serif border-b border-gray-100 tracking-tighter ${location.pathname === link.path ? 'text-[#d4a373] italic' : 'text-gray-900'}`}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
