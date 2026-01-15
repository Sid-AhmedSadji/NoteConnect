# 📦 NoteConnect — Models

## 🔎 Présentation

Le dossier `models/` contient les **modèles partagés** de l’application NoteConnect.

Ces modèles sont utilisés par :

* le **backend**
* le **frontend web**
* l’**application mobile (Expo)**

L’objectif est de **centraliser la définition des structures de données** et d’assurer :

* la cohérence entre les différents clients
* la validation des données
* un formatage standardisé des objets

---

## 🗂️ Structure des fichiers

```txt
models/
├── index.js        # Export central des modèles
├── User.js         # Modèle utilisateur
└── Note.js         # Modèle note
```

* **`index.js`** : exporte `User` et `Note` pour un import simple dans tous les packages.

```js
import User from './User.js';
import Note from './Note.js';
export { User, Note };
```

---

## 📝 Modèle `User`

Représente un utilisateur de l’application.

### Propriétés

| Propriété  | Type          | Description                                                 |
| ---------- | ------------- | ----------------------------------------------------------- |
| `_id`      | string | null | Identifiant unique (MongoDB ou généré)                      |
| `username` | string        | Nom d’utilisateur obligatoire                               |
| `password` | string | null | Mot de passe (facultatif, vérifié via `User.checkPassword`) |

### Méthodes

* **`static checkPassword(password)`**
  Vérifie qu’un mot de passe est valide :

  * ≥ 8 caractères
  * Contient un chiffre
  * Contient une majuscule
  * Contient un caractère spécial

* **`toJSON({ hidePassword = true })`**
  Retourne l’objet JSON de l’utilisateur.
  Par défaut, le mot de passe est masqué.

### Exemple d’utilisation

```js
import { User } from '@models';

const user = new User({ username: 'SidAhmed', password: 'P@ssw0rd!' });
console.log(user.toJSON()); // { _id: null, username: 'SidAhmed' }
```

---

## 📝 Modèle `Note`

Représente une note ou un lien enregistré par un utilisateur.

### Propriétés

| Propriété           | Type          | Description                               |
| ------------------- | ------------- | ----------------------------------------- |
| `_id`               | string | null | Identifiant unique                        |
| `link`              | string        | URL du scan / ressource                   |
| `name`              | string        | Nom formaté automatiquement               |
| `date`              | Date          | Date de création ou dernière modification |
| `isDead`            | boolean       | Marque la note comme inactive             |
| `modificationCount` | number        | Nombre de modifications                   |
| `note`              | number        | Score ou notation                         |
| `liked`             | boolean       | Indique si la note est aimée              |
| `owner`             | User          | Utilisateur propriétaire                  |

### Méthodes

* **`updateNote(updatedFields)`**
  Retourne une nouvelle instance de `Note` avec les champs mis à jour et `modificationCount` incrémenté.

* **`toJSON()`**
  Retourne l’objet JSON complet.

* **`static formatName(name)`**
  Nettoie et formate le nom d’une note :

  * supprime les caractères spéciaux
  * remplace les espaces par `_`
  * première lettre en majuscule

### Exemple d’utilisation

```js
import { Note } from '@models';

const note = new Note({
  link: 'https://scan.example.com/manga',
  name: 'One Piece Chapitre 1',
  owner: user,
});

const updated = note.updateNote({ liked: true });
console.log(updated.toJSON());
```

---