import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { PersonsModule } from './persons/persons.module';

@Module({
  imports: [TasksModule, PersonsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
