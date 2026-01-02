
import { GoogleGenAI, Type } from "@google/genai";
import { FIRM_BIO, PROJECTS } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getArchitecturalResponse = async (userMessage: string) => {
  const ai = getAI();
  const systemInstruction = `
    Vous êtes l'assistant IA de YZ Architecte, un cabinet d'architecture de classe mondiale.
    Votre ton est professionnel, visionnaire et profondément instruit sur le design, les matériaux et la durabilité.
    Vous devez répondre exclusivement en FRANÇAIS.
    
    À propos de YZ Architecte :
    ${FIRM_BIO}
    
    Nos Projets :
    ${PROJECTS.map(p => `- ${p.title} (${p.category}) à ${p.location} : ${p.description}`).join('\n')}
    
    Directives :
    1. Répondez aux questions sur notre philosophie et nos projets.
    2. Si on vous interroge sur une nouvelle idée de design, fournissez des commentaires architecturaux sophistiqués.
    3. Gardez des réponses concises et inspirantes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Je contemple actuellement un défi de conception.";
  } catch (error) {
    console.error("Erreur API Gemini:", error);
    return "Ma connexion avec le studio est actuellement interrompue.";
  }
};

export const generateConceptIdea = async (keywords: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Générez une synthèse conceptuelle pour un projet architectural basé sur : ${keywords}.
      Le ton doit être celui de YZ Architecte (Régionalisme Critique, vérité des matériaux, ancrage territorial).
      Répondez en FRANÇAIS. Format JSON uniquement.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            concept: { type: Type.STRING },
            philosophy: { type: Type.STRING, description: "L'ancrage théorique du projet" },
            suggestedMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
            visualPrompt: { type: Type.STRING, description: "Un prompt détaillé en ANGLAIS pour générer un rendu architectural de ce concept." }
          },
          required: ["title", "concept", "philosophy", "suggestedMaterials", "visualPrompt"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erreur Génération Concept:", error);
    return null;
  }
};

export const generateCostEstimation = async (params: { surface: number, standing: string, location: string }) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Estimez le coût de construction au Maroc (en MAD - Dirhams) pour un projet de ${params.surface}m2 avec un standing ${params.standing} à ${params.location}.
      Basez-vous sur les prix actuels du marché marocain 2024.
      IMPORTANT : Fixez les honoraires de l'architecte à exactement 5% du budget total.
      Répondez en FRANÇAIS. Format JSON uniquement.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalEstimateMin: { type: Type.NUMBER },
            totalEstimateMax: { type: Type.NUMBER },
            pricePerMeter: { type: Type.NUMBER },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                grosOeuvre: { type: Type.NUMBER, description: "Pourcentage du coût pour la structure" },
                secondOeuvre: { type: Type.NUMBER, description: "Pourcentage pour les finitions" },
                honoraires: { type: Type.NUMBER, description: "Doit être fixé à 5 (pour 5%)" },
                divers: { type: Type.NUMBER }
              },
              required: ["grosOeuvre", "secondOeuvre", "honoraires", "divers"]
            },
            marketContext: { type: Type.STRING, description: "Bref commentaire sur les prix actuels des matériaux au Maroc (ciment, acier, pierre locale)." },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["totalEstimateMin", "totalEstimateMax", "pricePerMeter", "breakdown", "marketContext", "recommendations"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erreur Estimation Coût:", error);
    return null;
  }
};

export const generateArchitecturalVisual = async (prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-end architectural visualization, ${prompt}. Minimalist aesthetic, dramatic lighting, sharp lines, tectonic focus, wide-angle shot, photorealistic, 4k.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Erreur Génération Image:", error);
    return null;
  }
};
