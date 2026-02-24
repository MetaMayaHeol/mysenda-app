"use client";

import dynamic from 'next/dynamic';

const ArticleFormDynamic = dynamic(() => import('./ArticleForm'), { 
  ssr: false, 
  loading: () => <div className="p-8 text-center text-zinc-500">Chargement de l'éditeur...</div> 
});

export default function ArticleFormWrapper({ initialData }: { initialData?: any }) {
  return <ArticleFormDynamic initialData={initialData} />
}
