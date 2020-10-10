import { BaseModel } from './base.model';
import { TaskModel } from './task.model';
import { Model } from 'objection';

export class PersonModel extends BaseModel {
  static tableName = 'person';

  firstName: string;
  lastName: string;
  birthday: Date;

  tasks: TaskModel[];
  
  static relationMappings = {
    tasks: {
      modelClass: `${__dirname}/task.model`,
      relation: Model.ManyToManyRelation,
      join: {
        from: 'person.id',
        through: {
          from: 'task_person_rel.personId',
          to: 'task_person_rel.taskId'
        },
        to: 'task.id'
      }
    }
  }

}