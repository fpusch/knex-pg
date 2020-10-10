import { Global, Module } from '@nestjs/common';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';

@Global()
@Module({
  controllers: [PersonsController],
  providers: [PersonsService,],
  exports: [PersonsService],
})
export class PersonsModule {
}