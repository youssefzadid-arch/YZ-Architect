
import React, { useState } from 'react';
import { generateConceptIdea } from '../services/geminiService';

const Studio: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    const concept = await generateConceptIdea(keywords);
    setResult(concept);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-bold tracking-tight mb-6">Design <span className="italic font-normal">Lab</span> IA</h1>
        <p className="text-lg text-gray-500 font-light leading-relaxed">
          Collaborez avec notre intelligence architecturale personnalisée. Saisissez quelques mots-clés décrivant votre vision, et laissez le studio suggérer un concept.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-gray-100 p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-100/50">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Mots-clés de Vision</label>
            <input 
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="ex: oasis désertique, verre brutaliste, bibliothèque flottante"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading || !keywords.trim()}
            className="w-full py-5 bg-black text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[0.98] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Synthétiser le Concept <i className="fa-solid fa-sparkles ml-3"></i></>
            )}
          </button>
        </div>

        {result && (
          <div className="mt-12 pt-12 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-3xl font-bold mb-4 tracking-tight text-black">{result.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-8 italic">"{result.concept}"</p>
            
            <div className="space-y-4">
              <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Palette Suggérée</h4>
              <div className="flex flex-wrap gap-2">
                {result.suggestedMaterials?.map((mat: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-10 p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start">
              <i className="fa-solid fa-circle-info text-yellow-600 mt-1 mr-3"></i>
              <p className="text-[10px] text-yellow-800 leading-relaxed">
                Ceci est une synthèse générée par IA. Pour donner vie à cette vision, veuillez réserver une consultation avec nos architectes.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { icon: 'fa-brain-circuit', title: 'Idéation Générative', text: 'Explorez rapidement des directions esthétiques.' },
          { icon: 'fa-microscope', title: 'Analyse des Matériaux', text: 'Sourcing et compatibilité assistés par IA.' },
          { icon: 'fa-leaf', title: 'Bio-simulation', text: 'Évaluation de l\'impact environnemental avant la conception.' }
        ].map((feat, i) => (
          <div key={i} className="p-8 bg-gray-50 rounded-2xl space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <i className={`fa-solid ${feat.icon} text-black`}></i>
            </div>
            <h4 className="font-bold tracking-tight uppercase text-xs">{feat.title}</h4>
            <p className="text-sm text-gray-500 font-light">{feat.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studio;
