import { getArticle } from "@/app/actions/blog";
import ArticleForm from "./ArticleForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EditArticlePage({
  params
}: {
  params: Promise<{ id: string, locale: string }>
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { id, locale } = await params;

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const isNew = id === "new";
  const article = isNew ? null : await getArticle(id);

  if (!isNew && !article) {
    return <div className="p-8 text-center text-red-500">Article introuvable.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        {isNew ? "Créer un nouvel article" : "Modifier l'article"}
      </h1>
      <ArticleForm initialData={article} />
    </div>
  );
}
