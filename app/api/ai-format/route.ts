import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { articleContent } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("Missing OPENROUTER_API_KEY. Veuillez configurer la clé API dans le fichier .env");
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const systemPrompt = `Tu es un assistant éditorial expert en SEO et formatage de contenu pour un blog.
Ton rôle est d'analyser un article en format Markdown et d'en extraire les métadonnées pertinentes en format JSON STRICT.

Tu dois retourner un objet JSON avec les clés suivantes :
- "title": Le titre principal de l'article (généralement le H1 ou le premier titre, sans le '#').
- "slug": Une version URL-friendly du titre (ex: "le-mais-sacre-des-andes"), en minuscules, sans accents.
- "excerpt": Un résumé court et percutant de l'article (environ 2-3 phrases, maximum 160 caractères).
- "meta_title": Un titre optimisé pour le SEO (souvent similaire au titre principal, maximum 60 caractères).
- "meta_description": Une description optimisée pour le SEO (souvent similaire à l'excerpt, maximum 160 caractères).
- "keywords": Une chaîne de caractères contenant 5 à 8 mots-clés pertinents séparés par des virgules.

CRITIQUE: Tu dois IMPÉRATIVEMENT écrire le JSON dans la MÊME LANGUE que l'article fourni en entrée (que ce soit en français, anglais, espagnol, etc.).

IMPORTANT: Ne renvoie QUE du JSON valide. N'ajoute pas de texte avant ou après, pas de balises markdown \`\`\`json. Juste l'objet JSON brut.`;

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash", // Or anthropic/claude-3-haiku
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Voici l'article Markdown à analyser :\n\n${articleContent}` }
      ],
      temperature: 0.1, // Low temperature for consistent JSON output
    });

    const result = response.choices[0]?.message?.content || "{}";
    
    // Attempt to parse to ensure it's valid JSON before sending back
    try {
      // Clean up markdown code blocks if the LLM still included them
      const cleanedResult = result.replace(/```json\n|```\n|```/g, "").trim();
      const parsedData = JSON.parse(cleanedResult);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse LLM response as JSON:", result);
      throw new Error("L'IA n'a pas renvoyé un format JSON valide.");
    }
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
