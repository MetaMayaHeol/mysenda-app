"use client";

import { useState } from "react";
import { saveArticle } from "@/app/actions/blog";
import { useRouter } from "next/navigation";

export default function ArticleForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMSG("");
    try {
      const formData = new FormData(e.currentTarget);
      if (initialData?.id) {
        formData.append("id", initialData.id);
      }
      await saveArticle(formData);
      router.push("/admin/blog"); // Will handle locale based on middleware or default behavior
    } catch (err: any) {
      setErrorMSG(err.message || "Erreur lors de l'enregistrement de l'article");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-lg shadow">
      {errorMSG && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {errorMSG}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium">Titre (H1)</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initialData?.title}
            className="w-full p-3 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="slug" className="block font-medium">URL Slug</label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={initialData?.slug}
            className="w-full p-3 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
            placeholder="mon-super-article-voyage"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="cover_image" className="block font-medium">Lien Image de Couverture (URL)</label>
        <input
          id="cover_image"
          name="cover_image"
          type="url"
          defaultValue={initialData?.cover_image}
          className="w-full p-3 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="https://imagedemonarticle.com/image.jpg"
        />
        <p className="text-xs text-zinc-500">Colle ici le lien direct vers ton image hébergée sur internet.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="block font-medium">Statut de publication</label>
        <select 
          id="status" 
          name="status" 
          defaultValue={initialData?.status || "draft"}
          className="w-full p-3 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié (Visible)</option>
          <option value="archived">Archivé</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt" className="block font-medium">Extrait (Résumé courte introduction)</label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          defaultValue={initialData?.excerpt}
          className="w-full p-3 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content_markdown" className="block font-medium">
          Contenu (Markdown) - <span className="text-zinc-500 text-sm font-normal">Format optimisé pour les LLMs (## Titres, - Listes, **Gras**)</span>
        </label>
        <textarea
          id="content_markdown"
          name="content_markdown"
          required
          rows={15}
          defaultValue={initialData?.content_markdown}
          className="w-full p-3 border rounded-md dark:border-zinc-700 dark:bg-zinc-800 font-mono text-sm"
        />
      </div>

      <div className="pt-6 border-t dark:border-zinc-800 space-y-6">
        <h3 className="text-lg font-semibold">Référencement (AI-SEO)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="meta_title" className="block font-medium text-sm">Meta Title</label>
            <input
              id="meta_title"
              name="meta_title"
              type="text"
              defaultValue={initialData?.meta_title}
              className="w-full p-2 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="keywords" className="block font-medium text-sm">Mots-clés (séparés par des virgules)</label>
            <input
              id="keywords"
              name="keywords"
              type="text"
              defaultValue={initialData?.keywords}
              className="w-full p-2 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="mot-clé 1, mot-clé 2, seo"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="meta_description" className="block font-medium text-sm">Meta Description</label>
          <textarea
            id="meta_description"
            name="meta_description"
            rows={2}
            defaultValue={initialData?.meta_description}
            className="w-full p-2 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="px-6 py-2 border dark:border-zinc-700 rounded-md mr-4 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer l'article"}
        </button>
      </div>
    </form>
  );
}
