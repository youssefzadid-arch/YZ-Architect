
import { GoogleGenAI, Type } from "@google/genai";
import { FIRM_BIO, PROJECTS } from "../constants";

// Fix: Use process.env.API_KEY directly as per SDK guidelines
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
    4. Si quelqu'un demande à "prendre contact", suggérez-lui d'utiliser le formulaire de contact ou de nous rendre visite en personne.
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

    // Fix: Access .text property directly (not a method)
    return response.text || "Je contemple actuellement un défi de conception. Pourriez-vous reformuler ?";
  } catch (error) {
    console.error("Erreur API Gemini:", error);
    return "Je m'excuse, mais ma connexion avec le studio est actuellement interrompue. Veuillez réessayer dans un instant.";
  }
};

export const generateConceptIdea = async (keywords: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Générez une courte description poétique de concept architectural basée sur ces mots-clés : ${keywords}. Répondez en FRANÇAIS. Formatez en JSON avec "title", "concept", et "suggestedMaterials".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            concept: { type: Type.STRING },
            suggestedMaterials: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "concept", "suggestedMaterials"]
        }
      }
    });
    // Fix: Access .text property directly (not a method)
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erreur Génération Concept:", error);
    return null;
  }
};
