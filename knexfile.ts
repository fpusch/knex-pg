import 'dotenv/config';
import * as Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';

module.exports = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    database: 'postgres'
  },
  migrations: {
    directory: './src/database/migrations',
    stub: './src/database/migration.stub',
  },
  pool: {
    min: 2,
    max: 10
  },
  seeds: {
    directory: './src/database/seeds',
    stub: './src/database/seed.stub',
  },
  ...knexSnakeCaseMappers()
} as Knex.Config;