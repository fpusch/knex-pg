import { Model } from 'objection';

export class TaskPersonModel extends Model {
  static tableName = 'task_person_rel';

  taskId: number;
  personId: number;
}