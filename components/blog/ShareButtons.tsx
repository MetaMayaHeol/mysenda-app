"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Share2, Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const t = useTranslations("blog");
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Twitter,
      color: "hover:bg-zinc-800 hover:text-white",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
      color: "hover:bg-blue-700 hover:text-white",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-12">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="w-4 h-4 text-zinc-500" />
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {t("shareArticle")}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 transition-all ${link.color}`}
            aria-label={`Share on ${link.name}`}
          >
            <link.icon className="w-4 h-4" />
            {link.name}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 transition-all hover:bg-green-600 hover:text-white hover:border-green-600"
          aria-label={t("copyLink")}
        >
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          {copied ? t("copiedLink") : t("copyLink")}
        </button>
      </div>
    </div>
  );
}
