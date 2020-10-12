import { Controller, Get, NotFoundException, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { TaskModel } from '../database/models/task.model';
import { inspect } from 'util';
import { TasksService } from './tasks.service';
const JSONStream = require('JSONStream');

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

  @Get('/total')
  getTotal() {
    return this.tasksService.getTotal(10000000);
  }

  @Get('/total/callback')
  getTotalStreamedCallback() {
    return this.tasksService.getTotalStreamedCallback(10000000);
  }

  @Get('/total/through')
  getTotalStreamedThrough(@Res() res: Response) {
    const p = this.tasksService.getTotalStreamedThrough(10000000);
    p.pipe(JSONStream.stringify()).pipe(res);
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

  @Get('/total/bench')
  async getTotalBench(@Res() res: Response) {
    res.status(200).send('submitted');
    console.log('starting benchmark');
    const memoryResult = [];
    const knexResult = [];
    const callbackResult = [];
    const throughResult = [];
    const total = 100000;
    let start: number;
    let runs = 10;
    if (total > 100000) {
      runs = 1;
    }
    for (let i = 0; i < runs; i++) {
      start = Date.now();
      const t = await this.tasksService.getTotal(total);
      for (let task of t) {
        // no op
      }
      memoryResult.push({ time: (Date.now() - start), mem: this.currentMemoryUsage(false), memAfter: this.currentMemoryUsage(true)});
      
      start = Date.now();
      for await (let line of this.tasksService.getTotalStreamedKnex(total)) {
        // no op
      }
      knexResult.push({ time: (Date.now() - start), mem: this.currentMemoryUsage(false), memAfter: this.currentMemoryUsage(true)});
      
      start = Date.now();
      await this.tasksService.getTotalStreamedCallback(total);
      callbackResult.push({ time: (Date.now() - start), mem: this.currentMemoryUsage(false), memAfter: this.currentMemoryUsage(true)});

      start = Date.now();
      for await(let task of this.tasksService.getTotalStreamedThrough(total)) {
        // no op
      }
      throughResult.push({ time: (Date.now() - start), mem: this.currentMemoryUsage(false), memAfter: this.currentMemoryUsage(true)});
    }
      
    console.log(`Memory: ${inspect(memoryResult)}`);
    console.log(`Knex: ${inspect(knexResult)}`);
    console.log(`Callback: ${inspect(callbackResult)}`);
    console.log(`Through: ${inspect(throughResult)}`);
  }

  private currentMemoryUsage(runGarbageCollector: boolean) {
    if(runGarbageCollector) global.gc();
    return Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
  }
}