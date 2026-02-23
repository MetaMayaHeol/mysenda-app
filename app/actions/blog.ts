"use server";

import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { revalidatePath } from "next/cache";

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

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_articles")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
