import { Injectable } from '@nestjs/common';
import { QueryBuilder } from 'objection';
import { TaskModel } from '../database/models/task.model';

@Injectable()
export class TasksService {

  findAll(filter: Partial<TaskModel>) {
    const q = TaskModel.query().orderBy('id').limit(100);
    return this.buildTaskFilter(q, filter);
  }

  findOne(id: number) {
    return TaskModel.query().findById(id);
  }

  findAllWithPersons(filter: Partial<TaskModel>) {
    const q = TaskModel.query().withGraphFetched('persons')
      .withGraphFetched('persons', { maxBatchSize: 1, joinOperation: 'innerJoin' })
      .modifyGraph('persons', builder => {
        builder.limit(100);
      })
      .orderBy('id')
      .limit(100);
    return this.buildTaskFilter(q, filter);
  }

  findOneWithPersons(id: number) {
    return TaskModel.query()
      .findById(id)
      .withGraphFetched('persons', { maxBatchSize: 1, joinOperation: 'innerJoin' })
      .modifyGraph('persons', builder => {
        builder.limit(100);
      });
  }
  
  /**
   * This will oom at some #total
   */
  getTotal(total: number) {
    return TaskModel.query().orderBy('id').limit(total);
  }

  /**
   * This shouldn't oom
   */
  async getTotalStreamedCallback(total: number) {
    const stream = await TaskModel.query().orderBy('id').limit(total).stream((task) => {});
  }

  /**
   * Same as above but pipe through the result instead of calling a callback
   */
  getTotalStreamedThrough(total: number) {
    return TaskModel.query().orderBy('id').limit(total).streamThrough();
  }

  /**
   * sanity check, same as above using native knex but without object instantiation
   */
  getTotalStreamedKnex(total: number) {
    return TaskModel.query().orderBy('id').limit(total).toKnexQuery().stream();
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