import * as Knex from 'knex';

const tableName = 'person';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, t => {
    // this creates an "id" column that gets autoincremented
    t.increments();

    t.text('first_name');
    t.text('last_name');
    t.date('birthday');

  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}