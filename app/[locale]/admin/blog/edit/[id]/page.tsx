import { getArticle } from "@/app/actions/blog";
import ArticleForm from "./ArticleForm";

export default async function EditArticlePage({
  params
}: {
  params: { id: string }
}) {
  const isNew = params.id === "new";
  const article = isNew ? null : await getArticle(params.id);

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
