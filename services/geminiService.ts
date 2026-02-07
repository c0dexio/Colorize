
import { GoogleGenAI } from "@google/genai";
import { Theme } from "../types";

export const generateColoringPage = async (theme: Theme): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Use a timestamp to force high variance in the prompt context
  const timestamp = Date.now();
  const prompt = `Génère un nouveau coloriage unique pour un enfant de 4 ans. 
    THÈME : ${theme}. 
    STYLE : Dessin au trait noir très épais sur fond blanc pur. Aucun remplissage, aucune ombre, aucun gris.
    CONTRAINTES : Un seul grand sujet central facile à colorier. Pas de texte, pas de signature, pas de petits détails.
    VARIATION : ${timestamp} - Crée une scène différente de la précédente.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Aucune image générée");
  } catch (error) {
    console.error("Erreur lors de la génération de l'image:", error);
    // Unique seed for fallback
    const fallbackSeed = `${theme}-${Date.now()}`;
    return `https://picsum.photos/seed/${fallbackSeed}/800/800?grayscale`;
  }
};
