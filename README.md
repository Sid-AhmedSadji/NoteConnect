# 📌 NoteConnect

## 🔎 Présentation
**NoteConnect** est une application permettant aux utilisateurs de stocker et organiser des liens vers des scans de manga de manière efficace. Conçu comme un **monorepo**, il regroupe trois modules principaux : **backend**, **frontend** et **models**, garantissant une architecture modulaire et évolutive.

---

## 🏗️ Architecture du projet
```
noteconnect/
├── backend/   # API et gestion des données
├── frontend/  # Interface utilisateur
├── models/    # Modèles et structures de données
```
- **Backend** : API Node.js gérant les données et la logique métier.
- **Frontend** : Interface utilisateur développée avec React/Vue.js.
- **Models** : Définition des structures de données et schémas.

🔗 **Accès rapide aux README des modules** :
- [Backend](backend/README.md)
- [Frontend](frontend/README.md)
- [Models](models/README.md)

---

## 🚀 Installation et Configuration

### ✅ Prérequis
Assurez-vous d’avoir installé :
- **Node.js** (>=16)
- **npm** (>=8)

### 🛠️ Installation des dépendances
Installez toutes les dépendances du projet avec :
```sh
npm install
```
Pour installer uniquement un module spécifique :
```sh
npm run install:backend
npm run install:frontend
```

### ⚙️ Configuration
Créez **un fichier** `.env` pour le frontend et **un fichier** `.env` pour le backend afin de configurer les variables d’environnement.

---

## ▶️ Utilisation

### 🔹 Démarrer uniquement le backend
```sh
npm run start:backend
```

### 🔹 Démarrer uniquement le frontend
```sh
npm run start:frontend
```

### 🔹 Lancer l’ensemble du projet simultanément
```sh
npm run start
```

---

## 🛠️ Technologies utilisées
NoteConnect repose sur une stack moderne :
- **Node.js** & **Express.js** pour le backend
- **React.js / Vue.js** pour le frontend
- **MongoDB** pour la base de données
- **dotenv** pour la gestion des configurations
- **concurrently** pour l'exécution parallèle des services

---

## 🤝 Contribution
Les contributions sont les bienvenues ! Pour améliorer le projet :
1. **Fork** le dépôt.
2. Créez une **branche** (`feature/amélioration`).
3. **Committez** vos modifications (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. **Pushez** votre branche (`git push origin feature/amélioration`).
5. Ouvrez une **Pull Request** 🚀.

---

## 📜 Licence
Ce projet est sous licence **ISC**.
