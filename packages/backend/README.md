# ⚙️ Backend - NoteConnect

## 🔎 Présentation

Le backend de **NoteConnect** est une API REST basée sur **Node.js** et **Express**, qui gère l’authentification, les sessions et la persistance des données via **MongoDB**.

Il utilise les **models** et **utils** partagés du monorepo et fournit des **réponses uniformisées** via `apiResponse`.

---

## 🏗️ Architecture du projet

```
packages/backend/
├── server.js
├── routes/
├── controllers/
├── middlewares/
├── config/
├── package.json
└── README.md
```

---

## 🧩 Réponses uniformisées (`apiResponse`)

Toutes les routes utilisent la fonction `apiResponse` pour un format cohérent :

* `status` : `"success"` ou `"error"`
* `message` : description lisible pour le frontend
* `data` : données renvoyées (optionnel)

### Exemple

```js
import {apiResponse} from '@noteconnect/utils';

export const getNotes = async (req, res) => {
  try {
    const client = await connectDB();
    apiResponse(res, 200, 'success', ' Connexion réussie ', notes);
  } catch (error) {
    apiResponse(res, 500, 'error', 'Erreur serveur');
  }
};
```

---

## 🚀 Installation et exécution

### Prérequis

* Node.js (>=16)
* npm (>=8)
* MongoDB (local ou cloud)

### Installation

```sh
npm install
```

### Lancer le serveur

```sh
npm run start
```

Par défaut : **[http://localhost:7000/](http://localhost:7000/)**

> Nodemon est utilisé pour recharger automatiquement le serveur lors des modifications.

---

## 🔐 Sécurité et middlewares

* **bcrypt** : hashage sécurisé des mots de passe
* **connect-mongo** : stockage des sessions utilisateur
* **cookie-parser**, **cors**, **helmet**, **express-session**

---
