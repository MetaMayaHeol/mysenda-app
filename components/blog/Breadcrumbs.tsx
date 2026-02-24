"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, locale }: { items: BreadcrumbItem[]; locale: string }) {
  const t = useTranslations("blog");

  const allItems: BreadcrumbItem[] = [
    { label: t("breadcrumbHome"), href: `/${locale}` },
    ...items,
  ];

  // Schema.org BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${process.env.NEXT_PUBLIC_APP_URL || "https://mysenda.com"}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center flex-wrap gap-1 text-sm text-zinc-500 dark:text-zinc-400">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />}
              {item.href && index < allItems.length - 1 ? (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[200px]">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
