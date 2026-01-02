
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
    <div className="animate-in fade-in duration-700 bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden border-b-[1px] border-black">
        <div className="absolute inset-0 bg-pistachio opacity-[0.02]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="max-w-5xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-pistachio mb-10 block">
              {settings.firmName} • {settings.firmSub}
            </span>
            <h1 className="text-7xl md:text-[11rem] leading-[0.9] font-extrabold tracking-tighter mb-16 text-black uppercase">
              Architecture <br/>
              <span className="text-pistachio">Vernaculaire</span>
            </h1>
            <div className="flex flex-col md:flex-row md:items-start gap-12">
              <p className="text-xl md:text-3xl font-light text-black/70 max-w-2xl leading-tight border-l-[1px] border-black pl-10 py-2">
                {settings.bio.split('.')[0]}.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <div className="w-12 h-[1px] bg-black"></div>
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/30">Étude & Réalisation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 py-48">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-40 gap-16">
          <div className="max-w-3xl">
            <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter uppercase mb-6">Projets</h2>
            <div className="h-1 w-24 bg-pistachio mb-10"></div>
            <p className="text-black/40 font-medium text-2xl uppercase tracking-tighter leading-none">Curation de la forme et du lieu.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[9px] font-bold uppercase tracking-[0.4em] px-8 py-4 border-[1px] transition-all ${
                  filter === cat 
                  ? 'bg-black text-white border-black shadow-[4px_4px_0_0_#93c572]' 
                  : 'bg-white text-black/30 border-black/10 hover:border-black hover:text-black'
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
              <div className="relative overflow-hidden border-[1px] border-black bg-white aspect-[4/5] group-hover:shadow-[30px_30px_0_0_#93c572] transition-all duration-[0.6s] p-4">
                <div className="w-full h-full overflow-hidden">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-8 right-8 bg-black text-white text-[9px] font-bold px-5 py-3 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                  Explorer
                </div>
              </div>
              <div className="mt-12 space-y-3">
                <div className="flex items-center space-x-4">
                  <span className="h-[1px] w-12 bg-pistachio"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-pistachio">{project.category}</span>
                </div>
                <h3 className="text-5xl font-extrabold tracking-tighter uppercase">{project.title}</h3>
                <p className="text-black/20 text-[11px] font-bold uppercase tracking-[0.2em]">{project.location} • {project.year}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-64 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <span className="text-pistachio text-[10px] font-bold uppercase tracking-[0.8em]">{settings.visionSub}</span>
            <h3 className="text-6xl md:text-[7rem] font-extrabold uppercase leading-[0.95] tracking-tighter">
              {settings.visionTitle.split(' ')[0]} <br/>
              <span className="text-pistachio">{settings.visionTitle.split(' ').slice(1).join(' ')}</span>
            </h3>
            <p className="text-2xl text-white/30 font-light leading-snug max-w-xl border-l-[1px] border-pistachio pl-10 py-2">
              {settings.bio}
            </p>
            <Link to="/philosophy" className="inline-flex px-12 py-8 bg-pistachio text-black font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all">
              Le Manifeste
            </Link>
          </div>
          <div className="relative">
             <div className="absolute -inset-8 border border-white/10 pointer-events-none"></div>
             <div className="border border-white p-3 bg-white/5 shadow-[30px_30px_0_0_#93c572]">
                <img 
                  src="https://images.unsplash.com/photo-1518005020481-a68515605041?q=80&w=1200" 
                  alt="Architecture" 
                  className="w-full grayscale brightness-110 contrast-125 transition-all duration-700 hover:grayscale-0"
                />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
