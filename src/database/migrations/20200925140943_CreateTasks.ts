import * as Knex from 'knex';

const tableName = 'task';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, t => {
    // this creates an "id" column that gets autoincremented
    t.increments();

    t.text('name');
    t.text('content');

  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}