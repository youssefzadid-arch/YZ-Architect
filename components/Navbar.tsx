
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
    const handleStorage = () => setSettings(getSettings());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const navLinks = [
    { name: 'Portfolio', path: '/' },
    { name: 'Journal', path: '/blog' },
    { name: 'Studio Lab', path: '/studio' },
    { name: 'Manifeste', path: '/philosophy' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin', isSpecial: true },
  ];

  const brandName = settings?.firmName || "YZ ARCHITECTE";
  const brandSub = settings?.firmSub || "Settat • Maroc";

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4 hover:opacity-70 transition-opacity">
              <Logo className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none uppercase">{brandName}</span>
                <span className="text-[7px] uppercase tracking-[0.6em] text-pistachio mt-1 font-bold">{brandSub}</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[9px] font-bold tracking-[0.4em] uppercase transition-all pb-1 ${
                  link.isSpecial ? 'px-6 py-2 border border-black bg-white hover:bg-black hover:text-white' : ''
                } ${
                  location.pathname === link.path ? 'border-b-2 border-pistachio text-black' : 'text-black/30 hover:text-black'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-black focus:outline-none">
              <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-black animate-in slide-in-from-top duration-300">
          <div className="px-8 pt-10 pb-16 space-y-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)} 
                className={`block py-4 text-4xl font-black tracking-tighter uppercase border-b border-black/5 ${
                  location.pathname === link.path ? 'text-pistachio' : 'text-black'
                }`}
              >
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