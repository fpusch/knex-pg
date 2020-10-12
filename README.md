## Description

A playground of ideas related to `pg`, `knex`, `stream` and `nestjs`. Bootstrapped via the Nest.js CLI.

## To run

- Create containers `docker-compose up` 
  - pgAdmin at `127.0.0.1:5050`
  - psql at `127.0.0.1:5432`
  - Note: pgAdmin needs to connect to database via container-name `postgres_container`
- Install node modules `npm install`
- Migrate database `npm run migrate`
- Seed database `npm run seed`
- Start `npm run start:dev`
- to log SQL queries add `DEBUG=knex:query` to `.env`
