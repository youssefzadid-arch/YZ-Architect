
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
    <div className="animate-in fade-in duration-700 bg-[#fdfaf6]">
      <header className="relative h-[80vh] border-b-2 border-black overflow-hidden">
        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover grayscale-[0.2]" />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-10 left-10">
          <button onClick={() => navigate('/')} className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <div className="max-w-7xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#faedcd] mb-4 block">{project.location}</span>
            <h1 className="text-5xl md:text-8xl font-bold serif text-white tracking-tighter leading-none">{project.title}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-bold serif italic mb-8">Narratif Architectural</h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-16">
              {project.description}
            </p>

            {/* Sub-images Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery && project.gallery.map((img, idx) => (
                <div key={idx} className={`border-2 border-black p-2 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] ${idx % 3 === 0 ? 'md:col-span-2 aspect-[16/7]' : 'aspect-square'}`}>
                  <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={`Détail ${idx}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <aside className="sticky top-32 space-y-8">
              <div className="border-2 border-black p-8 bg-white">
                <h3 className="text-[9px] font-bold uppercase tracking-[0.4em] mb-8 text-gray-400 border-b pb-4">Spécifications</h3>
                <div className="space-y-6">
                  <div><h4 className="text-[8px] text-[#d4a373] font-bold uppercase tracking-widest mb-1">Programme</h4><p className="text-lg font-bold serif">{project.category}</p></div>
                  <div><h4 className="text-[8px] text-[#d4a373] font-bold uppercase tracking-widest mb-1">Année</h4><p className="text-lg font-bold serif">{project.year}</p></div>
                  <div className="pt-4"><h4 className="text-[8px] text-[#d4a373] font-bold uppercase tracking-widest mb-3">Tectonique</h4><ul className="space-y-2">{project.features.map((f, i) => <li key={i} className="text-xs text-gray-600 font-light">• {f}</li>)}</ul></div>
                </div>
              </div>
              <button className="w-full py-5 bg-black text-white text-[9px] font-bold uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all">Télécharger le Plan (PDF)</button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
