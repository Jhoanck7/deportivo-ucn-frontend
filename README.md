# DeportivoUCN Frontend

Web application for the DeportivoUCN management system, built with Angular and containerized with Docker.

## Technologies

- Angular 20
- TypeScript
- Docker / Docker Compose
- Nginx (production)

## Architecture

The project follows the **Feature-based Architecture** recommended by Angular. Each feature of the application lives in its own isolated folder and does not depend on other features.

```
src/app/
 ├── core/        → global, single-instance services and utilities
 ├── shared/      → reusable components and models across features
 └── features/    → each module of the application
```

| Folder | Responsibility |
|---|---|
| **core/** | Guards, interceptors, global services (auth, current user) |
| **shared/** | Generic components (spinner, modal), pipes, TypeScript interfaces |
| **features/** | Each functional module: auth, members, activities, dashboard |

Each feature is self-contained:

```
features/members/
 ├── components/
 │    ├── member-list/
 │    └── member-form/
 ├── services/
 │    └── members.service.ts    → calls the backend API
 ├── models/
 │    └── member.model.ts       → Member interface
 └── members.routes.ts          → feature routes
```

## Project Structure

```
deportivo-ucn-frontend/
 ├── src/
 │    ├── app/
 │    │    ├── core/
 │    │    │    ├── guards/
 │    │    │    ├── interceptors/
 │    │    │    └── services/
 │    │    ├── shared/
 │    │    │    ├── components/
 │    │    │    ├── pipes/
 │    │    │    └── models/
 │    │    └── features/
 │    │         ├── auth/
 │    │         ├── dashboard/
 │    │         └── ...
 │    └── environments/
 ├── Dockerfile
 ├── docker-compose.yml
 ├── docker-compose.override.yml
 └── nginx.conf
```

## Requirements

- Docker
- Docker Compose

No need to install Node.js or Angular CLI on your machine.

## Running the project

### Development (hot reload)

```bash
docker compose up
```

The app reloads automatically when code changes are detected. Available at:

```
http://localhost:4200
```

### Production

```bash
docker compose -f docker-compose.yml up --build
```

Available at:

```
http://localhost:80
```

## Useful Commands

```bash
# See running containers
docker compose ps

# Stream logs
docker compose logs -f