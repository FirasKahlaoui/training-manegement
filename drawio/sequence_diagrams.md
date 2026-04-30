# TrainingMS Sequence Diagrams (Mermaid)

These diagrams describe the dynamic interactions between the actors, the React frontend, and the Spring Boot backend.

## 1. User Authentication (Login)
```mermaid
sequenceDiagram
    participant User
    participant React as React Interface
    participant Filter as SecurityFilterChain
    participant Auth as AuthController
    participant Serv as AuthService / JWTProvider
    participant DB as Database (MySQL)

    User->>React: Enters credentials & clicks "Login"
    React->>Filter: POST /api/auth/login
    Filter->>Auth: Pass request to controller
    Auth->>Serv: authenticate(login, password)
    Serv->>DB: findByLogin(login)
    DB-->>Serv: UserEntity (with hashed password)
    Note over Serv: Password matches (BCrypt check)
    Serv->>Serv: generateJWT(userDetails)
    Serv-->>Auth: AuthenticationResponse (Token)
    Auth-->>React: 200 OK + JWT Token
    React->>React: Save token to localStorage
    React-->>User: Redirect to Dashboard
```

## 2. Managing Formations (Creation Example)
```mermaid
sequenceDiagram
    participant Admin as Simple User / Admin
    participant React as React Interface
    participant Filter as JwtAuthenticationFilter
    participant Ctrl as FormationController
    participant Serv as FormationService
    participant DB as Database (MySQL)

    Admin->>React: Fills form & clicks "Save"
    React->>Filter: POST /api/formations (Bearer Token)
    Note over Filter: Validate JWT Signature
    Filter->>Ctrl: Handle request
    Ctrl->>Serv: save(formationDTO)
    Serv->>DB: INSERT INTO formation (...)
    DB-->>Serv: Success
    Serv-->>Ctrl: FormationEntity
    Ctrl-->>React: 201 Created
    React-->>Admin: Show Success Toast & Refresh List
```

## 3. Consulting Dashboard (Statistics)
```mermaid
sequenceDiagram
    participant Manager as Manager / Admin
    participant React as React Interface
    participant Ctrl as StatsController
    participant Serv as FormationService
    participant DB as Database (MySQL)

    Manager->>React: Clicks "Dashboard"
    React->>Ctrl: GET /api/stats/dashboard
    Ctrl->>Serv: getDashboardStatistics()
    Serv->>DB: SELECT COUNT(*), SUM(budget)...
    DB-->>Serv: Aggregate Result
    Serv-->>Ctrl: DashboardDTO
    Ctrl-->>React: 200 OK (JSON Data)
    React->>React: Render Charts (Recharts)
    React-->>Manager: Displays Interactive Dashboard
```

## 4. Registering a Participant
```mermaid
sequenceDiagram
    participant User as Simple User
    participant React as React Interface
    participant Ctrl as ParticipantController
    participant Serv as ParticipantService
    participant DB as Database (MySQL)

    User->>React: Adds new participant
    React->>Ctrl: POST /api/participants (Data)
    Ctrl->>Serv: create(participantDTO)
    Serv->>DB: save(participant)
    DB-->>Serv: Success
    Serv-->>Ctrl: Response
    Ctrl-->>React: 201 Created
    React-->>User: Refresh Table View
```

## 5. User Management (Admin Only)
```mermaid
sequenceDiagram
    participant Admin
    participant React as React Interface
    participant Filter as SecurityFilterChain
    participant Ctrl as UtilisateurController
    participant DB as Database (MySQL)

    Admin->>React: Navigates to "Utilisateurs"
    React->>Filter: GET /api/utilisateurs
    Note over Filter: Check ROLE_ADMIN authority
    Filter->>Ctrl: Authorized Access
    Ctrl->>DB: findAll()
    DB-->>Ctrl: List<Utilisateur>
    Ctrl-->>React: 200 OK
    React-->>Admin: Displays user accounts list
```
