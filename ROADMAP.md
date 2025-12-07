# 🗺️ Roadmap Global RutaLink

Ce document décrit la trajectoire du projet, en priorisant la finalisation du MVP (Produit Minimum Viable) avant l'intégration des fonctionnalités avancées d'Intelligence Artificielle.

## 🏁 Phase 1 : Consolidation & Finalisation MVP (Court Terme 2-3 Semaines)
**Objectif :** Avoir une plateforme 100% fonctionnelle, traduite et optimisée pour l'acquisition d'utilisateurs.

### 1.1 Internationalization (i18n) & Contenu 🌍
- [x] **Pages Villes & Activités** : Finaliser la traduction dynamique des pages `/ciudad/[slug]` et `/actividad/[slug]`.
- [x] **Nettoyage Textes** : Extraire les derniers textes "en dur" vers les fichiers de messages (`messages/es.json`, etc.).
- [x] **Metadata SEO** : S'assurer que les titres/descriptions changent bien selon la langue choisie.

### 1.2 Expérience Utilisateur (UX/UI) 🎨
- [x] **Onboarding** : Vérifier que le flux "Nouveau Guide" est fluide (Inscription -> Profil -> Premier Service).
- [x] **Pages Publiques** : 
    - Vérifier l'affichage `/g/[slug]` (Profil Guide).
    - Vérifier l'affichage `/s/[id]` (Détail Service).
    - S'assurer que le bouton WhatsApp génère le bon message pré-rempli.
- [x] **Mobile** : Vérifier le responsive sur mobile (menu, cards, formulaires).

### 1.3 Fonctionnalités Core "En attente" ⚙️
- [x] **Analytics** : Finaliser le dashboard basique (Vues par jour, Clics WhatsApp).
- [x] **Modération** : Activer le système d'approbation des avis (Reviews).

---

## 🏗️ Phase 2 : Infrastructure "Agent Ready" (Moyen Terme 3-4 Semaines)
**Objectif :** Préparer le terrain (Backend/Data) pour que l'IA puisse se connecter sans casser l'existant.

### 2.1 Sécurité & API 🛡️
- [ ] **Endpoint Agent** : Créer une route API dédiée `/api/agent` sécurisée (Master Key).
- [ ] **Actions JSON** : Créer des endpoints "légers" (JSON only) pour que l'agent puisse chercher des tours sans charger le HTML.

### 2.2 Intelligence des Données (RAG) 🧠
- [ ] **Vecteurs (pgvector)** : Activer l'extension sur Supabase.
- [ ] **Indexation** : Créer un script pour convertir les descriptions des tours en vecteurs (Embeddings).
- [ ] **Pipeline de mise à jour** : S'assurer que lorsqu'un guide modifie son tour, l'index se met à jour.

---

## 🤖 Phase 3 : L'Agent "RutaBot" (Long Terme 1-2 Mois)
**Objectif :** Lancer l'assistant WhatsApp autonome.

### 3.1 Connexion WhatsApp 💬
- [ ] **Webhook** : Configurer le webhook Meta pour recevoir les messages.
- [ ] **Bot de base** : Réponse "Echo" ou "Bonjour" simple.

### 3.2 Cerveau de l'Agent 🤖
- [ ] **Compréhension (NLU)** : L'agent comprend "Je veux aller à Tulum demain".
- [ ] **Recherche (RAG)** : L'agent interroge la base vectorielle.
- [ ] **Réponse** : L'agent formule une réponse naturelle avec des liens vers les pages `/s/[id]`.

### 3.3 Qualification & Handover 🤝
- [ ] **Règles métier** : Si le client est prêt, l'agent passe la main au guide (Lien WhatsApp direct du guide).
- [ ] **Reporting** : Notifier le guide "RutaBot vous a trouvé un client !".

---

## 🚀 Phase 4 : Croissance & Monétisation
- [ ] **Dashboard ROI** : Montrer aux guides combien de leads l'IA a généré.
- [ ] **Abonnement Premium** : L'IA devient payante.
- [ ] **API Partenaires (B2B)** : Ouvrir l'inventaire via API standardisée (MCP).
