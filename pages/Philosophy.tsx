
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
    <div className="animate-in fade-in duration-700 bg-white">
      <section className="bg-black text-white py-56 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,100 L100,0 L100,100 Z" fill="#93c572" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-[1em] text-pistachio block mb-12">Manifeste</span>
          <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter uppercase mb-16 leading-[0.8]">{settings.manifestoHero}</h1>
          <p className="text-xl md:text-4xl font-light text-white/30 max-w-4xl mx-auto leading-tight border-t-[1px] border-pistachio pt-12 uppercase tracking-tight">
            {settings.manifestoSub}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-48 space-y-64">
        {axioms.map((ax, idx) => (
          <div key={ax.id} className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className={`lg:col-span-5 space-y-10 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
              <div className="flex items-center space-x-8">
                 <span className="h-[1px] w-12 bg-pistachio"></span>
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20">{ax.subtitle}</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-black uppercase leading-none">{ax.title}</h2>
              <p className="text-xl text-black/50 leading-relaxed font-light border-l-[1px] border-black pl-10 py-2">
                {ax.text}
              </p>
            </div>
            <div className={`lg:col-span-7 relative ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
              <div className="absolute -inset-8 border border-pistachio/20 pointer-events-none"></div>
              <div className="p-2 border-[1px] border-black bg-white shadow-[25px_25px_0px_0px_#93c572]">
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