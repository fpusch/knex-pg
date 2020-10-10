import { BaseModel } from './base.model';
import { PersonModel } from './person.model';
import { Model } from 'objection';

export class TaskModel extends BaseModel {
  static tableName = 'task';

  name: string;
  content: string;

  persons: PersonModel[];

  constructor(name?: string, content?: string) {
    super();
    this.name = name;
    this.content = content;
  }

  static relationMappings = {
    persons: {
      modelClass: `${__dirname}/person.model`,
      relation: Model.ManyToManyRelation,
      join: {
        from: 'task.id',
        through: {
          from:  'task_person_rel.taskId',
          to: 'task_person_rel.personId'
        },
        to: 'person.id'
      }
    }
  }
}