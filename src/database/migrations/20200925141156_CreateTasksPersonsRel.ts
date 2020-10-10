import * as Knex from 'knex';

const tableName = 'task_person_rel';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, t => {
    t.integer('task_id')
      .references('id')
      .inTable('task');
    t.integer('person_id')
      .references('id')
      .inTable('person');
    t.primary(['task_id', 'person_id']);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}