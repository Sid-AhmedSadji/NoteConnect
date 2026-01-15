# 🛡️ Proxy - NoteConnect

## 🔎 Présentation

Le proxy de **NoteConnect** est un serveur **HTTPS** développé avec **Express** et **http-proxy-middleware**.
Il était conçu pour rediriger les requêtes vers le backend, gérer le CORS et sécuriser les communications, mais il est actuellement remplacé par **Nginx**.

Le proxy inclut :

* Gestion des **origines autorisées (CORS)**
* Redirection des requêtes vers le backend (`/proxy/*`)
* Réécriture des chemins et en-têtes (`x-forwarded-proto`)
* Gestion des erreurs et des réponses uniformisées

---

## 🏗️ Structure du projet

```
packages/proxy/
├── config/         # Configuration du proxy (ports, certificats, origines)
├── server.js       # Serveur principal du proxy
├── package.json    # Dépendances et scripts
└── README.md
```

---

## 🚀 Installation et exécution

### Prérequis

* Node.js >=16
* npm >=8
* Certificats HTTPS valides

### Installation

```sh
npm install
```

### Lancer le serveur proxy

```sh
npm run start
```

Le proxy écoute par défaut sur le port configuré dans `config.PROXY_PORT` et expose un endpoint de test :

```
GET /status  => 'Proxy is running'
```

---

## ⚙️ Fonctionnalités principales

* Redirection des requêtes `/proxy/*` vers le backend
* Gestion des CORS avec liste d’origines autorisées (`config.ALLOWED_ORIGINS`)
* Réécriture des chemins (`^/proxy` → ``)
* Sécurisation HTTPS via `key` et `cert`
* Gestion centralisée des erreurs via `errorHandler` et `CustomError`
* Ajout de l’en-tête `x-forwarded-proto: https` pour signaler le protocole

---

## 🛠️ Dépendances

* `express` : serveur HTTP
* `http-proxy-middleware` : redirection des requêtes
* `cors` : gestion des origines autorisées
* `https` / `fs` : serveur HTTPS
* `@noteconnect/utils` : Logger, CustomError, errorHandler

---

## 💡 Notes

* Actuellement remplacé par **Nginx** pour la production.
* Le proxy peut encore être utile pour des environnements de test ou si Nginx n’est pas disponible.

---