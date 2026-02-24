/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { Send, Loader2, BookOpen, Leaf, Landmark, Sparkles } from 'lucide-react';

const SYSTEM_INSTRUCTION = `
Rôle : Tu es un journaliste d'investigation et un chercheur universitaire spécialisé en Amérique Latine. Ton objectif est de produire des articles de haute qualité, sourcés et captivants sur la culture, l'histoire, l'écologie, la biologie, la gastronomie et les initiatives locales de la région.

Ta Méthodologie :
Phase de Recherche Virtuelle : Avant de rédiger, simule une recherche dans des bases de données de confiance : IHEAL, UNESCO, CEPALC, Smithsonian Tropical Research Institute, et les réseaux de fact-checking comme LatamChequea.

Structure de l'Article :
Titre Percutant : Un titre qui évoque le fond du sujet.
Introduction (L'Accroche) : Contextualise le sujet géographiquement et historiquement.
Corps du texte (3 piliers) :
Le Fond : Histoire, données scientifiques ou faits culturels.
L'Humain : Une initiative locale, une coopérative, un artiste ou une communauté spécifique.
L'Enjeu Moderne : Le lien avec l'écologie, le numérique ou les défis sociaux actuels.
Conclusion : Une perspective d'avenir ou une réflexion sur l'identité latine.
Sources : Liste les types d'institutions ou sources consultées.

Tes Contraintes de Rédaction :
Pas de clichés : Évite les stéréotypes (ex: ne pas réduire le Mexique aux sombreros ou la Colombie à la drogue).
Précision Linguistique : Utilise des termes locaux (espagnol/portugais/langues indigènes) en les expliquant entre parenthèses.
Vérification : Si une donnée est incertaine, mentionne-le avec prudence.
Ton : Sérieux, expert, narratif et respectueux de la diversité culturelle.
`;

const EXAMPLES = [
  {
    title: "Gastronomie",
    icon: <BookOpen className="w-4 h-4" />,
    prompt: "Génère un article sur l'origine du Maïs et son importance sacrée pour les peuples des Andes, en citant une initiative de conservation des semences paysannes."
  },
  {
    title: "Écologie",
    icon: <Leaf className="w-4 h-4" />,
    prompt: "Rédige un article sur les 'Yungas' (forêts de nuages) en Argentine et en Bolivie, leur biodiversité unique et les menaces liées au changement climatique."
  },
  {
    title: "Histoire/Mystère",
    icon: <Landmark className="w-4 h-4" />,
    prompt: "Fais un article sur la cité perdue de Ciudad Perdida en Colombie (Teyuna), son architecture et la gestion actuelle par les peuples Wiwa et Kogi."
  }
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [article, setArticle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError("");
    setArticle("");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContentStream({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      for await (const chunk of response) {
        setArticle((prev) => prev + (chunk.text || ""));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de la génération de l'article.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f5f0] text-[#2b2b2b] font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r border-[#e6e8e0] p-6 flex flex-col h-auto md:h-screen sticky top-0 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-[#3c4333] mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#5a654a]" />
            LatamChronicle
          </h1>
          <p className="text-sm text-[#5a654a] leading-relaxed">
            Votre expert en journalisme d'investigation et recherche universitaire sur l'Amérique Latine.
          </p>
        </div>

        <div className="flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#909c7d] mb-4">
            Sujets d'Exemple
          </h2>
          <div className="space-y-3">
            {EXAMPLES.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(example.prompt)}
                className="w-full text-left p-4 rounded-xl border border-[#e6e8e0] hover:border-[#b1baa2] hover:bg-[#f4f5f0] transition-colors group"
              >
                <div className="flex items-center gap-2 text-[#5a654a] font-medium mb-2">
                  {example.icon}
                  {example.title}
                </div>
                <p className="text-xs text-[#748161] line-clamp-3 leading-relaxed">
                  {example.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Input Area */}
        <div className="bg-white border-b border-[#e6e8e0] p-6 shrink-0 z-10 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleGenerate} className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Quel sujet souhaitez-vous explorer aujourd'hui ?"
                className="w-full bg-[#f4f5f0] border border-[#d0d5c6] rounded-2xl py-4 pl-5 pr-16 focus:outline-none focus:ring-2 focus:ring-[#909c7d] focus:border-transparent resize-none h-28 placeholder:text-[#909c7d] text-[#2b2b2b]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="absolute bottom-4 right-4 p-3 bg-[#5a654a] text-white rounded-xl hover:bg-[#48513c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
            <p className="text-xs text-[#909c7d] mt-3 text-center">
              Appuyez sur Entrée pour générer. Maj + Entrée pour un saut de ligne.
            </p>
          </div>
        </div>

        {/* Article Display Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-3xl mx-auto">
            {!article && !isGenerating && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50 mt-20">
                <BookOpen className="w-16 h-16 text-[#b1baa2] mb-4" />
                <h3 className="text-xl font-serif text-[#5a654a]">Prêt à rédiger</h3>
                <p className="text-[#748161] max-w-md mt-2">
                  Sélectionnez un exemple dans le menu ou décrivez le sujet de votre prochain article.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 mb-6">
                {error}
              </div>
            )}

            {(article || isGenerating) && (
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#e6e8e0]">
                <div className="markdown-body">
                  <Markdown>{article}</Markdown>
                </div>
                {isGenerating && (
                  <div className="flex items-center gap-2 text-[#909c7d] mt-8 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rédaction en cours...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
