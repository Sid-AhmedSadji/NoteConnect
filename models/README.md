# 📦 Models - NoteConnect

## 🔎 Présentation
Ce module contient les modèles de données utilisés dans **NoteConnect**, permettant de structurer les informations des utilisateurs et des notes. Il centralise la logique de validation et de transformation des données.

## 📁 Structure des fichiers
```
models/
├── index.js   # Export des modèles
├── User.js    # Modèle utilisateur
├── Note.js    # Modèle de notes
```

---

## 👤 User Model

### ⚙️ Structure de l'objet
```js
{
  _id: String,
  username: String,
  password: String
}
```

### 🔒 Validation du mot de passe
Un mot de passe valide doit respecter les critères suivants :
- **Minimum 8 caractères**
- **Contenir un chiffre**
- **Inclure un caractère spécial**
- **Avoir une majuscule**

### 🏗️ Méthodes principales
- `checkPassword(password: String)`: Vérifie si un mot de passe respecte les critères de sécurité.
- `toJSON(options: Object)`: Convertit l'objet utilisateur en JSON, avec possibilité de masquer le mot de passe.

### 🛠️ Exemple d'utilisation
```js
import User from './User';

const newUser = new User({ username: "MangaFan", password: "SecureP@ss123" });
console.log(newUser.toJSON({ hidePassword: false }));
```

---

## 📖 Note Model

### ⚙️ Structure de l'objet
```js
{
  _id: String,
  link: String,
  name: String,
  date: Date,
  isDead: Boolean,
  modificationCount: Number,
  note: Number,
  liked: Boolean,
  owner: String
}
```

### 🔍 Validation des données
- **`link`** : Lien obligatoire vers le scan.
- **`name`** : Nom formaté avec suppression des caractères spéciaux.
- **`date`** : Date de dernière modification (*valeur par défaut : Date actuelle*).
- **`isDead`** : Indique si la note est inactive (*booléen, par défaut : `false`*).
- **`modificationCount`** : Nombre de modifications (*entier, par défaut : `0`*).
- **`note`** : Note attribuée (*entier, par défaut : `0`*).
- **`liked`** : Indique si la note est appréciée (*booléen, par défaut : `false`*).
- **`owner`** : Identifiant de l'utilisateur propriétaire (*ObjectId référencant un **_id** de User*).

### 🏗️ Méthodes principales
- `formatName(name: String)`: Normalise le nom en retirant les caractères spéciaux.
- `updateNote(updatedFields: Object)`: Crée une nouvelle instance mise à jour de la note.
- `toJSON()`: Convertit l'objet note en JSON.

### 🛠️ Exemple d'utilisation
```js
import Note from './Note';

const newNote = new Note({
  link: "https://manga-scan.com/chapitre-1",
  name: "One Piece - Chapitre 1",
  owner: "user123"
});

console.log(newNote.toJSON());
```

---

## 🚀 Utilisation des modèles
Dans **index.js**, les modèles sont exportés pour être utilisés ailleurs :
```js
import User from './User';
import Note from './Note';

export { User, Note };
```

**Importation des modèles dans le projet :**
```js
import { User, Note } from './models';
```

---

## 📜 Licence
Ce module est sous licence **ISC**.

