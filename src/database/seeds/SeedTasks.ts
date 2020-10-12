import * as Knex from 'knex';
import { PersonModel } from '../models/person.model';
import { TaskPersonModel } from '../models/task-person.model';
import { TaskModel } from '../models/task.model';

/**
 * Create 100 million tasks for 10000 persons and assign each person 1000 tasks
 */
export async function seed(knex: Knex): Promise<any> {
  const numTasksPerBatch = 10000;
  const numTaskBatches = 10000;
  for (let i = 0; i < numTaskBatches; i++) {
    console.log(`Building Task Batch ${i}`);
    const batch = [];
    for (let j = 0; j < numTasksPerBatch; j++) {
      const t = {
        name: `Task ${i}.${j}`,
        content: `Task Content ${i}.${j}`
      }
      batch.push(t);
    }
    console.log(`Inserting Task Batch ${i}`);
    const d1 = Date.now();
    await TaskModel.query(knex).insert(batch);
    const d2 = Date.now();
    console.log(`Inserted Task Batch ${i} in ${d2-d1}ms`);
  }

  const numPersonsPerBatch = 10000;
  const numPersonBatches = 1;
  let batch = [];
  for (let i = 0; i < numPersonBatches; i++) {
    console.log(`Building Person Batch ${i}`);
    for (let j = 0; j < numPersonsPerBatch; j++) {
      const t = {
        first_name: `F ${i}.${j}`,
        last_name: `L ${i}.${j}`,
        birthday: '1970-01-01'
      }
      batch.push(t);
    }
    console.log(`Inserting Person Batch ${i}`);
    const d1 = Date.now();
    await PersonModel.query(knex).insert(batch);
    const d2 = Date.now();
    console.log(`Inserted Person Batch ${i} in ${d2-d1}ms`);
  }
  
  const numTasksPerPerson = 1000;
  for (let pId = 1; pId <= numPersonsPerBatch * numPersonBatches; pId++) {
    console.log(`Building Rel Batch ${pId}`);
    batch = [];
    const randomTasks = [];
    while (randomTasks.length < numTasksPerPerson) {
      const r = Math.floor(Math.random() * numTasksPerBatch * numTaskBatches) + 1;
      if (!randomTasks.includes(r)) {
        randomTasks.push(r);
      }
    }
    for (let tId of randomTasks) {
      const t = {
        person_id: pId,
        task_id: tId,
      }
      batch.push(t);
    }
    console.log(`Inserting Rel Batch ${pId}`);
    const d1 = Date.now();
    await TaskPersonModel.query(knex).insert(batch);
    const d2 = Date.now();
    console.log(`Inserted Rel Batch ${pId} in ${d2-d1}ms`);
  }
  
}