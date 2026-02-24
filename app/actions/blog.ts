"use server";

import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";

export async function getArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_articles")
    .select("*, blog_categories(title, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
  return data;
}

export async function getPublishedArticles() {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("blog_articles")
    .select("*, blog_categories(title, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching published articles:", error);
    return [];
  }
  return data;
}

export async function getArticle(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching article:", error);
    return null;
  }
  return data;
}

export async function getArticleBySlug(slug: string) {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("blog_articles")
    .select("*, blog_categories(title, slug)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
  return data;
}

export async function saveArticle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Vérification stricte: l'utilisateur doit être un administrateur et autorisé via l'email
  await requireAdmin();

  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content_markdown = formData.get("content_markdown") as string;
  const excerpt = formData.get("excerpt") as string;
  const status = formData.get("status") as string;
  const meta_title = formData.get("meta_title") as string;
  const meta_description = formData.get("meta_description") as string;
  const keywords = formData.get("keywords") as string;
  const cover_image = formData.get("cover_image") as string;
  const cover_image_alt = formData.get("cover_image_alt") as string;

  const articleData = {
    title,
    slug,
    content_markdown,
    excerpt,
    status,
    meta_title,
    meta_description,
    keywords,
    cover_image,
    structured_data: { 
      // Si un jour on utilise ces champs, au moins object json existe 
      cover_image_alt: cover_image_alt || title 
    },
    author_id: user.id,
    updated_at: new Date().toISOString(),
  };

  if (status === 'published') {
    (articleData as any).published_at = new Date().toISOString();
  }

  if (id) {
    // Update
    const { error } = await supabase
      .from("blog_articles")
      .update(articleData)
      .eq("id", id);
      
    if (error) throw error;
  } else {
    // Insert
    const { error } = await supabase
      .from("blog_articles")
      .insert(articleData);
      
    if (error) throw error;
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function getRelatedArticles(currentArticleId: string, categorySlug?: string, limit = 3) {
  const supabase = createStaticClient();
  
  let query = supabase
    .from("blog_articles")
    .select("id, title, slug, excerpt, cover_image, published_at, blog_categories(title, slug)")
    .eq("status", "published")
    .neq("id", currentArticleId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (categorySlug) {
    // Try to get articles from the same category first
    const { data: categoryArticles, error: catError } = await supabase
      .from("blog_articles")
      .select("id, title, slug, excerpt, cover_image, published_at, blog_categories!inner(title, slug)")
      .eq("status", "published")
      .eq("blog_categories.slug", categorySlug)
      .neq("id", currentArticleId)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (!catError && categoryArticles && categoryArticles.length > 0) {
      return categoryArticles;
    }
  }

  // Fallback: latest articles excluding the current one
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
  return data || [];
}

export async function getArticlesByCategory(categorySlug: string) {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("blog_articles")
    .select("*, blog_categories!inner(title, slug)")
    .eq("status", "published")
    .eq("blog_categories.slug", categorySlug)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles by category:", error);
    return [];
  }
  return data || [];
}

export async function getCategories() {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data || [];
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_articles")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
