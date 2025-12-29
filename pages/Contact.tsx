
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
    <div className="max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-16">
          <div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 serif italic">Studio <br/><span className="not-italic text-black/10">Settat</span></h1>
            <p className="text-xl text-gray-500 font-light leading-relaxed max-w-md">
              Basés au cœur de la Chaouia, nous concevons des projets qui respectent l'identité et la matérialité de notre territoire.
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex items-start">
              <div className="w-14 h-14 border-2 border-black bg-white flex items-center justify-center mr-8 shrink-0 shadow-[6px_6px_0px_0px_#faedcd]">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h4 className="font-bold mb-2 uppercase text-[10px] tracking-widest text-[#d4a373]">Localisation</h4>
                <p className="text-gray-800 text-lg serif font-bold leading-snug">
                  {settings.location}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-14 h-14 border-2 border-black bg-[#25D366] text-white flex items-center justify-center mr-8 shrink-0 shadow-[6px_6px_0px_0px_rgba(37,211,102,0.2)] hover:scale-110 transition-transform">
                <i className="fa-brands fa-whatsapp text-2xl"></i>
              </div>
              <div>
                <h4 className="font-bold mb-2 uppercase text-[10px] tracking-widest text-[#d4a373]">Contact Direct</h4>
                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-900 text-xl font-bold serif border-b-2 border-black pb-1 hover:text-[#d4a373] hover:border-[#d4a373] transition-colors">
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="p-10 border-2 border-black bg-white shadow-[12px_12px_0px_0px_#e9edc9] relative">
            <div className="absolute -top-4 -left-4 bg-black text-white text-[9px] font-bold px-4 py-1 uppercase tracking-widest">Note</div>
            <p className="text-sm text-gray-500 leading-relaxed italic">
              "Notre pratique privilégie le dialogue physique et la visite de site. Pour toute demande de collaboration ou d'expertise sur le plateau de la Chaouia, n'hésitez pas à nous solliciter."
            </p>
          </div>
        </div>

        <div className="bg-white p-10 md:p-16 border-2 border-black shadow-[20px_20px_0px_0px_black] self-start">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-12">
              <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center text-4xl text-black animate-in zoom-in">
                <i className="fa-solid fa-check"></i>
              </div>
              <h3 className="text-3xl font-bold tracking-tight serif italic">Message Reçu</h3>
              <p className="text-gray-500 font-light max-w-xs mx-auto">Votre vision a été transmise au studio. Nous y répondrons sous 48h.</p>
              <button onClick={() => setSubmitted(false)} className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em]">Retour</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nom / Entité</label>
                <input required type="text" className="w-full bg-white border-b-2 border-gray-100 py-4 outline-none focus:border-black transition-colors text-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email de Correspondance</label>
                <input required type="email" className="w-full bg-white border-b-2 border-gray-100 py-4 outline-none focus:border-black transition-colors text-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brief Architectural</label>
                <textarea required rows={5} className="w-full bg-white border-2 border-gray-100 p-4 outline-none focus:border-black transition-colors resize-none text-sm font-light"></textarea>
              </div>
              <button type="submit" className="w-full py-6 bg-black text-white font-bold uppercase tracking-[0.4em] text-[11px] hover:shadow-[10px_10px_0px_0px_#faedcd] transition-all">
                Envoyer le Brief
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
