
import React, { useState, useEffect } from 'react';
import { 
  getProjects, saveProject, deleteProject, 
  getPosts, savePost, deletePost,
  getSettings, saveSettings,
  getAxioms, saveAxioms
} from '../services/storageService';
import { Project, BlogPost, StudioSettings, PhilosophyAxiom, BlockType } from '../types';
import Logo from '../components/Logo';

type AdminTab = 'projects' | 'blog' | 'core' | 'manifesto';

const Admin: React.FC = () => {
  const [tab, setTab] = useState<AdminTab>('core');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('admin@yzarchitect.com');
  const [password, setPassword] = useState('123456');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [axioms, setAxioms] = useState<PhilosophyAxiom[]>([]);
  
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    refreshData();
    if (localStorage.getItem('yz_admin_token')) setIsAuthenticated(true);
    
    const handleStorage = () => refreshData();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const refreshData = () => {
    setProjects(getProjects());
    setPosts(getPosts());
    setSettings(getSettings());
    setAxioms(getAxioms());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified login check for developer access
    if (email === 'admin@yzarchitect.com' && password === '123456') {
      setIsAuthenticated(true);
      localStorage.setItem('yz_admin_token', 'token');
    } else {
      alert("Identifiants incorrects. Utilisez admin@yzarchitect.com / 123456");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('yz_admin_token');
    setIsAuthenticated(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSettings = (field: keyof StudioSettings, value: string) => {
    if (!settings) return;
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleUpdateAxiom = (id: string, field: keyof PhilosophyAxiom, value: string) => {
    const updated = axioms.map(a => a.id === id ? { ...a, [field]: value } : a);
    setAxioms(updated);
    saveAxioms(updated);
  };

  const addAxiom = () => {
    const newAxiom: PhilosophyAxiom = {
      id: Date.now().toString(),
      subtitle: 'Axiome ' + (axioms.length + 1),
      title: 'Nouvelle Idée',
      text: 'Description de votre philosophie...',
      imageUrl: 'https://images.unsplash.com/photo-1518005020481-a68515605041?q=80&w=800'
    };
    const updated = [...axioms, newAxiom];
    setAxioms(updated);
    saveAxioms(updated);
  };

  const onSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    const updated = saveProject(editingProject);
    setProjects(updated);
    setEditingProject(null);
  };

  const onSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    const updated = savePost(editingPost);
    setPosts(updated);
    setEditingPost(null);
  };

  const addBlock = (type: BlockType) => {
    if (!editingPost) return;
    const currentContent = editingPost.content || [];
    setEditingPost({ ...editingPost, content: [...currentContent, { type, value: '' }] });
  };

  const updateBlock = (index: number, value: string) => {
    if (!editingPost) return;
    const newContent = [...(editingPost.content || [])];
    if (newContent[index]) {
      newContent[index].value = value;
      setEditingPost({ ...editingPost, content: newContent });
    }
  };

  const removeBlock = (index: number) => {
    if (!editingPost) return;
    const newContent = (editingPost.content || []).filter((_, i) => i !== index);
    setEditingPost({ ...editingPost, content: newContent });
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-pistachio-soft p-4">
      <div className="bg-white p-12 md:p-16 border-[4px] border-black max-w-md w-full shadow-[20px_20px_0px_0px_#000000]">
        <div className="mb-12 flex flex-col items-center">
          <Logo className="w-20 h-20 mb-6" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Accès Archive Studio</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio">Email Admin</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full border-b-[3px] border-black/5 py-4 outline-none focus:border-black text-lg font-bold" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio">Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full border-b-[3px] border-black/5 py-4 outline-none focus:border-black text-lg font-bold" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-6 bg-black text-white text-[12px] font-bold uppercase tracking-[0.4em] hover:bg-pistachio hover:text-black transition-all shadow-[8px_8px_0px_0px_#9dbd83]"
          >
            Entrer au Studio
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-black text-white p-6 md:p-10 md:sticky md:top-24 md:h-[calc(100vh-6rem)] border-b-[4px] md:border-b-0 md:border-r-[4px] border-pistachio z-40">
        <div className="mb-12 hidden md:block"><Logo className="w-12 h-12 invert" /></div>
        <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible space-x-4 md:space-x-0 md:space-y-6">
          {[
            { id: 'core', label: 'Identité', icon: 'fa-gears' },
            { id: 'projects', label: 'Projets', icon: 'fa-drafting-compass' },
            { id: 'blog', label: 'Journal', icon: 'fa-pen-nib' },
            { id: 'manifesto', label: 'Axiomes', icon: 'fa-feather-pointed' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setTab(item.id as AdminTab)}
              className={`whitespace-nowrap flex items-center space-x-4 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] border-[2px] transition-all flex-1 md:flex-none ${
                tab === item.id ? 'bg-pistachio text-black border-white' : 'border-transparent text-white/40 hover:text-pistachio'
              }`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 hover:text-red-400 mt-auto hidden md:block text-left">Déconnexion</button>
        </nav>
      </aside>

      <main className="flex-1 p-8 md:p-24 max-w-6xl overflow-x-hidden pb-40">
        {tab === 'core' && settings && (
          <div className="space-y-20 animate-in fade-in duration-500">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-10">Studio Core</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[11px] font-bold uppercase tracking-widest text-pistachio">Nom de l'Agence</label>
                <input value={settings.firmName} onChange={e => handleUpdateSettings('firmName', e.target.value)} className="w-full border-[3px] border-black p-5 text-2xl font-black uppercase outline-none focus:bg-pistachio-soft" />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-bold uppercase tracking-widest text-pistachio">Localisation Tag</label>
                <input value={settings.firmSub} onChange={e => handleUpdateSettings('firmSub', e.target.value)} className="w-full border-[3px] border-black p-5 text-sm font-bold outline-none uppercase" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-[11px] font-bold uppercase tracking-widest text-pistachio">Bio / Manifeste Intro</label>
                <textarea value={settings.bio} onChange={e => handleUpdateSettings('bio', e.target.value)} className="w-full border-[3px] border-black p-6 text-xl font-light outline-none h-48 focus:border-pistachio" />
              </div>
            </div>
          </div>
        )}

        {tab === 'projects' && (
          <div className="space-y-20 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-[4px] border-black pb-10 gap-6">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">L'Archive</h1>
              <button onClick={() => setEditingProject({ title: '', category: 'Residential', location: 'Settat, Maroc', year: '2024', description: '', imageUrl: '', features: [], gallery: [] })} className="px-10 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.4em] shadow-[10px_10px_0px_0px_#93c572] hover:bg-pistachio hover:text-black transition-all">+ Nouveau Dossier</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {projects.map(p => (
                <div key={p.id} className="border-[3px] border-black p-6 bg-white hover:shadow-[15px_15px_0px_0px_#93c572] transition-all group relative">
                  <div className="aspect-video overflow-hidden mb-6 border-2 border-black/5 shadow-inner">
                    <img src={p.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black uppercase text-2xl tracking-tighter">{p.title}</h3>
                      <p className="text-[12px] text-pistachio font-bold uppercase tracking-widest mt-2">{p.year} • {p.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingProject(p)} className="w-10 h-10 bg-black text-white hover:bg-pistachio hover:text-black transition-all flex items-center justify-center shadow-[4px_4px_0px_0px_#93c572]"><i className="fa-solid fa-pen-to-square"></i></button>
                      <button onClick={() => { if(confirm('Supprimer ce projet?')) setProjects(deleteProject(p.id)) }} className="w-10 h-10 border-2 border-black text-black hover:bg-black hover:text-white transition-all flex items-center justify-center"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'manifesto' && (
          <div className="space-y-20 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-[4px] border-black pb-10 gap-6">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Les Axiomes</h1>
              <button onClick={addAxiom} className="px-10 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.4em] shadow-[10px_10px_0px_0px_#93c572] hover:bg-pistachio hover:text-black transition-all">+ Nouvel Axiome</button>
            </div>
            <div className="space-y-16">
              {axioms.map((ax) => (
                <div key={ax.id} className="border-[3px] border-black p-10 bg-white shadow-[20px_20px_0px_0px_#f4f7f0] relative group">
                  <button onClick={() => { if(confirm('Supprimer?')) setAxioms(axioms.filter(a => a.id !== ax.id)) }} className="absolute -top-6 -right-6 w-14 h-14 bg-black text-white flex items-center justify-center border-[3px] border-pistachio hover:bg-pistachio hover:text-black transition-all z-10"><i className="fa-solid fa-trash-can text-xl"></i></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-6">
                      <input value={ax.subtitle} onChange={e => handleUpdateAxiom(ax.id, 'subtitle', e.target.value)} className="w-full border-b-[3px] border-black/5 py-4 text-[12px] font-bold uppercase tracking-[0.4em] text-pistachio outline-none focus:border-black" />
                      <input value={ax.title} onChange={e => handleUpdateAxiom(ax.id, 'title', e.target.value)} className="w-full border-b-[3px] border-black/5 py-4 text-4xl font-black uppercase tracking-tighter outline-none focus:border-black" />
                      <textarea value={ax.text} onChange={e => handleUpdateAxiom(ax.id, 'text', e.target.value)} className="w-full border-[2px] border-black/10 p-6 text-lg font-light h-48 outline-none focus:border-pistachio" />
                    </div>
                    <div className="space-y-6">
                       <label className="text-[10px] font-bold uppercase tracking-widest block mb-2">Visuel de l'Axiome</label>
                       <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, (b64) => handleUpdateAxiom(ax.id, 'imageUrl', b64))} 
                        className="w-full border-[2px] border-black/10 p-4 text-[11px] font-bold" 
                       />
                       <div className="aspect-video border-[3px] border-black overflow-hidden shadow-[10px_10px_0px_0px_#93c572]">
                        <img src={ax.imageUrl} className="w-full h-full object-cover grayscale" alt="Preview" />
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'blog' && (
          <div className="space-y-20 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-[4px] border-black pb-10 gap-6">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Le Journal</h1>
              <button onClick={() => setEditingPost({ title: '', excerpt: '', category: 'Pensée', content: [] })} className="px-10 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.4em] shadow-[10px_10px_0px_0px_#93c572] hover:bg-pistachio hover:text-black transition-all">+ Nouvel Essai</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {posts.map(p => (
                <div key={p.id} className="border-[3px] border-black p-6 bg-white hover:shadow-[15px_15px_0px_0px_#93c572] transition-all group">
                  <div className="aspect-[16/10] overflow-hidden mb-6 border-2 border-black/5">
                    <img src={p.imageUrl} className="w-full h-full object-cover grayscale transition-all duration-700" alt="" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black uppercase text-2xl tracking-tighter">{p.title}</h3>
                      <p className="text-[12px] text-pistachio font-bold uppercase tracking-widest mt-2">{p.date} • {p.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingPost(p)} className="w-10 h-10 bg-black text-white hover:bg-pistachio hover:text-black transition-all flex items-center justify-center shadow-[4px_4px_0px_0px_#93c572]"><i className="fa-solid fa-pen-to-square"></i></button>
                      <button onClick={() => { if(confirm('Supprimer ce post?')) setPosts(deletePost(p.id)) }} className="w-10 h-10 border-2 border-black text-black hover:bg-black hover:text-white transition-all flex items-center justify-center"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Project Editor Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="bg-white max-w-6xl w-full p-8 md:p-16 border-[6px] border-black max-h-[90vh] overflow-y-auto shadow-[30px_30px_0px_0px_#9dbd83] animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-12 border-b-[4px] border-black pb-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Dossier Projet</h2>
              <button onClick={() => setEditingProject(null)} className="text-4xl hover:text-pistachio transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={onSaveProject} className="space-y-16">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio mb-2 block">Titre</label>
                      <input value={editingProject.title || ''} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full text-2xl font-black uppercase border-b-[4px] border-black py-4 outline-none focus:bg-pistachio-soft" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio mb-2 block">Année</label>
                        <input value={editingProject.year || ''} onChange={e => setEditingProject({...editingProject, year: e.target.value})} className="w-full border-b-[2px] border-black py-2 font-bold uppercase outline-none" placeholder="2024" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio mb-2 block">Catégorie</label>
                        <select value={editingProject.category || 'Residential'} onChange={e => setEditingProject({...editingProject, category: e.target.value as any})} className="w-full border-b-[2px] border-black py-2 font-bold uppercase outline-none">
                          <option value="Residential">Résidentiel</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Cultural">Culturel</option>
                          <option value="Industrial">Industriel</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio mb-2 block">Description</label>
                      <textarea value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full border-[3px] border-black p-6 text-lg font-light h-48 outline-none" required />
                    </div>

                    {/* Features Editor */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio mb-4 block">Détails Tectoniques</label>
                      <div className="space-y-2">
                        {(editingProject.features || []).map((feat, idx) => (
                          <div key={idx} className="flex space-x-2">
                            <input value={feat} onChange={e => {
                                const newFeats = [...(editingProject.features || [])];
                                newFeats[idx] = e.target.value;
                                setEditingProject({...editingProject, features: newFeats});
                              }} className="flex-1 border-b border-black/10 py-2 text-xs font-bold uppercase outline-none focus:border-black" />
                            <button type="button" onClick={() => {
                                const newFeats = (editingProject.features || []).filter((_, i) => i !== idx);
                                setEditingProject({...editingProject, features: newFeats});
                              }} className="text-red-500"><i className="fa-solid fa-xmark"></i></button>
                          </div>
                        ))}
                        <button type="button" onClick={() => setEditingProject({...editingProject, features: [...(editingProject.features || []), '']})} className="text-[9px] font-bold uppercase tracking-widest text-pistachio mt-2">+ Ajouter un détail</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio mb-2 block">Image Principale</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (b64) => setEditingProject({...editingProject, imageUrl: b64}))} className="w-full border-[2px] border-black/10 p-4 mb-4" />
                      <div className="aspect-video border-[4px] border-black shadow-[10px_10px_0px_0px_#9dbd83] overflow-hidden">
                        <img src={editingProject.imageUrl} className="w-full h-full object-cover grayscale" alt="Preview" />
                      </div>
                    </div>

                    {/* Gallery Editor */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio mb-4 block">Galerie du Projet</label>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {(editingProject.gallery || []).map((img, idx) => (
                          <div key={idx} className="relative group aspect-square border-2 border-black overflow-hidden">
                            <img src={img} className="w-full h-full object-cover" alt="" />
                            <button type="button" onClick={() => {
                                const newGallery = (editingProject.gallery || []).filter((_, i) => i !== idx);
                                setEditingProject({...editingProject, gallery: newGallery});
                              }} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        ))}
                        <label className="aspect-square border-2 border-dashed border-black/20 hover:border-black flex flex-col items-center justify-center cursor-pointer transition-colors">
                          <i className="fa-solid fa-plus text-black/20 mb-2"></i>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-black/20">Ajouter</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (b64) => {
                              setEditingProject({...editingProject, gallery: [...(editingProject.gallery || []), b64]});
                            })} />
                        </label>
                      </div>
                    </div>
                  </div>
               </div>
               <button type="submit" className="w-full py-10 bg-black text-white font-black text-[14px] uppercase tracking-[0.6em] shadow-[15px_15px_0px_0px_#9dbd83] hover:shadow-none transition-all">Archiver le Projet</button>
            </form>
          </div>
        </div>
      )}

      {/* Blog Editor Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="bg-white max-w-6xl w-full p-8 md:p-16 border-[6px] border-black max-h-[90vh] overflow-y-auto shadow-[30px_30px_0px_0px_#9dbd83] animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-12 border-b-[4px] border-black pb-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Rédaction d'Essai</h2>
              <button onClick={() => setEditingPost(null)} className="text-4xl hover:text-pistachio transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={onSavePost} className="space-y-16">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  <div className="space-y-10">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio mb-2 block">Titre de l'Essai</label>
                      <input value={editingPost.title || ''} onChange={e => setEditingPost({...editingPost, title: e.target.value})} className="w-full text-3xl font-black uppercase border-b-[4px] border-black py-4 outline-none focus:bg-pistachio-soft" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio mb-2 block">Extrait</label>
                      <textarea value={editingPost.excerpt || ''} onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})} className="w-full border-[3px] border-black p-6 text-lg font-light h-48 outline-none" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-pistachio mb-2 block">Image de Couverture</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (b64) => setEditingPost({...editingPost, imageUrl: b64}))} className="w-full border-[2px] border-black/10 p-4 mb-4" />
                      <div className="aspect-video border-[4px] border-black overflow-hidden shadow-[10px_10px_0px_0px_#9dbd83]">
                         <img src={editingPost.imageUrl} className="w-full h-full object-cover grayscale" alt="" />
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-10">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-pistachio border-b-2 border-pistachio pb-2">Contenu Modulaire</h3>
                    <div className="space-y-8">
                       {(editingPost.content || []).map((block, idx) => (
                         <div key={idx} className="relative border-[3px] border-black p-8 bg-pistachio-soft/30">
                            <button type="button" onClick={() => removeBlock(idx)} className="absolute -right-4 -top-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"><i className="fa-solid fa-xmark text-xs"></i></button>
                            <div className="mb-4 text-[9px] font-bold uppercase tracking-widest opacity-30">{block.type}</div>
                            {block.type === 'img' ? (
                              <div className="space-y-4">
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (b64) => updateBlock(idx, b64))} className="w-full text-xs" />
                                {block.value && <img src={block.value} className="h-32 object-contain" alt="" />}
                              </div>
                            ) : (
                              <textarea value={block.value} onChange={e => updateBlock(idx, e.target.value)} className="w-full bg-transparent outline-none font-light text-xl h-24" placeholder="Saisissez votre texte..." />
                            )}
                         </div>
                       ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {['p', 'h2', 'quote', 'img'].map(t => (
                         <button key={t} type="button" onClick={() => addBlock(t as any)} className="py-4 border-[3px] border-black font-bold text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">+ {t}</button>
                       ))}
                    </div>
                  </div>
               </div>
               <button type="submit" className="w-full py-10 bg-black text-white font-black text-[14px] uppercase tracking-[0.8em] shadow-[15px_15px_0px_0px_#9dbd83] hover:shadow-none transition-all">Archiver l'Essai</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
