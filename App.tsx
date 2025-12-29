
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import { getSettings } from './services/storageService';
import { StudioSettings } from './types';

const Home = lazy(() => import('./pages/Home'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Studio = lazy(() => import('./pages/Studio'));
const Philosophy = lazy(() => import('./pages/Philosophy'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));

const LoadingScreen = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#fdfaf6]">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400">Synchronisation du lieu</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [settings, setSettings] = useState<StudioSettings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
    const handleStorage = () => setSettings(getSettings());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-black selection:text-white bg-[#fdfaf6]">
        <Navbar />
        
        <main className="flex-grow pt-24">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/philosophy" element={<Philosophy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="bg-[#1a1a1a] text-white py-24 px-6 border-t-[8px] border-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 items-start">
            <div className="md:col-span-2">
              <div className="text-3xl font-bold tracking-tighter mb-6 serif">
                {settings?.firmName.split(' ')[0] || "YZ"} <span className="font-light text-gray-500 italic">{settings?.firmName.split(' ').slice(1).join(' ') || "ARCHITECTE"}</span>
              </div>
              <p className="text-[11px] text-gray-400 uppercase tracking-[0.4em] leading-relaxed max-w-sm">
                {settings?.bio || "Une pratique architecturale à Settat dédiée à la vérité des matériaux et à l'ancrage territorial."}
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#d4a373]">Studio Settat</h4>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                {settings?.location || "Settat, Maroc"}<br/>
                {settings?.phone}
              </p>
            </div>

            <div className="flex flex-col space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Link to="/blog" className="hover:text-white transition-colors">Le Journal</Link>
              <Link to="/philosophy" className="hover:text-white transition-colors">Manifeste</Link>
              <a href={settings?.whatsapp} className="hover:text-white transition-colors">WhatsApp</a>
              <Link to="/admin" className="hover:text-white transition-colors">Accès Archive</Link>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-[9px] text-gray-600 uppercase tracking-widest flex justify-between">
            <span>© 2024 {settings?.firmName || "YZ Architecte"}.</span>
            <span className="italic">Régionalisme Critique • {settings?.firmSub || "Settat"}</span>
          </div>
        </footer>

        <ChatBot />
      </div>
    </Router>
  );
};

export default App;
