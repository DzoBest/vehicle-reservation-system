# Data Lab Parking - Gestion de Réservations de Véhicules

Bienvenue sur le projet **Data Lab Parking**, une application web moderne et sécurisée permettant aux employés de gérer la réservation des véhicules de service.

## Fonctionnalités Principales

- **Authentification Sécurisée** : Inscription et connexion avec validation stricte des données.
- **Tableau de Bord Intuitif** : Vue d'ensemble des véhicules disponibles et des réservations de l'utilisateur.
- **Gestion des Réservations** : Créer, modifier et annuler des réservations simplement.
- **Système Anti-Conflit** : Vérification intelligente des disponibilités pour empêcher les doubles réservations. En cas de conflit, une modale affiche toutes les dates indisponibles.
- **Interface Moderne** : UI/UX soignée avec React et TailwindCSS (Modales, Animations, Responsive).

---

## Sécurité (Points Forts)

La sécurité a été placée au cœur du développement de cette application :

1.  **Validation des Données (VineJS)** :
    *   Toutes les entrées utilisateur (inscription, connexion, réservation) sont strictement validées côté serveur.
    *   **Mots de passe** : Une politique forte est imposée (Minuscule, Majuscule, Chiffre, Caractère spécial, Min 6 caractères). Des messages d'erreur précis guident l'utilisateur.
    *   **Exclusion automatique** : Les champs non autorisés sont ignorés pour éviter l'injection de données ou l'assignation de masse.

2.  **Authentification & Sessions** :
    *   Utilisation de **Tokens d'accès sécurisés** (AdonisJS Auth) pour l'API.
    *   Les mots de passe sont hashés de manière irréversible (Argon2/Bcrypt) avant stockage.
    *   Gestion automatique de l'expiration de session (Logout automatique sur erreur 401).
    *   Protection contre le rafraîchissement de page intempestif sur la page de login pour garantir la lisibilité des erreurs ("Force Brute" mitigation UX).

3.  **Protection des Routes** :
    *   Les routes sensibles de l'API sont protégées par un middleware d'authentification (`auth:api`).
    *   Le frontend utilise des "Protected Routes" pour empêcher l'accès au tableau de bord sans connexion.

4.  **Gestion des Erreurs** :
    *   Le backend ne fuite pas de détails techniques sensibles (Stack Traces) en production, mais renvoie des messages d'erreur formatés et sécurisés.

---

## Stack Technique

*   **Backend** : AdonisJS (Node.js framework)
*   **Frontend** : React + TypeScript + Vignette
*   **Styling** : TailwindCSS
*   **Base de Données** : PostgreSQL

---

## Reconstruction de la Base de Données

Une sauvegarde complète de la base de données a été générée et placée dans le dossier `database`. Voici comment la restaurer pour tester l'application avec les données de démo.

### Prérequis
*   Avoir **PostgreSQL** installé.
*   Avoir accès à la ligne de commande (Terminal ou PowerShell).

### Étapes de Restauration

1.  **Localiser le fichier** : Assurez-vous d'avoir le fichier `reservation_db.sql` dans le dossier `database` du projet.

2.  **Créer la base de données (si elle n'existe pas)** :
    ```bash
    createdb -U postgres vehicle_reservation_db
    ```
    *Ou via pgAdmin/SQL : `CREATE DATABASE vehicle_reservation_db;`*

3.  **Importer les données** :
    Exécutez la commande suivante depuis la racine du projet pour injecter la structure et les données :

    ```bash
    psql -U postgres -d vehicle_reservation_db < database/reservation_db.sql
    ```

    *Note : Si vous êtes sous Windows et que la commande `<` ne fonctionne pas en PowerShell, utilisez l'invite de commande classique (cmd.exe) ou la commande suivante :*
    ```powershell
    cmd /c "psql -U postgres -d vehicle_reservation_db < database/reservation_db.sql"
    ```

---

## Installation & Lancement

1.  **Backend** :
    ```bash
    cd backend
    npm install
    node ace migration:run # (Si vous n'utilisez pas le dump SQL ci-dessus)
    npm run dev
    ```

2.  **Frontend** :
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

L'application sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite).
