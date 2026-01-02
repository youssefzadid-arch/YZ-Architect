
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById } from '../services/storageService';
import { Project } from '../types';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      const data = getProjectById(id);
      setProject(data || null);
    }
  }, [id]);

  if (!project) return null;

  return (
    <div className="animate-in fade-in duration-700 bg-white min-h-screen">
      <header className="relative h-[80vh] border-b-[1px] border-black overflow-hidden">
        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover grayscale-[0.3]" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-8 left-8 z-10">
          <button onClick={() => navigate('/')} className="w-14 h-14 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_#93c572]">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="absolute bottom-12 left-8 right-8">
          <div className="max-w-7xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-pistachio mb-4 block">{project.location}</span>
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none uppercase">{project.title}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <div className="flex items-center space-x-6 mb-10">
              <span className="h-[1px] w-12 bg-black"></span>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] text-black/30">Description du Projet</h2>
            </div>
            <p className="text-xl md:text-3xl text-gray-800 leading-tight font-light mb-16">
              {project.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery && project.gallery.map((img, idx) => (
                <div key={idx} className={`border border-black p-2 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] ${idx % 3 === 0 ? 'md:col-span-2 aspect-[16/8]' : 'aspect-square'}`}>
                  <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={`Détail ${idx}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <aside className="sticky top-32 space-y-6">
              <div className="border border-black p-10 bg-white shadow-[15px_15px_0px_0px_#93c572]">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-12 text-black/20 border-b pb-4">Spécifications</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[9px] text-pistachio font-bold uppercase tracking-widest mb-2">Programme</h4>
                    <p className="text-2xl font-black uppercase tracking-tighter">{project.category}</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] text-pistachio font-bold uppercase tracking-widest mb-2">Année</h4>
                    <p className="text-2xl font-black uppercase tracking-tighter">{project.year}</p>
                  </div>
                  <div className="pt-4 border-t border-black/5">
                    <h4 className="text-[9px] text-pistachio font-bold uppercase tracking-widest mb-4">Tectonique</h4>
                    <ul className="space-y-3">
                      {project.features.map((f, i) => (
                        <li key={i} className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">/ {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <button className="w-full py-6 bg-black text-white text-[10px] font-bold uppercase tracking-[0.5em] border border-black hover:bg-pistachio hover:text-black transition-all">
                Dossier de Presse
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;