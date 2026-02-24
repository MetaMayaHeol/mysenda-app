"use client";

import { useState } from "react";
import { saveArticle } from "@/app/actions/blog";
import { useRouter } from "next/navigation";
import AIGenerator from "@/components/admin/blog/AIGenerator";
import { createClient } from "@/lib/supabase/client";
import { Copy, Check, Upload, ImageIcon } from "lucide-react";
import imageCompression from 'browser-image-compression';

export default function ArticleForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState(initialData?.content_markdown || "");
  const [formDataState, setFormDataState] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
    keywords: initialData?.keywords || "",
    cover_image: initialData?.cover_image || "",
    cover_image_alt: initialData?.structured_data?.cover_image_alt || "",
  });
  const [isFormatting, setIsFormatting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const supabase = createClient();

  const handleAIInsert = (text: string) => {
    setContentMarkdown((prev: string) => prev ? prev + "\n\n" + text : text);
  };

  const handleAutoFormat = async () => {
    if (!contentMarkdown) {
      setErrorMSG("Veuillez d'abord générer ou insérer un contenu Markdown dans la zone de texte.");
      return;
    }
    
    setIsFormatting(true);
    setErrorMSG("");
    try {
      const res = await fetch('/api/ai-format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleContent: contentMarkdown })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur lors du formatage automatique");
      }
      
      const extractedData = await res.json();
      setFormDataState(prev => ({
        ...prev,
        title: extractedData.title || prev.title,
        slug: extractedData.slug || prev.slug,
        excerpt: extractedData.excerpt || prev.excerpt,
        meta_title: extractedData.meta_title || prev.meta_title,
        meta_description: extractedData.meta_description || prev.meta_description,
        keywords: extractedData.keywords || prev.keywords,
      }));
    } catch (err: any) {
      setErrorMSG(err.message || "Erreur de connexion AI.");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setErrorMSG("");
    setUploadedImageUrl("");

    try {
      // 1. Compression
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: false, // Fixes CSP issue (eval/CDN script injection)
      };
      setUploadProgress(30);
      const compressedFile = await imageCompression(file, options);
      
      // 2. Upload to Supabase Storage
      setUploadProgress(50);
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('public_images')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      setUploadProgress(80);

      // 3. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public_images')
        .getPublicUrl(filePath);

      setUploadedImageUrl(publicUrl);
      setUploadProgress(100);

    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMSG(err.message || 'Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const copyToClipboard = () => {
    if (!uploadedImageUrl) return;
    navigator.clipboard.writeText(`![Description de l'image](${uploadedImageUrl})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMSG("");
    try {
      const formData = new FormData(e.currentTarget);
      if (initialData?.id) {
        formData.append("id", initialData.id);
      }
      formData.append("cover_image_alt", formDataState.cover_image_alt);
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
            value={formDataState.title}
            onChange={(e) => setFormDataState({...formDataState, title: e.target.value})}
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
            value={formDataState.slug}
            onChange={(e) => setFormDataState({...formDataState, slug: e.target.value})}
            className="w-full p-3 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
            placeholder="mon-super-article-voyage"
          />
        </div>
      </div>
      
      <div className="space-y-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <div className="flex justify-between items-center">
          <label className="block font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> 
            Héberger une image (Couverture ou Contenu)
          </label>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 px-4 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-sm flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {isUploading ? "Compression & Envoi..." : "Sélectionner une image"}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
          
          {isUploading && (
            <div className="flex-1 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
        </div>

        {uploadedImageUrl && (
          <div className="mt-4 p-3 bg-white dark:bg-zinc-900 border border-green-200 dark:border-green-900/50 rounded-md">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">Image hébergée avec succès !</p>
            <div className="flex gap-2 items-center">
              <input 
                type="text" 
                readOnly 
                value={uploadedImageUrl} 
                className="flex-1 text-xs p-2 bg-zinc-50 dark:bg-zinc-800 border rounded"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded transition-colors flex items-center gap-1 text-xs"
                title="Copier le code Markdown"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copié !" : "Copier le code Markdown"}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              👉 Pour l'image de couverture, copie l'URL ci-dessus dans le champ "Lien Image de Couverture".<br/>
              👉 Pour l'insérer dans l'article, clique sur "Copier le code Markdown" et colle-le dans la zone "Contenu", tu pourras y ajouter ta légende entre les crochets `[Légende ici]`.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="cover_image" className="block font-medium">Lien Image de Couverture (URL)</label>
        <input
          id="cover_image"
          name="cover_image"
          type="text"
          value={formDataState.cover_image}
          onChange={(e) => {
            let val = e.target.value;
            let alt = formDataState.cover_image_alt;
            // Extraction robuste : tolère les sauts de ligne ou espaces
            const match = val.match(/!\[([\s\S]*?)\]\((.*?)\)/);
            if (match && match[2]) {
              alt = match[1];
              val = match[2];
            }
            setFormDataState({...formDataState, cover_image: val, cover_image_alt: alt});
          }}
          className="w-full p-3 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="https://imagedemonarticle.com/image.jpg"
        />
        
        {formDataState.cover_image_alt && (
          <div className="mt-2 text-sm text-green-600 dark:text-green-400">
            ✓ Légende détectée : "{formDataState.cover_image_alt.length > 50 ? formDataState.cover_image_alt.substring(0, 50) + "..." : formDataState.cover_image_alt}"
          </div>
        )}
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
          value={formDataState.excerpt}
          onChange={(e) => setFormDataState({...formDataState, excerpt: e.target.value})}
          className="w-full p-3 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="content_markdown" className="block font-medium">
            Contenu (Markdown) - <span className="text-zinc-500 text-sm font-normal">Format optimisé pour les LLMs (## Titres, - Listes, **Gras**)</span>
          </label>
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={handleAutoFormat}
              disabled={isFormatting || !contentMarkdown.trim()}
              className="text-xs px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-700 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              {isFormatting ? "Formatage..." : "Auto-remplir le formulaire"}
            </button>
            <AIGenerator onInsert={handleAIInsert} />
          </div>
        </div>
        <textarea
          id="content_markdown"
          name="content_markdown"
          required
          rows={15}
          value={contentMarkdown}
          onChange={(e) => setContentMarkdown(e.target.value)}
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
              value={formDataState.meta_title}
              onChange={(e) => setFormDataState({...formDataState, meta_title: e.target.value})}
              className="w-full p-2 border rounded-md dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="keywords" className="block font-medium text-sm">Mots-clés (séparés par des virgules)</label>
            <input
              id="keywords"
              name="keywords"
              type="text"
              value={formDataState.keywords}
              onChange={(e) => setFormDataState({...formDataState, keywords: e.target.value})}
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
            value={formDataState.meta_description}
            onChange={(e) => setFormDataState({...formDataState, meta_description: e.target.value})}
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
