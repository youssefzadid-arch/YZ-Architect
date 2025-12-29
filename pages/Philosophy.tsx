
import React, { useEffect, useState } from 'react';
import { getSettings, getAxioms } from '../services/storageService';
import { StudioSettings, PhilosophyAxiom } from '../types';

const Philosophy: React.FC = () => {
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [axioms, setAxioms] = useState<PhilosophyAxiom[]>([]);

  useEffect(() => {
    setSettings(getSettings());
    setAxioms(getAxioms());
  }, []);

  if (!settings) return null;

  return (
    <div className="animate-in fade-in duration-700 bg-[#fdfaf6]">
      <section className="bg-[#1a1a1a] text-white py-40 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,0 L100,0 L50,50 Z" fill="white" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-[#d4a373] block mb-12">Le Manifeste du Studio</span>
          <h1 className="text-5xl md:text-9xl font-bold tracking-tight mb-12 serif leading-none">{settings.manifestoHero}</h1>
          <p className="text-xl md:text-3xl font-light text-gray-400 max-w-4xl mx-auto leading-relaxed border-t border-white/10 pt-12">
            "{settings.manifestoSub}"
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-32 space-y-48">
        {axioms.map((ax, idx) => (
          <div key={ax.id} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className={`lg:col-span-5 space-y-10 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
              <div className="flex items-center space-x-6">
                 <span className="h-[2px] w-12 bg-black"></span>
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4a373]">{ax.subtitle}</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black serif italic">{ax.title}</h2>
              <p className="text-xl text-gray-600 leading-relaxed font-light border-l-2 border-black pl-8 py-2">
                {ax.text}
              </p>
            </div>
            <div className={`lg:col-span-7 relative ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
              <div className="absolute -inset-4 border-2 border-black/5 pointer-events-none"></div>
              <div className="p-2 border-2 border-black bg-white shadow-[20px_20px_0px_0px_#e9edc9]">
                 <img src={ax.imageUrl} alt={ax.title} className="w-full aspect-[4/3] object-cover grayscale transition-all duration-700 hover:grayscale-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Philosophy;
