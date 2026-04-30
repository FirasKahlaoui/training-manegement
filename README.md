# TrainingMS - Training Management System

**TrainingMS** is a modern and high-performance SaaS platform designed for the complete management of the training cycle within an organization. Developed with a robust architecture (Spring Boot & React), it offers granular access control and a premium user interface.

## Tech Stack

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Maven](https://img.shields.io/badge/Apache_Maven-C71A36?style=for-the-badge&logo=Apache%20Maven&logoColor=white)

### Backend
- **Framework**: Spring Boot 3.2.5 (JDK 21)
- **Security**: Spring Security (JWT Stateless Authentication)
- **Database**: MySQL 8.0
- **Persistence**: Spring Data JPA (Hibernate)
- **Tools**: Maven, Lombok

### Frontend
- **Framework**: React 19
- **Styling**: Vanilla CSS (Custom Design Tokens)
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Key Features

- **Operational Management**: Full CRUD for training sessions, participants, trainers, and organizational structures.
- **Analytical Dashboard**: Real-time visualization of statistics (budget, domain distribution, annual trends).
- **Access Control (RBAC)**: Strict security system based on three distinct roles (Admin, Manager, Simple User).
- **Premium Interface**: Modern design, "Plus Jakarta Sans" typography, and professional vector icons.

## Role-Based Access Control (RBAC)

1. **Administrator**: Full system access, management of users, roles, and reference data.
2. **Manager (Responsable)**: Read-only access to statistics and data for analytical decision-making.
3. **Simple User**: Operational role for managing business data (Sessions, Participants) without access to system configuration.

## Installation

### Prerequisites
- Java 21+
- Node.js & npm
- MySQL Server

### Backend Setup
1. Create a MySQL database named `training_ms`.
2. Configure database credentials in `src/main/resources/application.properties`.
3. Run the project: `mvn spring-boot:run`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the application: `npm start`.

---
© 2025/2026 - Higher Institute of Computer Science
