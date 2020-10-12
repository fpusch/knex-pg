import { TaskModel } from './models/task.model';
import { PersonModel } from './models/person.model';
import { TaskPersonModel } from './models/task-person.model';
import * as Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';
import { Global, Module } from '@nestjs/common';

const models = [TaskModel, PersonModel, TaskPersonModel];

const modelProviders = models.map(model => {
  return {
    provide: model.name,
    useValue: model
  };
});

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const knex = Knex({
        client: 'pg',
        connection: {
          host: process.env.POSTGRES_HOST,
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
        },
        // debug: true,
        ...knexSnakeCaseMappers()
      });

      Model.knex(knex);
      return knex;
    }
  }
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers]
})
export class DatabaseModule {}