import * as Knex from 'knex';

const tableName = '';

export async function up(knex: Knex) {
  return knex.schema.alterTable(tableName, t => {
    t.bigIncrements().alter();

  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}