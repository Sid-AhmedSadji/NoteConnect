# ⚙️ Backend - NoteConnect

## 🔎 Présentation
Le backend de **NoteConnect** est une API REST basée sur **Node.js** et **Express**, qui gère l’authentification, les sessions et la persistance des données via **MongoDB**. Il garantit la sécurité et l’intégrité des informations grâce à plusieurs middlewares et une gestion efficace des requêtes.

---

## 🏗️ Architecture du projet
```
backend/
├── server.js        # Point d’entrée du serveur
├── routes/          # Définition des endpoints API
├── controllers/     # Gestion des requêtes et logique métier
├── models/          # Schémas de base de données MongoDB
├── middlewares/     # Sécurité et gestion des accès
├── config/          # Fichiers de configuration globale
├── package.json     # Dépendances et scripts du projet
├── README.md        # Documentation du backend
```

---

## 🚀 Installation et Configuration

### ✅ Prérequis
Assurez-vous d’avoir installé :
- **Node.js** (>=16)
- **npm** (>=8)
- **MongoDB** (base de données)

### 🛠️ Installation des dépendances
Installez toutes les dépendances du projet :
```sh
npm install
```

### ⚙️ Configuration
Ajoutez un fichier `.env` à la racine du backend pour gérer les variables d’environnement :
```sh
# Configuration des cookies
COOKIES_MAX_AGE=COOKIES_MAX_AGE_IN_MS

# Configuration du frontend
FRONTEND_IP=FRONTEND_IP

# Configuration MongoDB
MONGO_URI=MONGO_CONNECTION_STRING
MONGO_DB_NAME=DATABASE_NAME
MONGO_NOTE_COLLECTION_NAME=NOTE_COLLECTION
MONGO_USER_COLLECTION_NAME=USER_COLLECTION

# Configuration du serveur
NODE_ENV=NODE_ENV
PORT=PORT
SESSION_SECRET=YOUR_RANDOM_STRING
```

---

## ▶️ Développement et Exécution

### 🔹 Lancer le serveur
```sh
npm run start
```
Par défaut, le serveur tourne sur **http://localhost:7000/** (modifiable via `.env`).

### 🔹 Tester l’application
```sh
npm test
```
(Actuellement, aucun test défini. Ajouter des tests unitaires est recommandé.)

---

## 🔐 Sécurité et Middlewares
Le backend intègre plusieurs outils pour renforcer la sécurité :
- **bcrypt** : Hashage sécurisé des mots de passe.
- **connect-mongo** : Stockage sécurisé des sessions utilisateur.
- **cookie-parser** : Gestion des cookies pour la session.
- **cors** : Gestion des accès cross-origin pour le frontend.
- **helmet** : Protection contre les attaques courantes.
- **express-session** : Gestion des sessions utilisateur via MongoDB.

---

## 🛠️ Technologies utilisées
- **Node.js** & **Express.js** pour le serveur
- **MongoDB** pour la base de données
- **bcrypt** pour sécuriser les mots de passe
- **Helmet** pour améliorer la protection contre les vulnérabilités
- **Nodemon** pour un développement fluide et rapide

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
