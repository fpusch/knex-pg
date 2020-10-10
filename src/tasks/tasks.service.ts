import { Injectable } from '@nestjs/common';
import { QueryBuilder } from 'objection';
import { TaskModel } from '../database/models/task.model';


@Injectable()
export class TasksService {
  constructor() {}

  findAll(filter: Partial<TaskModel>) {
    const q = TaskModel.query().orderBy('id').limit(100);
    return this.buildTaskFilter(q, filter);
  }

  findAllWithPersons(filter: Partial<TaskModel>) {
    const q = TaskModel.query().withGraphFetched('persons').orderBy('id').limit(100);
    return this.buildTaskFilter(q, filter);
  }

  findOneWithPersons(id: number) {
    return TaskModel.query().findById(id).withGraphFetched('persons');
  }

  findOne(id: number) {
    return TaskModel.query().findById(id);
  }

  private buildTaskFilter(query: QueryBuilder<TaskModel, TaskModel[]>, filter: Partial<TaskModel>) {
    if (filter?.name) {
      query.where('name', filter.name);
    }
    if (filter?.content) {
      query.where('content', filter.content);
    }
    return query;
  }
}