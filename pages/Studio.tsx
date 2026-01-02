
import React, { useState } from 'react';
import { generateConceptIdea, generateArchitecturalVisual, generateCostEstimation } from '../services/geminiService';

type LabMode = 'design' | 'budget';

const Studio: React.FC = () => {
  const [mode, setMode] = useState<LabMode>('design');
  
  // Design States
  const [keywords, setKeywords] = useState('');
  const [designResult, setDesignResult] = useState<any>(null);
  
  // Budget States
  const [surface, setSurface] = useState<number>(150);
  const [standing, setStanding] = useState('Haut Standing');
  const [location, setLocation] = useState('Settat');
  const [budgetResult, setBudgetResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const handleGenerateDesign = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    setDesignResult(null);
    setLoadingStep('Analyse des paramètres tectoniques...');
    const concept = await generateConceptIdea(keywords);
    if (concept && concept.visualPrompt) {
      setLoadingStep('Génération de la synthèse visuelle...');
      const imageUrl = await generateArchitecturalVisual(concept.visualPrompt);
      setDesignResult({ ...concept, imageUrl });
    } else {
      setDesignResult(concept);
    }
    setLoading(false);
    setLoadingStep('');
  };

  const handleGenerateBudget = async () => {
    setLoading(true);
    setBudgetResult(null);
    setLoadingStep('Consultation des indices de prix Maroc 2024...');
    const estimation = await generateCostEstimation({ surface, standing, location });
    setBudgetResult(estimation);
    setLoading(false);
    setLoadingStep('');
  };

  const formatMAD = (num: number) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 animate-in fade-in duration-700">
      <div className="max-w-4xl mb-24">
        <span className="text-[10px] font-bold uppercase tracking-[1em] text-pistachio block mb-8">Intelligence Architecturale v.02</span>
        <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.85] mb-12">
          Studio <span className="text-pistachio">Lab</span>
        </h1>
        
        <div className="flex space-x-2 mt-12">
          <button 
            onClick={() => setMode('design')}
            className={`px-8 py-4 text-[9px] font-bold uppercase tracking-widest border border-black transition-all ${mode === 'design' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
          >
            Synthèse Design
          </button>
          <button 
            onClick={() => setMode('budget')}
            className={`px-8 py-4 text-[9px] font-bold uppercase tracking-widest border border-black transition-all ${mode === 'budget' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
          >
            Estimation Budget
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-12">
          <div className="border border-black p-10 bg-white shadow-[15px_15px_0px_0px_#9dbd83]">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-10 text-black/20 border-b pb-4">Configuration</h3>
            
            {mode === 'design' ? (
              <div className="space-y-8">
                <div>
                  <label className="text-[9px] text-pistachio font-bold uppercase tracking-widest mb-4 block">Intentions de Design</label>
                  <textarea 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="ex: brutalité du béton, lumière zénithale..."
                    className="w-full bg-pistachio-soft/20 border border-black p-6 outline-none focus:bg-white transition-all h-32 text-lg font-light tracking-tight resize-none"
                  />
                </div>
                <button 
                  onClick={handleGenerateDesign}
                  disabled={loading || !keywords.trim()}
                  className="w-full py-8 bg-black text-white font-bold uppercase tracking-[0.6em] text-[10px] shadow-[8px_8px_0px_0px_#9dbd83] hover:shadow-none transition-all disabled:opacity-20 flex items-center justify-center"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Lancer la Synthèse"}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <label className="text-[9px] text-pistachio font-bold uppercase tracking-widest mb-4 block">Surface Totale (m²)</label>
                  <input 
                    type="number"
                    value={surface}
                    onChange={(e) => setSurface(Number(e.target.value))}
                    className="w-full bg-pistachio-soft/20 border border-black p-4 text-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-pistachio font-bold uppercase tracking-widest mb-4 block">Niveau de Finition</label>
                  <select 
                    value={standing}
                    onChange={(e) => setStanding(e.target.value)}
                    className="w-full bg-pistachio-soft/20 border border-black p-4 text-sm font-bold uppercase"
                  >
                    <option>Économique</option>
                    <option>Moyen Standing</option>
                    <option>Haut Standing</option>
                    <option>Luxe / Exception</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-pistachio font-bold uppercase tracking-widest mb-4 block">Localisation</label>
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-pistachio-soft/20 border border-black p-4 text-sm font-bold uppercase"
                  />
                </div>
                <button 
                  onClick={handleGenerateBudget}
                  disabled={loading}
                  className="w-full py-8 bg-black text-white font-bold uppercase tracking-[0.6em] text-[10px] shadow-[8px_8px_0px_0px_#9dbd83] hover:shadow-none transition-all disabled:opacity-20 flex items-center justify-center"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Estimer le Coût"}
                </button>
              </div>
            )}
            
            {loading && (
              <p className="mt-8 text-[9px] text-center font-bold uppercase tracking-[0.3em] text-pistachio animate-pulse">
                {loadingStep}
              </p>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8">
          {mode === 'design' && designResult && (
            <div className="space-y-16 animate-in slide-in-from-right-12 duration-1000">
              <div className="border border-black p-1 bg-white shadow-[20px_20px_0px_0px_#f2f5ef] overflow-hidden">
                {designResult.imageUrl && <img src={designResult.imageUrl} className="w-full aspect-video object-cover grayscale transition-all duration-1000 hover:grayscale-0" alt="Result" />}
                <div className="p-12 space-y-10">
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">{designResult.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-pistachio mb-4">Le Concept</h4>
                       <p className="text-xl font-light text-black/70 border-l-[1px] border-black pl-8">{designResult.concept}</p>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-pistachio mb-4">Philosophie</h4>
                       <p className="text-xl font-light text-black/70">{designResult.philosophy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'budget' && budgetResult && (
            <div className="space-y-16 animate-in slide-in-from-right-12 duration-1000">
              <div className="border border-black p-12 bg-white shadow-[20px_20px_0px_0px_#f2f5ef] space-y-12">
                <div className="flex justify-between items-end border-b-2 border-black pb-8">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-pistachio">Estimation Globale (MAD)</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mt-4">
                      {formatMAD(budgetResult.totalEstimateMin)} <span className="text-2xl text-black/20">à</span> <br/>
                      {formatMAD(budgetResult.totalEstimateMax)}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Prix au m²</span>
                    <p className="text-3xl font-bold">~{formatMAD(budgetResult.pricePerMeter)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <div className="space-y-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-pistachio">Répartition Budgétaire</h4>
                    <div className="space-y-6">
                      {[
                        { label: 'Gros Œuvre (Structure)', val: budgetResult.breakdown.grosOeuvre },
                        { label: 'Second Œuvre (Finitons)', val: budgetResult.breakdown.secondOeuvre },
                        { label: 'Honoraires Architecte (5%)', val: budgetResult.breakdown.honoraires },
                        { label: 'Divers & Taxes', val: budgetResult.breakdown.divers }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[11px] font-bold uppercase tracking-tighter">
                            <span>{item.label}</span>
                            <span>{item.val}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100">
                            <div className="h-full bg-black transition-all duration-1000" style={{ width: `${item.val}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-pistachio">Contexte du Marché</h4>
                    <p className="text-lg font-light leading-relaxed text-black/70 italic border-l border-black pl-8">
                      {budgetResult.marketContext}
                    </p>
                    <div className="pt-8 space-y-4">
                      <h5 className="text-[9px] font-bold uppercase tracking-widest">Recommandations de Studio</h5>
                      <ul className="space-y-2">
                        {budgetResult.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="text-[11px] font-bold uppercase tracking-tight text-black/40">/ {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !designResult && !budgetResult && (
            <div className="h-[600px] border-[2px] border-dashed border-black/10 flex flex-col items-center justify-center text-center p-12 space-y-8 opacity-40">
              <div className="w-24 h-24 border border-black bg-white flex items-center justify-center text-4xl shadow-[10px_10px_0px_0px_#f2f5ef]">
                <i className={`fa-solid ${mode === 'design' ? 'fa-cube' : 'fa-calculator'}`}></i>
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">En attente de paramètres</h3>
                <p className="text-sm font-light uppercase tracking-widest max-w-xs">Configurez les variables dans le panneau latéral pour lancer la synthèse.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Studio;
