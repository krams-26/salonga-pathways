

## Séparation des rôles : Admin / Recruteur / Candidat

### Objectif
Séparer clairement l'expérience candidat (publique) de l'espace recruteur/admin (privé). Le tableau de bord ne doit plus apparaître dans la navbar publique.

---

### 1. Système de rôles (base de données)

Créer une table `user_roles` dédiée (jamais sur `profiles` — sécurité) avec un enum `app_role` :

- `admin` — gère les recruteurs et tout le contenu
- `recruiter` — voit le tableau de bord, gère les candidatures
- `candidate` — rôle par défaut à l'inscription

Ajouter une fonction `has_role(_user_id, _role)` en `SECURITY DEFINER` pour éviter la récursion RLS, et un helper `get_current_user_role()`.

RLS sur `user_roles` :
- Chaque utilisateur peut lire ses propres rôles
- Seul un `admin` peut INSERT / UPDATE / DELETE des rôles

Mise à jour des RLS sur `applications` et `application_documents` :
- Le candidat garde l'accès à ses propres candidatures
- Les `recruiter` et `admin` peuvent SELECT toutes les candidatures (et UPDATE le `status`)

Trigger : à la création d'un nouvel utilisateur, lui attribuer automatiquement le rôle `candidate`.

### 2. Création des comptes recruteurs

Les recruteurs ne s'inscrivent PAS librement. Deux options proposées :

- **Page Admin `/admin/users`** (visible uniquement par les `admin`) : formulaire pour saisir l'email d'un utilisateur existant et lui attribuer le rôle `recruiter` ou `admin`. La personne doit donc d'abord créer un compte normal via `/auth`, puis l'admin lui élève le rôle.
- Premier admin : créé manuellement via une migration SQL (vous me donnerez l'email après approbation).

### 3. Navigation — séparer public / privé

**Navbar publique (candidats / visiteurs)** — `Navbar.tsx` :
- Accueil, Opportunités, Le Parc
- Si non connecté : "Se connecter"
- Si connecté en tant que candidat : "Mes candidatures" + déconnexion
- **Retirer "Tableau de bord"** de la navbar publique

**Navbar recruteur** — affichée UNIQUEMENT si l'utilisateur a le rôle `recruiter` ou `admin` :
- Un bouton discret "Espace recruteur" apparaît dans la navbar quand le rôle est détecté
- Mène vers `/dashboard` (recruteur/admin) ou `/admin/users` (admin)

### 4. Routes protégées

Créer un composant `<ProtectedRoute requiredRole="recruiter">` qui :
- Redirige vers `/auth?redirect=/dashboard` si non connecté
- Affiche une page "Accès refusé" si connecté sans le bon rôle
- Affiche le contenu sinon

Application :
- `/dashboard` → protégé (`recruiter` ou `admin`)
- `/admin/users` → protégé (`admin` uniquement)
- `/my-applications` → protégé (utilisateur connecté, tous rôles)

### 5. Hook `useUserRole`

Hook React qui charge les rôles de l'utilisateur courant depuis `user_roles` et expose :
- `roles: app_role[]`
- `isAdmin`, `isRecruiter`, `isCandidate`
- `loading`

Utilisé par la navbar et les routes protégées.

### 6. Pages mises à jour

- `Dashboard.tsx` : requête réelle sur `applications` (toutes), avec possibilité de changer le `status` (submitted → reviewing → accepted/rejected). Données traduites FR/EN.
- Nouvelle page `Admin.tsx` (`/admin/users`) : liste des utilisateurs avec leurs rôles, formulaire d'attribution de rôle par email.
- `Auth.tsx` : après connexion, redirige vers `?redirect=...` s'il existe, sinon `/` pour les candidats et `/dashboard` pour les recruteurs/admins.

### 7. Traductions

Ajouter les clés FR/EN pour : "Espace recruteur", "Accès refusé", "Gestion des utilisateurs", statuts de candidature, etc.

---

### Détails techniques

- Enum SQL `app_role` : `('admin', 'recruiter', 'candidate')`
- Table `user_roles(id, user_id, role, created_at)` avec UNIQUE(user_id, role)
- Fonctions `has_role()` et `get_current_user_role()` en `SECURITY DEFINER` + `SET search_path = public`
- Le trigger `on_auth_user_created` est étendu pour aussi insérer le rôle `candidate` par défaut
- Politiques RLS de `applications` étendues avec `OR has_role(auth.uid(), 'recruiter') OR has_role(auth.uid(), 'admin')` pour SELECT/UPDATE
- La navbar utilise `useUserRole()` ; aucun rôle n'est jamais lu depuis le client storage

### Question à confirmer après approbation

Quel email doit recevoir le rôle `admin` initial (créé par migration) ?

