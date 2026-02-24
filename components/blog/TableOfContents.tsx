"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { List } from "lucide-react";
import { generateHeadingId } from "@/lib/blog/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const text = match[2].trim();
    const id = generateHeadingId(text);

    headings.push({
      id,
      text,
      level: match[1].length,
    });
  }

  return headings;
}

export function TableOfContents({ markdown }: { markdown: string }) {
  const t = useTranslations("blog");
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const headings = useMemo(() => extractHeadings(markdown), [markdown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <div className="mb-10 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <List className="w-4 h-4" />
          {t("tableOfContents")}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <nav className="px-5 pb-4">
          <ol className="space-y-1 border-l-2 border-zinc-200 dark:border-zinc-700">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={`${heading.level === 3 ? "ml-4" : ""}`}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(heading.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                      setActiveId(heading.id);
                    }
                  }}
                  className={`block py-1.5 pl-4 text-sm transition-colors border-l-2 -ml-[2px] ${
                    activeId === heading.id
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}

