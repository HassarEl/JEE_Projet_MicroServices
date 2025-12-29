# JEE Projet Microservices

**JEE_Projet_MicroServices** est un projet d’architecture *microservices* conçu en Java/JEE.  
Il contient plusieurs services back-end, une interface frontale, ainsi qu’une configuration Docker pour faciliter le déploiement et l’orchestration des composants.

---

## 📌 Aperçu

Ce projet est une application distribuée composée de plusieurs microservices qui communiquent entre eux pour fournir une solution complète.  
La structure générale contient :

├── config-repo/ # Configuration centrale (ex : config server)
├── frontend/ticketing-frontend/ # Front-end de l’application
├── infrastructures/ # Infrastructures support (ex : discovery, gateway, messaging)
├── init-db/ # Scripts d’initialisation de base de données
├── microservices/ # Dossier des microservices Java
├── docker-compose.yml # Orchestration Docker
├── .vscode/ # Configs VSCode (non essentielles au build)
└── .idea/ # Configs IDE (non essentielles au build)

yaml
Copy code

---

## 🧱 Architecture

Chaque microservice est **indépendant et déployable séparément**.  
L’architecture suit les principes des microservices :

- Services découplés et spécialisés
- API REST pour la communication interne
- Configuration centralisée
- Orchestration via Docker Compose

---

## 🛠️ Technologies utilisées

Ce projet utilise notamment :

- 🧠 **Java / JEE / Jakarta EE**
- 📦 **Maven**
- 🐳 **Docker & Docker Compose**
- 🌐 **Front-end (ReactJs)**
- 🔌 **REST API**
- 🔐 Possibilité de configurer Eureka/Consul, API Gateway, etc.

---

## 🚀 Prérequis

Avant de commencer, assure-toi d’avoir installé :

- Java JDK **17+**
- Maven
- DB : Postgres
- Docker & Docker Compose
- IDE : IntelliJ, VSCode

---

## 💡 Installation et exécution

1. **Cloner le projet**

```
git clone https://github.com/HassarEl/JEE_Projet_MicroServices.git
cd JEE_Projet_MicroServices
Configurer les variables d’environnement

Crée un fichier .env si nécessaire, ou adapte les variables dans docker-compose.yml.

Initialiser les bases de données

Si des scripts sont fournis dans init-db/, lance…

bash
Copy code
# Exemple
docker-compose up init-db
Démarrer l’ensemble des services

bash
Copy code
docker-compose up --build
Accéder au front

Ouvre ton navigateur sur :

arduino
Copy code
http://localhost:8080
(selon la configuration du front).

🧩 Structure des microservices
Chaque service dans /microservices contient :

Son propre module ou répertoire

Un fichier pom.xml ou équivalent

Un contrôleur REST

Un modèle de données

Une configuration spécifique (ports, DB, etc.)