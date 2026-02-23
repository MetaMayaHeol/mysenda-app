import { getArticles, deleteArticle } from "@/app/actions/blog"
import Link from "next/link"
import { Plus, Edit, Trash } from "lucide-react"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminBlogPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { locale } = await params;

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const articles = await getArticles();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Articles (AI-SEO)</h1>
        <Link 
          href={`/${locale}/admin/blog/edit/new`}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Nouvel Article
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800 border-b dark:border-zinc-700">
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-300">Titre</th>
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-300">Statut</th>
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-300">Date</th>
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">
                  Aucun article trouvé. Créez-en un pour commencer !
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="border-b dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-4">
                    <div className="font-medium">{article.title}</div>
                    <div className="text-sm text-zinc-500">{article.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${article.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        article.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                      {article.status === 'published' ? 'Publié' : article.status === 'draft' ? 'Brouillon' : 'Archivé'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-zinc-500">
                    {new Date(article.created_at).toLocaleDateString(locale)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/${locale}/admin/blog/edit/${article.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      >
                        <Edit size={18} />
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deleteArticle(article.id);
                      }}>
                        <button 
                          type="submit"
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          disabled={false}
                        >
                          <Trash size={18} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
