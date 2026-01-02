
import React, { useState, useEffect } from 'react';
import { getSettings } from '../services/storageService';
import { StudioSettings } from '../types';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState<StudioSettings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!settings) return null;

  return (
    <div className="max-w-7xl mx-auto px-8 py-48 sm:px-6 lg:px-8 animate-in fade-in duration-700 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
        <div className="space-y-20">
          <div>
            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter mb-10 leading-[0.8] uppercase">Studio <br/><span className="text-pistachio/30">Settat</span></h1>
            <p className="text-2xl text-black/40 font-light leading-tight max-w-xl border-l-[1px] border-black pl-10 py-2 uppercase tracking-tight">
              Le dialogue est la structure fondamentale de chaque projet.
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex items-center">
              <div className="w-16 h-16 border border-black bg-white flex items-center justify-center mr-8 shrink-0 shadow-[6px_6px_0px_0px_#93c572]">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h4 className="font-bold mb-2 uppercase text-[10px] tracking-[0.5em] text-pistachio">Studio</h4>
                <p className="text-black text-2xl font-black uppercase tracking-tighter leading-none">
                  {settings.location}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-16 h-16 border border-black bg-black text-pistachio flex items-center justify-center mr-8 shrink-0 shadow-[6px_6px_0px_0px_#93c572]">
                <i className="fa-brands fa-whatsapp text-2xl"></i>
              </div>
              <div>
                <h4 className="font-bold mb-2 uppercase text-[10px] tracking-[0.5em] text-pistachio">Direct</h4>
                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="text-black text-3xl font-black uppercase tracking-tighter border-b-[2px] border-black hover:text-pistachio hover:border-pistachio transition-all">
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-12 md:p-20 border border-black shadow-[20px_20px_0px_0px_#000000] self-start relative">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-pistachio border border-black -z-10"></div>
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-10 py-16">
              <div className="w-24 h-24 border border-black bg-pistachio flex items-center justify-center text-4xl text-black animate-in zoom-in">
                <i className="fa-solid fa-check"></i>
              </div>
              <h3 className="text-4xl font-black tracking-tighter uppercase">Message Envoyé</h3>
              <p className="text-black/30 text-xl font-light uppercase tracking-tight">Nous reviendons vers vous sous 48h.</p>
              <button onClick={() => setSubmitted(false)} className="px-12 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.5em]">Fermer</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.5em] text-pistachio">Identité</label>
                <input required type="text" className="w-full bg-white border-b border-black/5 py-4 outline-none focus:border-black transition-all text-xl font-bold uppercase tracking-tighter" placeholder="Nom ou Cabinet" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.5em] text-pistachio">Email</label>
                <input required type="email" className="w-full bg-white border-b border-black/5 py-4 outline-none focus:border-black transition-all text-xl font-bold uppercase tracking-tighter" placeholder="contact@domaine.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.5em] text-pistachio">Projet</label>
                <textarea required rows={3} className="w-full bg-pistachio-soft/20 border border-black p-6 outline-none focus:bg-white transition-all resize-none text-lg font-light tracking-tight" placeholder="Brève description de votre vision architectural..."></textarea>
              </div>
              <button type="submit" className="w-full py-8 bg-black text-white font-bold uppercase tracking-[0.8em] text-[12px] shadow-[10px_10px_0px_0px_#93c572] hover:bg-pistachio hover:text-black hover:shadow-none transition-all">
                Lancer l'Etude
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;