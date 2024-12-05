# challenge
A RESTful API for managing tasks and schedules, built with NestJS,Prisma and Postgres.

## Prerequisites
- [Docker](https://www.docker.com/get-started) installed and running for DB.

1. Install Dependencies
yarn

2. Run the following command to start the database container using 
docker-compose up -d

3. Set up database
Ensure your database is running and configured. Update the .env file with your database connection string. Please check .env.example file for reference.

4. Applies migrations
npx prisma migrate dev

5. Start server
yarn start:dev

6. Unit test
yarn test

7. E2E test
yarn test:e2e

