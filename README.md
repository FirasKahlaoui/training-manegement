# TrainingMS - Système de Gestion des Formations

**TrainingMS** est une plateforme SaaS moderne et performante conçue pour la gestion complète du cycle de formation au sein d'une organisation. Développée avec une architecture robuste (Spring Boot & React), elle offre un contrôle granulaire des accès et une interface utilisateur premium.

## 🚀 Fonctionnalités Principales

- **Gestion Opérationnelle** : CRUD complet des formations, participants, formateurs et structures.
- **Tableau de Bord Analytique** : Visualisation en temps réel des statistiques (budget, distribution par domaine, tendances annuelles).
- **Contrôle d'Accès (RBAC)** : Système de sécurité strict basé sur trois rôles distincts (Admin, Manager, Utilisateur Simple).
- **Interface Premium** : Design moderne, typographie "Plus Jakarta Sans", et icônes vectorielles professionnelles.

## 🛠️ Stack Technique

### Backend
- **Framework** : Spring Boot 3.2.5
- **Sécurité** : Spring Security (JWT / Statefull Auth)
- **Base de données** : MySQL
- **Persistence** : Spring Data JPA (Hibernate)
- **Outils** : Maven, Lombok

### Frontend
- **Framework** : React 19
- **Style** : Vanilla CSS (Custom Design Tokens)
- **Visualisation** : Recharts
- **Icônes** : Lucide React
- **Notifications** : React Hot Toast

## 🔐 Système de Rôles (RBAC)

1. **Administrateur** : Accès total au système, gestion des utilisateurs, rôles et référentiels.
2. **Manager (Responsable)** : Accès en lecture seule aux statistiques et aux données pour analyse décisionnelle.
3. **Utilisateur Simple** : Rôle opérationnel permettant la gestion des données métier (Formations, Participants) sans accès à la configuration système.

## 📦 Installation

### Prérequis
- Java 17+
- Node.js 18+
- MySQL Server

### Backend
1. Naviguer dans le dossier `backend`.
2. Configurer la base de données dans `src/main/resources/application.properties`.
3. Lancer l'application :
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend
1. Naviguer dans le dossier `frontend`.
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur de développement :
   ```bash
   npm start
   ```

## 📄 Documentation
Un rapport détaillé du projet est disponible dans le dossier `/latex`. Il contient l'analyse des besoins, la conception (MCD/MLD) et les diagrammes de cas d'utilisation.

---
© 2026 Green Building Training Center. Tous droits réservés.
