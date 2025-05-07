# 🌐 Frontend - NoteConnect

## 🔎 Présentation
Le frontend de **NoteConnect** est une application web développée avec **React**, **Vite**, **ShadCN UI** et **TypeScript**. Elle offre une interface moderne et réactive pour gérer les liens vers des scans de manga.

---

## 🏗️ Architecture du projet
```
frontend/
├── src/              # Code source de l'application
├── public/           # Fichiers statiques
├── package.json      # Gestion des dépendances
├── tsconfig.json     # Configuration TypeScript
├── vite.config.js    # Configuration Vite
├── README.md         # Documentation
```

---

## 🚀 Installation et Configuration

### ✅ Prérequis
Assurez-vous d’avoir installé :
- **Node.js** (>=16)
- **npm** (>=8)

### 🛠️ Installation des dépendances
Installez toutes les dépendances du projet :
```sh
npm install
```

### ⚙️ Configuration
Ajoutez un fichier `.env` à la racine du projet frontend pour gérer les variables d’environnement :
```sh
VITE_API_URL=YOUR_API_URL
VITE_PORT=PORT
VITE_ALLOWED_HOSTS=ALLOWED_HOST
```

---

## ▶️ Développement et Exécution

### 🔹 Démarrer le serveur de développement
```sh
npm run dev
```
Accessible à l’URL **http://localhost:3000/** (ou le port configuré).

### 🔹 Lancer un aperçu de la build
```sh
npm run preview
```

### 🔹 Vérifier et corriger le code
```sh
npm run lint
```

---

## 🏗️ Build et Déploiement

### 🔹 Générer une version optimisée pour la production
```sh
npm run build
```

### 🔹 Générer une version en mode développement
```sh
npm run build:dev
```

**Important** : Déployez la version `dist/` générée par Vite sur un serveur web ou une plateforme de hosting.

---

## 🛠️ Technologies utilisées
- **React** 18
- **Vite** pour le bundling et le serveur de développement
- **ShadCN UI** pour les composants UI
- **Tailwind CSS** pour le design
- **TypeScript** pour une meilleure maintenabilité du code
- **ESLint & Prettier** pour assurer la qualité du code
- **React Router** pour la navigation
- **TanStack React Query** pour la gestion des requêtes API
- **Axios** pour les appels HTTP

---

## 🤝 Contribution
Les contributions sont les bienvenues ! 🚀

1. **Fork** le dépôt.
2. Créez une **branche** (`feature/amélioration`).
3. **Committez** vos modifications (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. **Pushez** votre branche (`git push origin feature/amélioration`).
5. Ouvrez une **Pull Request** ✅.

---

## 📜 Licence
Ce projet est sous licence **ISC**.