
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, getSettings } from '../services/storageService';
import { Project, StudioSettings } from '../types';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [filter, setFilter] = useState<string>('Tous');

  useEffect(() => {
    setProjects(getProjects());
    setSettings(getSettings());
  }, []);

  const categoriesMap: Record<string, string> = {
    'Tous': 'All',
    'Résidentiel': 'Residential',
    'Commercial': 'Commercial',
    'Culturel': 'Cultural',
    'Industriel': 'Industrial'
  };
  const categories = Object.keys(categoriesMap);

  const filteredProjects = filter === 'Tous' 
    ? projects 
    : projects.filter(p => p.category === categoriesMap[filter]);

  if (!settings) return null;

  return (
    <div className="animate-in fade-in duration-700 bg-[#fdfaf6]">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden border-b-2 border-black">
        <div className="absolute inset-0 bg-[#faedcd] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-[#d4a373] mb-12 block">{settings.firmName} • {settings.firmSub}</span>
              <h1 className="text-7xl md:text-[9rem] leading-[0.85] serif font-bold tracking-tighter mb-12">
                Matière & <br/>
                <span className="italic font-normal">Silence</span>
              </h1>
              <p className="text-xl md:text-3xl font-light text-gray-700 max-w-2xl leading-relaxed border-l-4 border-black pl-10 py-4">
                {settings.bio.split('.')[0]}.
              </p>
            </div>
            <div className="lg:col-span-4 hidden lg:flex justify-end">
               <div className="relative group">
                 <div className="absolute -inset-6 border-2 border-black/5 group-hover:border-black/20 transition-all duration-700"></div>
                 <div className="w-80 aspect-[3/4] border-2 border-black p-3 bg-white shadow-[25px_25px_0px_0px_#faedcd]">
                   <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800" className="w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0" alt="Context" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 py-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-16">
          <div className="max-w-3xl">
            <h2 className="text-6xl font-bold tracking-tight serif mb-6 italic">L'Archive Tectonique</h2>
            <div className="h-2 w-32 bg-black mb-8"></div>
            <p className="text-gray-500 font-light text-2xl leading-relaxed italic">Curations d'espaces pensés pour la permanence.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] px-8 py-4 border-2 transition-all ${
                  filter === cat 
                  ? 'bg-black text-white border-black shadow-[6px_6px_0px_0px_#d4a373]' 
                  : 'bg-transparent text-gray-400 border-gray-100 hover:border-black hover:text-black hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-48">
          {filteredProjects.map((project, index) => (
            <Link 
              to={`/project/${project.id}`} 
              key={project.id} 
              className={`group block relative ${index % 2 !== 0 ? 'md:mt-48' : ''}`}
            >
              <div className="relative overflow-hidden border-2 border-black bg-white aspect-[4/5] shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[30px_30px_0px_0px_#faedcd] transition-all duration-[1s] p-4">
                <div className="w-full h-full overflow-hidden border border-black/10">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale transition-all duration-[3s] group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
                <div className="absolute top-10 right-10 bg-black text-white text-[9px] font-bold px-4 py-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Ouvrir le Dossier
                </div>
              </div>
              <div className="mt-12 space-y-4">
                <div className="flex items-center space-x-6">
                  <span className="h-[2px] w-12 bg-black"></span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#d4a373]">{project.category}</span>
                </div>
                <h3 className="text-5xl font-bold serif group-hover:italic transition-all duration-500">{project.title}</h3>
                <p className="text-gray-400 text-[12px] font-bold uppercase tracking-widest">{project.location} — {project.year}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-48 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <span className="text-[#d4a373] text-[10px] font-bold uppercase tracking-[0.8em]">{settings.visionSub}</span>
            <h3 className="text-6xl md:text-8xl font-bold serif leading-tight">
              {settings.visionTitle.split(' ')[0]} <br/>
              <span className="italic text-[#faedcd] font-normal">{settings.visionTitle.split(' ').slice(1).join(' ')}</span>
            </h3>
            <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-xl border-l-2 border-[#d4a373]/30 pl-10 py-2">
              {settings.bio}
            </p>
            <Link to="/philosophy" className="inline-flex px-14 py-8 bg-[#faedcd] text-black font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[12px_12px_0px_0px_rgba(212,163,115,0.4)]">
              Accéder au Manifeste
            </Link>
          </div>
          <div className="relative">
             <div className="absolute -inset-10 border-2 border-white/5 pointer-events-none"></div>
             <div className="border-2 border-white/20 p-3 bg-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1518005020481-a68515605041?q=80&w=1200" 
                  alt="Processus" 
                  className="w-full grayscale contrast-125 transition-all duration-700 hover:grayscale-0"
                />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
