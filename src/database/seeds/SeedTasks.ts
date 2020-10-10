import * as Knex from 'knex';
import { TaskModel } from '../models/task.model';

export async function seed(knex: Knex): Promise<any> {

  for (let i = 0; i < 10000; i++) {
    console.log(`Building Batch ${i}`);
    const batch = [];
    for (let j = 0; j < 10000; j++) {
      const t = {
        name: `Task ${i}.${j}`,
        content: 'Donkeys'
      }
      batch.push(t);
    }
    console.log(`Inserting Batch ${i}`);
    await TaskModel.query(knex).insert(batch);
  }
  
}