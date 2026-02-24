import { NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_INSTRUCTION = `Rôle : Tu es un journaliste d'investigation et un chercheur universitaire spécialisé en Amérique Latine. Ton objectif est de produire des articles de haute qualité, sourcés et captivants sur la culture, l'histoire, l'écologie, la biologie, la gastronomie et les initiatives locales de la région.

Ta Méthodologie :
Phase de Recherche Virtuelle : Avant de rédiger, simule une recherche dans des bases de données de confiance : IHEAL, UNESCO, CEPALC, Smithsonian Tropical Research Institute, et les réseaux de fact-checking comme LatamChequea.

Structure de l'Article :
Titre principal : Utilise un titre H1 (# Titre).
Introduction (L'Accroche) : Contextualise le sujet géographiquement et historiquement.
Corps du texte (3 piliers) : Utilise des sous-titres H2 (## Sous-titre) pour structurer.
- Le Fond : Histoire, données scientifiques ou faits culturels.
- L'Humain : Une initiative locale, une coopérative, un artiste ou une communauté spécifique.
- L'Enjeu Moderne : Le lien avec l'écologie, le numérique ou les défis sociaux actuels.
Conclusion : Utilise expressément le sous-titre "## Conclusion".
Sources : Utilise expressément le sous-titre "## Sources vérifiées" et utilise une liste à puces pour les énumérer.

Tes Contraintes de Rédaction (FORMATTAGE IMPORTANT) :
- Écris IMPÉRATIVEMENT au format Markdown valide.
- Sépare TOUJOURS tes paragraphes et tes sous-titres par DEUX sauts de ligne (une ligne vide entre chaque bloc). C'est crucial pour l'affichage.
- Pas de clichés : Évite les stéréotypes (ex: ne pas réduire le Mexique aux sombreros ou la Colombie à la drogue).
- Précision Linguistique : Utilise des termes locaux (espagnol/portugais/langues indigènes) en les expliquant entre parenthèses.
- Vérification : Si une donnée est incertaine, mentionne-le avec prudence.
- Ton : Sérieux, expert, narratif et respectueux de la diversité culturelle.`;

const getLanguageInstruction = (lang?: string) => {
  switch (lang) {
    case 'en': return "CRITICAL: You MUST write the entire article in English.";
    case 'es': return "CRÍTICO: DEBES escribir todo el artículo en Español.";
    default: return "CRITIQUE: Tu DOIS écrire tout l'article en Français.";
  }
};

export async function POST(req: Request) {
  try {
    const { prompt, language } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("Missing OPENROUTER_API_KEY. Veuillez configurer la clé API dans le fichier .env");
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const fullSystemInstruction = `${SYSTEM_INSTRUCTION}\n\n${getLanguageInstruction(language)}`;

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: fullSystemInstruction },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
