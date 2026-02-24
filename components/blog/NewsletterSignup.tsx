"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";

export function NewsletterSignup({ locale }: { locale: string }) {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) return;
    
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
      setEmail("");
      
      // Track in GA4
      trackEvent("newsletter_signup", { method: "blog_footer" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || t("errorGeneric"));
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 md:p-10">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          {t("title")}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
          {t("subtitle")}
        </p>

        {status === "success" ? (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-4">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{t("success")}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                required
                className="w-full h-12 px-4 pr-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                disabled={status === "loading"}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("sending")}
                </>
              ) : (
                t("subscribe")
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <div className="flex items-center justify-center gap-2 text-red-500 mt-3 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage || t("errorGeneric")}</span>
          </div>
        )}

        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4">
          {t("privacy")}
        </p>
      </div>
    </div>
  );
}
