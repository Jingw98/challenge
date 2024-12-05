# challenge
A RESTful API for managing tasks and schedules, built with NestJS, Prisma and Postgres.

## Prerequisites
- [Docker](https://www.docker.com/get-started) installed and running for DB.

## Getting Started

### 1. Install Dependencies
```bash
yarn
```

### 2. Start Database
Start the database container:

```bash
docker-compose up -d
```

### 3. Configure Database
Ensure your database is running and configured. Update the `.env` file with your database connection string. Check `.env.example` file for reference.

### 4. Apply Migrations

```bash
npx prisma migrate dev
```

### 5. Start Development Server

```bash
yarn start:dev
```

### 6. Run Tests
Run unit tests:

```bash
yarn test
```

Run E2E tests:

```bash
yarn test:e2e
```

## Project Structure

```
src/
├── prisma/
│   ├── migrations/     # Database migrations
│   └── schema.prisma   # Prisma schema definition
│
├── schedule/
│   ├── dto/           # Schedule Data Transfer Objects
│   ├── entities/      # Schedule entities
│   ├── schedule.controller.ts
│   ├── schedule.module.ts
│   ├── schedule.service.ts
│   └── schedule.service.spec.ts
│
├── task/
│   ├── dto/           # Task Data Transfer Objects
│   ├── entities/      # Task entities
│   ├── task.controller.ts
│   ├── task.module.ts
│   ├── task.service.ts
│   └── task.service.spec.ts
│
├── utils/             # Utility functions and helpers
│   ├── constants/
│   └── helpers/
│
├── app.module.ts      # Main application module
└── main.ts           # Application entry point
```

## API Endpoints

### Schedules
- GET /schedules - Get all schedules (with optional limit query parameter)
- GET /schedules/:id - Get a specific schedule
- POST /schedules - Create a new schedule
- PUT /schedules/:id - Update a schedule
- DELETE /schedules/:id - Delete a schedule

### Tasks
- GET /tasks - Get all tasks (with optional limit query parameter)
- GET /tasks/:id - Get a specific task
- POST /tasks - Create a new task
- PUT /tasks/:id - Update a task
- DELETE /tasks/:id - Delete a task





