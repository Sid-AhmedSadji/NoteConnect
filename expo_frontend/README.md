# 📱 NoteConnect — Application Mobile (Expo)

## 🔎 Présentation

Ce dossier contient l’**application mobile NoteConnect**, développée avec **Expo**, **React Native**, et **TypeScript**.

Elle consomme la **même API backend** que le frontend web et partage des modèles et types via le monorepo.
L’état global est géré via **Context + Hooks**, notamment pour **l’authentification** et la **gestion des notes**.

---

## 🧱 Stack technique

* **Expo CLI ≥ 13.4.1**
* **React Native**
* **TypeScript**
* **Axios** (instance centralisée `libs/axiosInstance`)
* **Hooks & Context** (`AuthContext`, `NotesContext`)
* **EAS** (build & distribution)
* **Monorepo** avec partage de modèles et types (`models/`)

---

## 🗂️ Architecture du projet

```txt
expo_frontend/
├── api/                # Endpoints API (UserApi, NoteApi…)
├── app/                # Screens, navigation, logique UI
├── assets/             # Images, polices, ressources
├── components/         # Composants réutilisables
├── contexts/           # Contexts globaux (AuthContext, NotesContext)
├── libs/               # Helpers / wrappers (axiosInstance)
├── models/             # Modèles partagés (User, Note…)
├── toast/              # Notifications / toast messages
├── types/              # Types TypeScript (AuthState, FilterOption, SortOption…)
├── app.json            # Config Expo
├── eas.json            # Config EAS build
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Authentification

L’application utilise un **AuthContext** et le hook `useAuth` :

* **Etat global (`authState`)** : utilisateur connecté, chargement
* **Actions exposées** :

  * `login(username, password)`
  * `register(username, password)`
  * `logout()`
  * `updateProfile(data)`
  * `deleteProfile(_id)`
  * `verifyPassword(password)`

⚠️ Le hook doit être utilisé **à l’intérieur du `AuthProvider`**.

---

## 📝 Gestion des notes

Un **NotesContext** gère les notes et leur affichage :

* **Etat global**

  * `notes` : toutes les notes
  * `filteredNotes` : notes filtrées / triées
  * `sortOption`, `filterOption`, `searchQuery`
  * `isLoading`

* **Actions exposées**

  * `addNote(noteData)` : ajouter une note
  * `updateNote(note)` : mettre à jour une note
  * `deleteNote(id)` : supprimer une note
  * `recalculateNotes()` : recalculer toutes les notes

* **Filtrage & tri**

  * `filterOption` : all / liked / active / dead
  * `sortOption` : name / date / note
  * recherche par nom ou lien

* **Notifications**

  * Toutes les erreurs API sont capturées et affichées via le toast system (`toast/`)

---

## 🌐 Communication avec l’API

Toutes les requêtes passent par **`apiRequest`** dans `libs/axiosInstance` :

* centralisation des erreurs
* gestion des headers (auth, token)
* simplification des hooks et contextes

Exemples d’API :

* `UserApi` pour l’auth
* `NoteApi` pour les notes

---

## 🧩 Modèles partagés

Les modèles sont importés depuis le workspace `models` :

```ts
import User from '@models/User';
import Note from '@models/Note';
```

* Garantit cohérence backend / web / mobile
* Évite la duplication de code et des types

---

## ⚙️ Configuration

### Variables d’environnement

```env
EXPO_PUBLIC_API_URL=
```

* Accessible via `process.env.EXPO_PUBLIC_API_URL`
* Documenté dans le README backend

### EAS build

`eas.json` définit :

* **development** : client de dev
* **preview** : build interne
* **production** : build auto-incrémenté

---

## ▶️ Lancement en développement

Depuis `expo_frontend/` :

```sh
npm install
npx expo start
```

* Android / iOS / Web via Expo
* Live reload automatique

---

## 🔗 Dépendances avec le backend

* L’application mobile consomme l’API backend (`packages/backend`)
* Toute modification de l’API doit être reflétée dans :

  * `api/`
  * `contexts/` et hooks (`useAuth`, `useNotes`…)

---

## 📎 Liens utiles

* 🧠 Backend API : `packages/backend/README.md`
* 🌐 Frontend Web : `packages/frontend/README.md`
* 📦 Modèles partagés : `models/README.md`

---

## ✅ Statut

L’application mobile est **fonctionnelle**, connectée à l’API backend et prête pour **EAS build / production**.

---