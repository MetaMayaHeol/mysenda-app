"use client";

import { useState } from 'react';
import Markdown from 'react-markdown';
import { Send, Loader2, BookOpen, Leaf, Landmark, Sparkles } from 'lucide-react';

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

export default function AIGenerator({ onInsert }: { onInsert: (text: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [article, setArticle] = useState("");
  const [language, setLanguage] = useState("fr");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError("");
    setArticle("");

    try {
      const response = await fetch('/api/ai-writer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, language }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Une erreur est survenue lors de la génération.");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Impossible de lire la réponse.");

      const decoder = new TextDecoder();
      let done = false;
      let fullArticle = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkStr = decoder.decode(value, { stream: !done });
          setArticle((prev) => prev + chunkStr);
          fullArticle += chunkStr;
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    onInsert(article);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
      >
        <Sparkles className="w-4 h-4" />
        Générer avec LatamChronicle AI
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-hidden">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-6xl rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden border dark:border-zinc-800 max-h-[90vh]">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-zinc-50 dark:bg-zinc-950 border-r dark:border-zinc-800 p-6 flex flex-col overflow-y-auto">
          <div className="mb-6 mt-2">
            <h2 className="text-xl font-serif font-bold dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              LatamChronicle
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed mb-4">
              Assistant IA de recherche et journalisme spécialisé sur l'Amérique Latine.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Langue de rédaction
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Sujets d'Exemple
            </h3>
            <div className="space-y-3">
              {EXAMPLES.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(example.prompt)}
                  className="w-full text-left p-3 rounded-lg border dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-white dark:hover:bg-zinc-900 transition-colors group"
                >
                  <div className="flex items-center gap-2 font-medium mb-1 dark:text-zinc-200 text-sm">
                    {example.icon}
                    {example.title}
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-2">
                    {example.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-6 px-4 py-2 text-sm border dark:border-zinc-800 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Fermer l'assistant
          </button>
        </aside>

        {/* Main Interface */}
        <main className="flex-1 flex flex-col bg-white dark:bg-zinc-900 relative">
          {/* Header/Input */}
          <div className="p-6 shrink-0 border-b dark:border-zinc-800">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Quel sujet d'article souhaitez-vous explorer ?"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl py-3 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isGenerating && prompt.trim()) {
                      handleGenerate();
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800">
            {!article && !isGenerating && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <BookOpen className="w-12 h-12 mb-3" />
                <p className="text-sm mt-2 max-w-sm">
                  Décrivez le sujet ou choisissez un exemple à gauche. Le contenu généré s'affichera ici.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900 mb-6 text-sm">
                {error}
              </div>
            )}

            {(article || isGenerating) && (
              <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base bg-zinc-50 dark:bg-zinc-950 p-6 rounded-xl border dark:border-zinc-800 border-zinc-100">
                <Markdown>{article}</Markdown>
                {isGenerating && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-blue-600 dark:text-blue-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rédaction en cours...
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 flex justify-end">
            <button
              type="button"
              onClick={handleInsert}
              disabled={!article || isGenerating}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Insérer dans l'article courant
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
