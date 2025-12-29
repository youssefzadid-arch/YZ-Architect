
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [axioms, setAxioms] = useState<PhilosophyAxiom[]>([]);
  
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    refreshData();
    if (localStorage.getItem('yz_admin_token')) setIsAuthenticated(true);
  }, []);

  const refreshData = () => {
    setProjects(getProjects());
    setPosts(getPosts());
    setSettings(getSettings());
    setAxioms(getAxioms());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@yzarchitect.com' && password === '123456') {
      setIsAuthenticated(true);
      localStorage.setItem('yz_admin_token', 'token');
    }
  };

  const handleUpdateSettings = (field: keyof StudioSettings, value: string) => {
    if (!settings) return;
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    saveSettings(updated);
    window.dispatchEvent(new Event('storage'));
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

  const onSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    // Explicit validation check
    if (!editingPost.title || !editingPost.excerpt) {
      alert("Veuillez remplir au moins le titre et l'extrait.");
      return;
    }

    try {
      const updated = savePost(editingPost);
      setPosts(updated);
      setEditingPost(null);
    } catch (err) {
      console.error("Save Post Error:", err);
      alert("Erreur lors de la sauvegarde. Vérifiez la console.");
    }
  };

  const addBlock = (type: BlockType) => {
    if (!editingPost) return;
    const currentContent = editingPost.content || [];
    setEditingPost({
      ...editingPost,
      content: [...currentContent, { type, value: '' }]
    });
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

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (!editingPost) return;
    const content = [...(editingPost.content || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= content.length) return;
    [content[index], content[newIndex]] = [content[newIndex], content[index]];
    setEditingPost({ ...editingPost, content: content });
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6] p-4">
      <div className="bg-white p-12 border-2 border-black max-w-md w-full shadow-[12px_12px_0px_0px_black]">
        <div className="mb-8 flex justify-center"><Logo className="w-16 h-16" /></div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-b-2 border-gray-100 py-3 outline-none focus:border-black" placeholder="admin@yzarchitect.com" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border-b-2 border-gray-100 py-3 outline-none focus:border-black" placeholder="••••••" />
          <button className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest">Accès Studio</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex">
      <aside className="w-64 bg-white border-r-2 border-black p-8 hidden md:block sticky top-24 h-[calc(100vh-6rem)]">
        <div className="mb-12"><Logo className="w-10 h-10" /></div>
        <nav className="space-y-4">
          {[
            { id: 'core', label: 'Configuration', icon: 'fa-gears' },
            { id: 'projects', label: 'Portfolio', icon: 'fa-drafting-compass' },
            { id: 'blog', label: 'Journal', icon: 'fa-pen-nib' },
            { id: 'manifesto', label: 'Manifeste', icon: 'fa-feather-pointed' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setTab(item.id as AdminTab)}
              className={`w-full flex items-center space-x-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
                tab === item.id ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_#faedcd]' : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 md:p-16 max-w-5xl">
        {tab === 'core' && settings && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <h1 className="text-4xl serif font-bold italic border-b-2 border-black pb-6">Studio Core</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#d4a373]">Nom de l'Agence</label>
                <input value={settings.firmName} onChange={e => handleUpdateSettings('firmName', e.target.value)} className="w-full border-2 p-3 text-xl font-bold serif outline-none focus:border-black" />
              </div>
              <div className="space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#d4a373]">Sous-titre Localisation</label>
                <input value={settings.firmSub} onChange={e => handleUpdateSettings('firmSub', e.target.value)} className="w-full border-2 p-3 text-sm outline-none focus:border-black" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#d4a373]">Manifeste Bio (Court)</label>
                <textarea value={settings.bio} onChange={e => handleUpdateSettings('bio', e.target.value)} className="w-full border-2 p-4 text-sm font-light outline-none h-32 focus:border-black" />
              </div>
              <div className="space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#d4a373]">Téléphone Studio</label>
                <input value={settings.phone} onChange={e => handleUpdateSettings('phone', e.target.value)} className="w-full border-2 p-3 text-sm outline-none focus:border-black" />
              </div>
              <div className="space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#d4a373]">WhatsApp Link</label>
                <input value={settings.whatsapp} onChange={e => handleUpdateSettings('whatsapp', e.target.value)} className="w-full border-2 p-3 text-sm outline-none focus:border-black" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#d4a373]">Adresse Physique</label>
                <input value={settings.location} onChange={e => handleUpdateSettings('location', e.target.value)} className="w-full border-2 p-3 text-sm outline-none focus:border-black" />
              </div>
            </div>
          </div>
        )}

        {tab === 'manifesto' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b-2 border-black pb-6">
              <h1 className="text-4xl serif font-bold italic">Axiomes du Design</h1>
              <button onClick={addAxiom} className="px-6 py-3 bg-black text-white text-[9px] font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_#faedcd]">+ Ajouter Axiome</button>
            </div>
            <div className="space-y-12">
              {axioms.map((ax) => (
                <div key={ax.id} className="border-2 border-black p-8 bg-white shadow-[12px_12px_0px_0px_#e9edc9] relative group">
                  <button onClick={() => { if(confirm('Supprimer cet axiome?')) setAxioms(axioms.filter(a => a.id !== ax.id)) }} className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 text-white flex items-center justify-center border-2 border-black hover:bg-black transition-colors z-10"><i className="fa-solid fa-trash-can"></i></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <input value={ax.subtitle} onChange={e => handleUpdateAxiom(ax.id, 'subtitle', e.target.value)} className="w-full border-b-2 border-gray-100 py-2 text-[10px] font-bold uppercase tracking-widest text-[#d4a373] outline-none focus:border-black" />
                      <input value={ax.title} onChange={e => handleUpdateAxiom(ax.id, 'title', e.target.value)} className="w-full border-b-2 border-gray-100 py-2 text-2xl font-bold serif outline-none focus:border-black" />
                      <textarea value={ax.text} onChange={e => handleUpdateAxiom(ax.id, 'text', e.target.value)} className="w-full border-2 p-4 text-sm font-light h-32 outline-none focus:border-black" />
                    </div>
                    <div className="space-y-4">
                       <input value={ax.imageUrl} onChange={e => handleUpdateAxiom(ax.id, 'imageUrl', e.target.value)} className="w-full border-2 p-2 text-[10px] outline-none" placeholder="Image URL..." />
                       <img src={ax.imageUrl} className="w-full aspect-video object-cover grayscale" alt="Preview" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'projects' && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="flex justify-between items-end border-b-2 border-black pb-6">
              <h1 className="text-4xl serif font-bold italic">L'Archive</h1>
              <button onClick={() => setEditingProject({ title: '', category: 'Residential', location: 'Settat', year: '2024', description: '', gallery: [], imageUrl: '', features: [] })} className="px-6 py-3 bg-black text-white text-[9px] font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_#faedcd]">+ Nouveau Projet</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map(p => (
                <div key={p.id} className="border-2 border-black p-4 bg-white hover:shadow-[10px_10px_0px_0px_#faedcd] transition-all group">
                  <div className="aspect-video overflow-hidden mb-4 border"><img src={p.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" /></div>
                  <div className="flex justify-between items-start">
                    <div><h3 className="font-bold serif text-xl">{p.title}</h3><p className="text-[9px] text-gray-400 uppercase tracking-widest">{p.year} • {p.category}</p></div>
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingProject(p)} className="p-2 text-gray-400 hover:text-black"><i className="fa-solid fa-pen-to-square"></i></button>
                      <button onClick={() => { if(confirm('Supprimer?')) setProjects(deleteProject(p.id)) }} className="p-2 text-red-300 hover:text-red-500"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'blog' && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="flex justify-between items-end border-b-2 border-black pb-6">
              <h1 className="text-4xl serif font-bold italic">Journal</h1>
              <button 
                onClick={() => setEditingPost({ title: '', category: 'Pensée', date: new Date().toLocaleDateString('fr-FR'), excerpt: '', content: [], imageUrl: '' })} 
                className="px-6 py-3 bg-black text-white text-[9px] font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_#e9edc9]"
              >
                + Nouvel Essai
              </button>
            </div>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="flex border-2 border-black p-4 bg-white items-center justify-between group hover:shadow-[8px_8px_0px_0px_#faedcd] transition-all">
                  <div className="flex items-center space-x-6">
                    <img src={post.imageUrl} className="w-16 h-16 object-cover grayscale" alt="" />
                    <div><h3 className="font-bold serif text-lg">{post.title}</h3><p className="text-[9px] text-gray-400 uppercase tracking-widest">{post.date}</p></div>
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={() => setEditingPost(post)} className="px-6 py-2 text-[8px] font-bold border border-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Éditer</button>
                    <button onClick={() => { if(confirm('Supprimer cet essai?')) setPosts(deletePost(post.id)) }} className="px-4 py-2 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-all"><i className="fa-solid fa-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Post Editor Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white max-w-5xl w-full p-10 border-4 border-black max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10 border-b-2 border-black pb-6">
              <h2 className="text-4xl font-bold serif italic">Éditeur d'Archive</h2>
              <button onClick={() => setEditingPost(null)} className="text-2xl hover:rotate-90 transition-transform"><i className="fa-solid fa-xmark"></i></button>
            </div>

            <form onSubmit={onSavePost} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-1 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-gray-400">Couverture (URL)</label>
                    <input value={editingPost.imageUrl || ''} onChange={e => setEditingPost({...editingPost, imageUrl: e.target.value})} className="w-full border-2 p-2 text-xs outline-none focus:border-black" />
                    <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                      {editingPost.imageUrl ? <img src={editingPost.imageUrl} className="w-full h-full object-cover grayscale" alt="" /> : <i className="fa-solid fa-image text-gray-200 text-4xl"></i>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <input value={editingPost.title || ''} onChange={e => setEditingPost({...editingPost, title: e.target.value})} className="w-full text-xl font-bold serif border-b-2 border-black/10 py-2 outline-none focus:border-black" placeholder="Titre de l'essai..." required />
                    <input value={editingPost.date || ''} onChange={e => setEditingPost({...editingPost, date: e.target.value})} className="w-full text-xs font-bold border-b py-1 outline-none" placeholder="Date..." />
                    <select value={editingPost.category || 'Pensée'} onChange={e => setEditingPost({...editingPost, category: e.target.value as any})} className="w-full border-b py-2 text-xs outline-none bg-transparent font-bold uppercase tracking-widest text-[#d4a373]">
                      <option value="Pensée">Pensée</option>
                      <option value="Chantier">Chantier</option>
                      <option value="Recherche">Recherche</option>
                      <option value="Matière">Matière</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-[#d4a373]">Extrait d'accroche (Excerpt)</label>
                    <textarea value={editingPost.excerpt || ''} onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})} className="w-full border-2 p-4 text-sm font-light italic h-24 outline-none focus:border-black" placeholder="Court résumé..." required />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] font-bold uppercase text-[#d4a373]">Structure de l'Essai (Blocs)</label>
                    <div className="space-y-6">
                      {(editingPost.content || []).map((block, idx) => (
                        <div key={idx} className="relative border-2 border-gray-100 p-6 bg-gray-50/20 group">
                          <div className="absolute -left-10 top-0 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => moveBlock(idx, 'up')} className="w-8 h-8 bg-white border border-gray-200 flex items-center justify-center"><i className="fa-solid fa-chevron-up text-[10px]"></i></button>
                            <button type="button" onClick={() => moveBlock(idx, 'down')} className="w-8 h-8 bg-white border border-gray-200 flex items-center justify-center"><i className="fa-solid fa-chevron-down text-[10px]"></i></button>
                            <button type="button" onClick={() => removeBlock(idx)} className="w-8 h-8 bg-white border border-red-200 text-red-500 flex items-center justify-center"><i className="fa-solid fa-trash text-[10px]"></i></button>
                          </div>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-300 mb-2 block">{block.type}</span>
                          {block.type === 'p' || block.type === 'quote' ? (
                            <textarea value={block.value} onChange={e => updateBlock(idx, e.target.value)} className={`w-full bg-transparent outline-none resize-none ${block.type === 'quote' ? 'italic text-lg serif border-l-2 border-black pl-4' : 'text-sm font-light'}`} rows={block.type === 'quote' ? 2 : 3} />
                          ) : block.type === 'h2' ? (
                            <input value={block.value} onChange={e => updateBlock(idx, e.target.value)} className="w-full bg-transparent outline-none text-xl font-bold serif" />
                          ) : (
                            <input value={block.value} onChange={e => updateBlock(idx, e.target.value)} className="w-full bg-transparent border-b py-2 text-xs outline-none" placeholder="Image URL..." />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4">
                      <button type="button" onClick={() => addBlock('p')} className="py-3 border-2 border-dashed border-gray-200 text-[8px] font-bold uppercase tracking-widest">+ Paragraphe</button>
                      <button type="button" onClick={() => addBlock('h2')} className="py-3 border-2 border-dashed border-gray-200 text-[8px] font-bold uppercase tracking-widest">+ Titre</button>
                      <button type="button" onClick={() => addBlock('quote')} className="py-3 border-2 border-dashed border-gray-200 text-[8px] font-bold uppercase tracking-widest">+ Citation</button>
                      <button type="button" onClick={() => addBlock('img')} className="py-3 border-2 border-dashed border-gray-200 text-[8px] font-bold uppercase tracking-widest">+ Image</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 pt-10 border-t-2 border-black">
                <button type="submit" className="flex-1 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] shadow-[10px_10px_0px_0px_#faedcd]">Publier dans l'Archive</button>
                <button type="button" onClick={() => setEditingPost(null)} className="px-10 py-5 border-2 border-black text-[10px] font-bold uppercase tracking-widest">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Editor Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full p-10 border-4 border-black max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-8 border-b pb-6">
               <h2 className="text-3xl font-bold serif italic">Curation de Projet</h2>
               <button onClick={() => setEditingProject(null)} className="text-2xl"><i className="fa-solid fa-xmark"></i></button>
             </div>
             <form onSubmit={(e) => { e.preventDefault(); if(editingProject) { setProjects(saveProject(editingProject)); setEditingProject(null); } }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <label className="text-[9px] font-bold uppercase text-gray-400">Image Principale (URL)</label>
                      <input value={editingProject.imageUrl || ''} onChange={e => setEditingProject({...editingProject, imageUrl: e.target.value})} className="w-full border-b-2 py-2 text-sm outline-none" required />
                      <div className="aspect-video bg-gray-50 border overflow-hidden">{editingProject.imageUrl && <img src={editingProject.imageUrl} className="w-full h-full object-cover grayscale" alt="" />}</div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[9px] font-bold uppercase text-gray-400">Détails de l'Archive</label>
                      <input value={editingProject.title || ''} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full text-xl font-bold serif border-b-2 outline-none py-2" placeholder="Titre..." required />
                      <div className="grid grid-cols-2 gap-4">
                        <input value={editingProject.year || ''} onChange={e => setEditingProject({...editingProject, year: e.target.value})} className="w-full border-b py-2 text-xs outline-none" placeholder="Année..." />
                        <input value={editingProject.location || ''} onChange={e => setEditingProject({...editingProject, location: e.target.value})} className="w-full border-b py-2 text-xs outline-none" placeholder="Lieu..." />
                      </div>
                      <textarea value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full h-40 border-2 p-4 text-sm font-light outline-none" placeholder="Récit architectural..." />
                   </div>
                </div>
                <button type="submit" className="w-full py-5 bg-black text-white text-[10px] font-bold uppercase tracking-widest shadow-[10px_10px_0px_0px_#faedcd]">Sauvegarder l'Archive</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
