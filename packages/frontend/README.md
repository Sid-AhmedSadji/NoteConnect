# 🌐 Frontend - NoteConnect (Web)

## 🔎 Présentation

Le frontend web de **NoteConnect** est développé avec **React + TypeScript + Vite** et utilise **ShadCN UI** pour les composants UI.
Il permet aux utilisateurs de gérer leurs notes et leurs liens vers des scans de manga via une interface moderne et réactive.

Le frontend intègre :

* **Hooks et Context** (`useAuth`, `useNotes`)
* **Axios centralisé** pour les appels API
* **React Query** pour le caching et la gestion des données
* **Tailwind CSS** pour le design

---

## 🏗️ Structure du projet

```
packages/frontend/
├── public/          # Assets statiques
├── src/             # Code source
│   ├── api/         # Wrapper Axios + endpoints
│   ├── app/         # Entrée de l’application
│   ├── components/  # Composants UI
│   ├── contexts/    # AuthContext, NotesContext
│   ├── libs/        # Axios instance, helpers
│   ├── models/      # Modèles importés depuis @noteconnect/models
│   ├── toast/       # Notifications
│   └── types/       # Types TypeScript
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🚀 Installation et exécution

### Prérequis

* Node.js >=16
* npm >=8

### Installation des dépendances

```sh
npm install
```

### Configuration

Créez un fichier `.env` à la racine du frontend pour configurer les variables d’environnement :

```sh
VITE_API_URL=YOUR_API_URL
VITE_PORT=PORT
VITE_ALLOWED_HOSTS=ALLOWED_HOST
```

### Scripts utiles

* Démarrer le serveur dev :

```sh
npm run dev
```

Accessible par défaut sur **[http://localhost:5173/](http://localhost:5173/)**

* Générer la build production :

```sh
npm run build
```

* Générer la build en mode dev :

```sh
npm run build:dev
```

* Prévisualiser la build :

```sh
npm run preview
```


---

## ⚙️ Hooks et Context principaux

### AuthContext (`useAuth`)

Gère : login, register, logout, mise à jour du profil, suppression du compte, vérification du mot de passe.

```ts
const { authState, login, logout } = useAuth();
```

### NotesContext (`useNotes`)

Gère : récupération, ajout, mise à jour, suppression des notes, filtrage, tri et recherche.

```ts
const { notes, addNote, deleteNote } = useNotes();
```

---