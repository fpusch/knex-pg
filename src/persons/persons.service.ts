import { Injectable } from '@nestjs/common';
import { QueryBuilder } from 'objection';
import { PersonModel } from '../database/models/person.model';


@Injectable()
export class PersonsService {

  findAll(filter: Partial<PersonModel>) {
    const q  = PersonModel.query().orderBy('id').limit(100);
    return this.buildPersonFilter(q, filter);
  }

  findOne(id: number) {
    return PersonModel.query().findById(id);
  }

  findAllWithTasks(filter: Partial<PersonModel>) {
    const q = PersonModel.query()
      .withGraphFetched('tasks', { maxBatchSize: 1, joinOperation: 'innerJoin' })
      .modifyGraph('tasks', builder => {
        builder.limit(100);
      })
      .orderBy('id')
      .limit(100);
    return this.buildPersonFilter(q, filter);
  }

  findOneWithTasks(id: number) {
    const t = PersonModel.query()
      .findById(id)
      .withGraphFetched('tasks', { maxBatchSize: 1, joinOperation: 'innerJoin' })
      .modifyGraph('tasks', builder => {
        builder.limit(100);
      });
    return t;
  }

  private buildPersonFilter(query: QueryBuilder<PersonModel, PersonModel[]>, filter: Partial<PersonModel>) {
    if (filter?.firstName) {
      query.where('firstName', filter.firstName);
    }
    if (filter?.lastName) {
      query.where('lastName', filter.lastName);
    }
    return query;
  }

}