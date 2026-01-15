# 📌 NoteConnect

## 🔎 Présentation

**NoteConnect** est une application permettant aux utilisateurs de stocker et organiser des liens vers des scans de manga de manière efficace.
Conçu comme un **monorepo**, il regroupe plusieurs modules principaux : **backend**, **frontend web**, **frontend mobile (Expo)** et **proxy** (HTTPS), garantissant une architecture modulaire et évolutive.

---

## 🏗️ Architecture du projet

```
noteconnect/
├── packages/
│   ├── backend/        # API Node.js + Express + MongoDB
│   ├── frontend/       # Frontend web React + Vite + ShadCN UI
│   ├── expo_frontend/  # Application mobile Expo + React Native
│   └── proxy/          # Proxy HTTPS (remplacé par Nginx en prod)
├── models/             # Modèles partagés (User, Note)
├── utils/              # Utilitaires partagés (Logger, CustomError...)
├── scripts/            # Scripts utiles (ex: clean.js)
├── package.json        # Workspaces et scripts racine
└── README.md           # Documentation du monorepo
```

---

## 🔗 Accès rapide aux README des modules

* [Backend](./packages/backend/README.md)
* [Frontend web](./packages/frontend/README.md)
* [Frontend mobile (Expo)](./expo_frontend/README.md)
* [Proxy (HTTPS)](./packages/proxy/README.md)

---

## 🚀 Installation et Configuration

### ✅ Prérequis

* Node.js >=16
* npm >=8
* MongoDB pour le backend
* Certificats HTTPS si tu veux lancer le proxy

### 🛠️ Installation des dépendances

Depuis la racine du projet, installe tout le monorepo :

```sh
npm install
```

Pour installer uniquement un module spécifique :

```sh
npm run install:backend
npm run install:frontend
npm run install:expo_frontend
npm run install:proxy
```

### ⚙️ Configuration

Chaque module utilise ses propres fichiers `.env` pour gérer les variables d’environnement :

* **Backend** : MongoDB, session, ports, frontend autorisé…
* **Frontend web / Expo** : URL API, ports et options CORS si besoin
* **Proxy** : `PROXY_PORT`, backend cible, origines autorisées, certificats HTTPS

---

## ▶️ Scripts principaux

### Lancer uniquement un module

```sh
npm run start:backend      # API
npm run start:frontend     # Web
npm run start:proxy        # Proxy (HTTPS)
```

### Lancer tous les modules simultanément

```sh
npm run start
```

* Exécuté avec **concurrently**
* Les couleurs : `BACK` (bleu), `FRONT` (vert), `PROXY` (magenta)

### Nettoyage

```sh
npm run clean
```

* Supprime les fichiers temporaires générés par les modules

---

## 🛠️ Technologies utilisées

| Module        | Technologies                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------ |
| Backend       | Node.js, Express, MongoDB, bcrypt, connect-mongo, helmet, cookie-parser, express-session         |
| Frontend web  | React, TypeScript, Vite, ShadCN UI, Radix UI, Tailwind CSS, Axios, React Query, Recharts, Sonner |
| Expo frontend | React Native, Expo, TypeScript, Axios, React Query, Hooks `useAuth` / `useNotes`                 |
| Proxy         | Express, http-proxy-middleware, HTTPS, CORS, Logger, CustomError                                 |

---

## 💡 Notes importantes

* Le **proxy** HTTPS existe mais est remplacé par **Nginx** en production.
* Tous les modules utilisent des **modèles partagés** (`@noteconnect/models`) pour garantir la cohérence des données.
* Les appels API côté frontend passent toujours par **l’instance Axios centralisée** (`libs/axiosInstance`) pour la gestion des erreurs et des headers.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! 🚀

1. **Fork** le dépôt
2. Créez une **branche** (`feature/amélioration`)
3. **Committez** vos modifications
4. **Pushez** votre branche
5. Ouvrez une **Pull Request** ✅

---