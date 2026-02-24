# 📊 Audit SEO & Plan de Monétisation — MySenda Blog

> **Date de l'audit** : 24 février 2026
> **Domaine** : mysenda.com
> **Stack** : Next.js 16 · Supabase · next-intl (es/fr/en) · Vercel · OpenRouter (Gemini)
> **Objectif** : Maximiser le référencement organique du blog sur l'Amérique latine pour générer des revenus passifs via le trafic.

---

## Table des matières

1. [État des lieux](#1-état-des-lieux)
2. [Problèmes critiques](#2-problèmes-critiques)
3. [Problèmes importants](#3-problèmes-importants)
4. [Améliorations recommandées](#4-améliorations-recommandées)
5. [Plan d'action par phases](#5-plan-daction-par-phases)
6. [Scores actuels vs cibles](#6-scores-actuels-vs-cibles)
7. [Suivi de progression](#7-suivi-de-progression)

---

## 1. État des lieux

### ✅ Ce qui est déjà en place

| Élément | Fichier(s) | Statut |
|---------|-----------|--------|
| Sitemap dynamique | `app/sitemap.ts` | ✅ Articles + pages statiques indexés |
| Robots.txt | `app/robots.ts` | ✅ Dashboard/auth/api exclus |
| Meta tags basiques | `app/[locale]/blog/[slug]/page.tsx` | ✅ title, description, OG, keywords |
| JSON-LD BlogPosting | `app/[locale]/blog/[slug]/page.tsx` | ⚠️ Partiel (voir section 3) |
| Champs SEO dans l'admin | `ArticleForm.tsx` | ✅ meta_title, meta_description, keywords |
| Internationalisation (i18n) | `next-intl` avec es/fr/en | ⚠️ Structure OK mais contenu non traduit |
| Upload & compression d'images | `ArticleForm.tsx` | ✅ Via Supabase Storage |
| Structured Data helpers | `lib/seo/structured-data.ts` | ⚠️ Existent mais peu/pas utilisés sur le blog |
| Vercel Analytics | `layout.tsx` | ✅ En place |
| Headers de sécurité | `next.config.ts` | ✅ HSTS, CSP, X-Frame-Options |

### ❌ Ce qui manque

- Google Analytics 4
- Google Search Console
- Google AdSense / source de revenus
- Newsletter / capture d'emails
- Maillage interne (articles liés)
- Contenu réellement multilingue
- Pages catégories
- Breadcrumbs visuels & Schema.org
- Partage social
- RSS Feed

---

## 2. Problèmes critiques

> Impact direct et fort sur le référencement. À résoudre en priorité absolue.

### 2.1 🔴 Contenu hardcodé en français — Duplicate content multilingue

**Fichiers concernés** :
- `app/[locale]/page.tsx` (page d'accueil)
- `app/[locale]/blog/page.tsx` (listing blog)
- `components/layout/Header.tsx`

**Problème** :
Tout le texte visible est écrit en dur en français :
- Page d'accueil : « Découvrez l'âme du voyage hors des sentiers battus », « Derniers Articles », etc.
- Page blog : « Carnets de Voyage & Guides », metadata en français
- Header : lien "Carnets" en français

**Conséquence** :
Les 3 variantes linguistiques (`/es/blog`, `/fr/blog`, `/en/blog`) servent le même contenu français → Google détecte du **duplicate content** sur 3 URLs et peut dé-indexer les doublons. Les utilisateurs hispanophones/anglophones quittent immédiatement la page.

**Solution** :
Utiliser `useTranslations()` (côté client) ou `getTranslations()` (côté serveur) de `next-intl` pour tous les textes. Ajouter les clés dans `messages/en.json`, `messages/es.json`, `messages/fr.json`.

---

### 2.2 🔴 Absence de `hreflang` et `canonical` sur les pages articles

**Fichier concerné** : `app/[locale]/blog/[slug]/page.tsx`

**Problème** :
- `generateMetadata()` ne définit ni `alternates.canonical` ni `alternates.languages`
- Le layout (`layout.tsx`) définit `alternates` uniquement pour la page d'accueil (`/{locale}`) et oublie `en`
- Les articles n'existent qu'en une seule langue dans la DB (pas de champ `locale`)

**Conséquence** :
Google ne sait pas quelle version linguistique servir. Risque de cannibalisation entre `/es/blog/slug`, `/fr/blog/slug` et `/en/blog/slug`.

**Solution** :
```tsx
// Dans generateMetadata de blog/[slug]/page.tsx
alternates: {
  canonical: `/${locale}/blog/${slug}`,
  languages: {
    'es': `/es/blog/${slug}`,
    'fr': `/fr/blog/${slug}`,
    'en': `/en/blog/${slug}`,
  },
},
```

---

### 2.3 🔴 Utilisation de `<img>` au lieu de `next/image`

**Fichiers concernés** :
- `app/[locale]/blog/[slug]/page.tsx` (image de couverture)
- `app/[locale]/blog/page.tsx` (cards articles)
- `app/[locale]/page.tsx` (cards articles sur la home)

**Problème** :
Toutes les images de couverture utilisent des balises `<img>` HTML natives au lieu du composant `<Image>` de Next.js.

**Conséquence** :
- Pas de lazy loading automatique
- Pas de conversion WebP/AVIF
- Pas de responsive `srcset`
- **LCP (Largest Contentful Paint) dégradé** → pénalité Core Web Vitals → pénalité SEO directe

**Solution** :
Remplacer par `<Image>` de `next/image` avec `width`, `height`, `sizes` et `alt` descriptif.

---

### 2.4 🔴 Pas de `generateStaticParams` pour les articles

**Fichier concerné** : `app/[locale]/blog/[slug]/page.tsx`

**Problème** :
La page article n'exporte pas `generateStaticParams()` → les pages ne sont pas pré-rendues statiquement au build (SSG). Chaque visite déclenche un rendu côté serveur.

**Conséquence** :
- TTFB (Time to First Byte) plus élevé
- Moins de pages en cache CDN
- Score de performance inférieur

**Solution** :
```tsx
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data: articles } = await supabase
    .from('blog_articles')
    .select('slug')
    .eq('status', 'published');

  const locales = ['es', 'fr', 'en'];
  return (articles || []).flatMap(article =>
    locales.map(locale => ({ locale, slug: article.slug }))
  );
}

export const revalidate = 3600; // Revalide chaque heure
```

---

## 3. Problèmes importants

> Impact moyen sur le référencement. À résoudre dans un second temps.

### 3.1 🟠 JSON-LD BlogPosting incomplet

**Fichier** : `app/[locale]/blog/[slug]/page.tsx` (lignes 39-50)

**Champs manquants** :
```json
{
  "description": "article.meta_description || article.excerpt",
  "wordCount": 1500,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://mysenda.com/fr/blog/slug"
  },
  "publisher": {
    "@type": "Organization",
    "name": "MySenda",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mysenda.com/icon-512.png"
    }
  },
  "articleSection": "Culture",
  "inLanguage": "fr"
}
```

**Conséquence** : Les rich snippets Google (extraits enrichis) ne s'affichent pas ou sont incomplets.

---

### 3.2 🟠 Pas de breadcrumbs sur le blog

**Problème** :
- `generateBreadcrumbSchema()` existe dans `lib/seo/structured-data.ts` mais n'est **jamais appelée** sur les pages blog.
- Aucun breadcrumb visuel affiché (Accueil > Blog > Catégorie > Article).

**Conséquence** : Pas de chemin de navigation dans les SERPs Google. Mauvais signal de structure du site.

**Solution** :
Ajouter un composant `<Breadcrumbs>` + le JSON-LD associé sur chaque page article et la page listing.

---

### 3.3 🟠 Pas d'articles liés / recommandations

**Problème** :
En fin d'article, il n'y a aucune section « Articles similaires » ou « À lire aussi ».

**Conséquence** :
- Taux de rebond élevé (le visiteur quitte après un article)
- Faible durée de session (mauvais signal SEO)
- Pas de maillage interne entre articles (le PageRank ne circule pas)

**Solution** :
Requêter 3-4 articles de la même catégorie et les afficher en grille en bas de page.

---

### 3.4 🟠 Pas de table des matières (ToC) automatique

**Problème** :
Les articles générés par l'IA sont longs (structure H2/H3) mais aucune table des matières n'est générée.

**Conséquence** :
- Mauvaise UX sur mobile pour les longs articles
- Pas de **sitelinks** dans les résultats Google (les liens vers les sections)
- Taux de rebond plus élevé

**Solution** :
Parser les headings `##` du markdown et générer une ToC avec ancres `id` automatiques.

---

### 3.5 🟠 Pas de pages catégorie

**Problème** :
La table `blog_categories` existe dans Supabase mais il n'y a aucune route `/blog/category/[slug]`.

**Conséquence** :
- Pas de landing pages thématiques (ex: `/blog/category/gastronomie`, `/blog/category/ecologie`)
- Ces pages sont d'excellentes portes d'entrée SEO pour des requêtes de type « blog gastronomie amérique latine »

**Solution** :
Créer `app/[locale]/blog/category/[slug]/page.tsx` avec filtrage par catégorie.

---

### 3.6 🟠 CSP incompatible avec AdSense/GA4

**Fichier** : `next.config.ts` (ligne 58)

La Content-Security-Policy actuelle ne permet pas de charger les scripts Google :
- `script-src` n'inclut pas `https://www.googletagmanager.com`, `https://pagead2.googlesyndication.com`
- `connect-src` n'inclut pas `https://www.google-analytics.com`

**Solution** :
Adapter la CSP quand on intègrera GA4/AdSense.

---

### 3.7 🟠 Pas de temps de lecture estimé

**Solution rapide** :
```tsx
function getReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.ceil(words / 200); // 200 mots/min
}
```

---

## 4. Améliorations recommandées

> Optimisations qui améliorent la croissance à long terme.

### 4.1 🟡 Intégrer Google Analytics 4 + Search Console

- **GA4** : Suivre le comportement utilisateur, pages les plus vues, sources de trafic, taux de conversion
- **Search Console** : Voir les requêtes qui amènent du trafic, les pages indexées, les erreurs de crawl

**Action** : Créer un compte GA4, obtenir le `G-XXXXXXXXXX`, l'intégrer via `next/script` ou le composant officiel.

---

### 4.2 🟡 Newsletter / Capture d'emails

Vous avez déjà **Resend** en dépendance. Créer :
1. Un formulaire email en fin d'article et sur la page blog
2. Une table `newsletter_subscribers` dans Supabase
3. Un envoi hebdomadaire des nouveaux articles via Resend

---

### 4.3 🟡 Mettre à jour `llms.txt` et `manifest.json`

Ces fichiers décrivent encore MySenda comme une plateforme de guides touristiques. Les mettre à jour pour refléter le positionnement blog.

---

### 4.4 🟡 Rendre le générateur IA multilingue

Le prompt dans `app/api/ai-writer/route.ts` ne génère qu'en français. Ajouter un paramètre `language` pour produire du contenu en es/en aussi.

---

### 4.5 🟡 RSS Feed

Créer `app/feed.xml/route.ts` ou `app/rss.xml/route.ts` pour que les agrégateurs (Feedly, etc.) puissent s'abonner au blog.

---

### 4.6 🟡 Boutons de partage social

Ajouter des boutons de partage (Twitter/X, Facebook, LinkedIn, WhatsApp) sur chaque article pour augmenter la diffusion organique.

---

### 4.7 🟡 Images OG dynamiques

Utiliser `next/og` pour générer automatiquement des images OpenGraph avec le titre de l'article sur un fond stylé → meilleur CTR sur les réseaux sociaux.

---

## 5. Plan d'action par phases

### Phase 1 : Fondations SEO (Semaine 1-2) — PRIORITÉ ABSOLUE

| # | Tâche | Fichier(s) à modifier | Complexité | Statut |
|---|-------|-----------------------|:----------:|:------:|
| 1.1 | Traduire le contenu hardcodé de la page d'accueil | `app/[locale]/page.tsx`, `messages/*.json` | Moyenne | ✅ |
| 1.2 | Traduire le contenu hardcodé de la page blog listing | `app/[locale]/blog/page.tsx`, `messages/*.json` | Faible | ✅ |
| 1.3 | Traduire le header (liens navigation) | `components/layout/Header.tsx`, `messages/*.json` | Faible | ✅ |
| 1.4 | Ajouter `hreflang` + `canonical` sur les pages articles | `app/[locale]/blog/[slug]/page.tsx` | Faible | ✅ |
| 1.5 | Ajouter `en` dans les alternates du layout | `app/[locale]/layout.tsx` | Faible | ✅ |
| 1.6 | Migrer les `<img>` vers `<Image>` de Next.js | `blog/[slug]/page.tsx`, `blog/page.tsx`, `page.tsx` | Moyenne | ✅ |
| 1.7 | Ajouter `generateStaticParams` + `revalidate` | `app/[locale]/blog/[slug]/page.tsx` | Faible | ✅ |
| 1.8 | Enrichir le JSON-LD BlogPosting | `app/[locale]/blog/[slug]/page.tsx` | Faible | ✅ |

### Phase 2 : Engagement & Maillage (Semaine 3-4)

| # | Tâche | Fichier(s) à créer/modifier | Complexité | Statut |
|---|-------|-----------------------------|:----------:|:------:|
| 2.1 | Breadcrumbs visuels + Schema.org | `components/blog/Breadcrumbs.tsx`, `blog/[slug]/page.tsx` | Moyenne | ✅ |
| 2.2 | Section "articles similaires" | `components/blog/RelatedArticles.tsx`, `actions/blog.ts` | Moyenne | ✅ |
| 2.3 | Table des matières automatique | `components/blog/TableOfContents.tsx`, `lib/blog/utils.ts` | Élevée | ✅ |
| 2.4 | Pages catégories | `blog/category/[slug]/page.tsx`, `actions/blog.ts` | Moyenne | ✅ |
| 2.5 | Temps de lecture estimé | `blog/[slug]/page.tsx` | Faible | ✅ |
| 2.6 | Boutons de partage social | `components/blog/ShareButtons.tsx` | Faible | ✅ |

### Phase 3 : Analytics & Monétisation (Semaine 5-6)

| # | Tâche | Fichier(s) à modifier | Complexité | Statut |
|---|-------|-----------------------|:----------:|:------:|
| 3.1 | Intégrer Google Analytics 4 | `app/[locale]/layout.tsx`, `next.config.ts` (CSP) | Moyenne | ✅ |
| 3.2 | Configurer Google Search Console | Vérification DNS + soumettre sitemap | Faible | ✅ |
| 3.3 | Intégrer Google AdSense | `layout.tsx`, `blog/[slug]/page.tsx`, CSP | Haute | ✅ |
| 3.4 | Formulaire newsletter + table Supabase | Nouveau composant + `app/actions/newsletter.ts` | Moyenne | ✅ |
| 3.5 | Préparer des emplacements pour liens d'affiliation | Template dans le prompt AI ou composant dédié | Faible | ✅ |

### Phase 4 : Scale & Croissance (Semaine 7+)

| # | Tâche | Fichier(s) à modifier | Complexité | Statut |
|---|-------|-----------------------|:----------:|:------:|
| 4.1 | Rendre le générateur IA multilingue | `app/api/ai-writer/route.ts` | Moyenne | ✅ |
| 4.2 | Générer des images OG dynamiques | Nouveau fichier `app/[locale]/blog/[slug]/opengraph-image.tsx` | Moyenne | ✅ |
| 4.3 | Créer un RSS Feed | `app/feed.xml/route.ts` | Faible | ✅ |
| 4.4 | Mettre à jour `llms.txt` et `manifest.json` | `public/llms.txt`, `public/manifest.json` | Faible | ✅ |
| 4.5 | Stratégie de contenu : articles piliers (2000+ mots) | Prompt AI + planification éditoriale | Moyenne | ⬜ |
| 4.6 | Liens internes automatiques entre articles | Composant ou logique dans le rendering markdown | Haute | ⬜ |

---

## 6. Scores actuels vs cibles

| Critère | Score Actuel | Score Cible (après Phase 4) |
|---------|:-----------:|:--------------------------:|
| **SEO Technique** (sitemap, robots, meta, hreflang, canonical) | 5/10 | 9/10 |
| **Contenu multilingue** (traductions, i18n réel) | 2/10 | 8/10 |
| **Performance** (Core Web Vitals, next/image, SSG) | 4/10 | 9/10 |
| **Structured Data** (JSON-LD, breadcrumbs, rich snippets) | 4/10 | 9/10 |
| **Maillage interne** (articles liés, catégories, ToC) | 1/10 | 8/10 |
| **Monétisation** (AdSense, affiliation, newsletter) | 0/10 | 7/10 |
| **Engagement utilisateur** (temps de session, taux de rebond) | 2/10 | 7/10 |

---

## 7. Suivi de progression

### Métriques à suivre (après intégration GA4 + Search Console)

| Métrique | Outil | Objectif à 3 mois | Objectif à 6 mois |
|----------|-------|:------------------:|:------------------:|
| Pages indexées | Search Console | 50+ | 150+ |
| Impressions/jour | Search Console | 500 | 2000 |
| Clics/jour | Search Console | 50 | 300 |
| Visiteurs uniques/mois | GA4 | 1 500 | 10 000 |
| Durée moy. de session | GA4 | > 2 min | > 3 min |
| Taux de rebond | GA4 | < 65% | < 50% |
| Revenus AdSense/mois | AdSense | $10 | $50-100 |
| Abonnés newsletter | Supabase | 100 | 500 |

### Check-list pré-lancement monétisation
- [ ] Au moins 20 articles publiés de qualité (2000+ mots)
- [ ] Google Search Console vérifié et sitemap soumis
- [ ] GA4 installé et fonctionnel
- [ ] Core Web Vitals tous en "vert" (Good)
- [ ] Candidature AdSense soumise et approuvée
- [ ] Au moins 2 articles par semaine publiés régulièrement

---

> **Note** : Ce document est un plan vivant. Cocher les cases au fur et à mesure de l'avancement et mettre à jour les scores après chaque phase.
