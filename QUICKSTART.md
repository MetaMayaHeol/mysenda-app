# 🚀 Guide de Démarrage Rapide - RutaLink

## Étape 1: Configuration Supabase (5 minutes)

### 1.1 Créer un compte Supabase
1. Va sur [supabase.com](https://supabase.com)
2. Clique sur "Start your project"
3. Connecte-toi avec GitHub ou email

### 1.2 Créer un nouveau projet
1. Clique sur "New Project"
2. Choisis un nom: `rutalink-dev`
3. Choisis un mot de passe fort
4. Choisis une région proche (ex: South America pour le Mexique)
5. Clique sur "Create new project" et attends que ce soit prêt.

### 1.3 Récupérer les clés API
1. Va dans **Settings** > **API**
2. Copie:
   - **Project URL**
   - **anon/public key**
3. ⚠️ **Important**: N'utilise JAMAIS la `service_role key` dans le code client (.env.local, fichiers JS, etc.). Elle donne accès total à la base de données.

### 1.4 Créer la base de données (Migrations)
1. Va dans **SQL Editor**
2. Crée une "New query" pour chaque fichier ci-dessous et exécute-les **dans l'ordre**:
   
   **Script 1: Sécurité RLS et Tables de base**
   - Ouvrir fichier: `supabase/migrations/20251208150000_secure_rls.sql`
   - Copier/Coller et cliquer sur "Run"

   **Script 2: Système de Réservation et Soft Delete**
   - Ouvrir fichier: `supabase/migrations/20251208151500_bookings_and_soft_delete.sql`
   - Copier/Coller et cliquer sur "Run"

## Étape 2: Configuration Locale (2 minutes)

### 2.1 Installer les dépendances
```bash
cd rutalink-app
npm install
```

### 2.2 Configurer les variables d'environnement
1. Copie le fichier d'exemple:
   ```bash
   cp .env.example .env.local
   ```

2. Ouvre `.env.local` et mets à jour:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ta_anon_key_ici
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Rate Limiting (Optionnel en dev, recommandé)
   # Créer une DB Redis sur upstash.com pour avoir ces valeurs
   # Si laissés vides, le rate limiting laissera passer les requêtes (fail-safe)
   KV_REST_API_URL=
   KV_REST_API_TOKEN=
   ```

## Étape 3: Lancer l'application (1 minute)

```bash
npm run dev
```

Visite [http://localhost:3000](http://localhost:3000)

## ✅ Vérification

Tu devrais voir:
1. ✅ La landing page
2. ✅ Pouvoir cliquer sur "Comenzar gratis" -> Page Login
3. ✅ Entrer ton email -> Recevoir Magic Link (vérifier logs console si pas de mail en local)
4. ✅ Dashboard (vide au début)
5. ✅ Créer un Service (Page `/dashboard/services/new`)
6. ✅ **Nouveau**: Sur la page publique du service, voir le formulaire de demande de réservation (Date/Heure/Nom/WhatsApp).

## 🐛 Problèmes Courants

### Erreur RLS / Permissions
- Vérifie que tu as bien exécuté le script `20251208150000_secure_rls.sql`.

### "Relation 'bookings' does not exist"
- Vérifie que tu as bien exécuté le script `20251208151500_bookings_and_soft_delete.sql`.

### Rate Limit Error (429)
- Si tu testes trop vite le login, tu seras bloqué 60 secondes. C'est normal, c'est la sécurité !

---

**Temps total estimé**: ~10-15 minutes ⏱️
Bon développement! 🚀
