import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { TaskModel } from 'src/database/models/task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(@Query() filter?: Partial<TaskModel>) {
    return this.tasksService.findAll(filter);
  }

  @Get('persons')
  findAllWithPersons(@Query() filter?: Partial<TaskModel>) {
    return this.tasksService.findAllWithPersons(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const r = await this.tasksService.findOne(id);
    if (!r) {
      throw new NotFoundException();
    }
    return r;
  }

  @Get(':id/persons')
  async findOneWithPersons(@Param('id') id: number) {
    const r =  await this.tasksService.findOneWithPersons(id);
    if (!r) {
      throw new NotFoundException();
    }
    return r;
  }
}