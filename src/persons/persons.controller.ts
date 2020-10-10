import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { PersonModel } from 'src/database/models/person.model';

@Controller('persons')
export class PersonsController {
  
  constructor(private personsService: PersonsService) {}

  @Get()
  findAll(@Query() filter?: Partial<PersonModel>) {
    return this.personsService.findAll(filter);
  }

  @Get('tasks')
  findAllWithPersons(@Query() filter?: Partial<PersonModel>) {
    return this.personsService.findAllWithTasks(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const r = await this.personsService.findOne(id);
    if (!r) {
      throw new NotFoundException();
    }
    return r;
  }
  

  @Get(':id/tasks')
  async findOneWithPersons(@Param('id') id: number) {
    const r = await this.personsService.findOneWithTasks(id);
    if (!r) {
      throw new NotFoundException();
    }
    return r;
  }
}