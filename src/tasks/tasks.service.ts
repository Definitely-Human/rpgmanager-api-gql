import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateTaskInput, CreateTaskOutput } from './dtos/create-task.dto';
import { GetTaskInput, GetTaskOutput } from './dtos/get-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasks: Repository<Task>,
  ) {}

  async createTask(
    createTaskInput: CreateTaskInput,
    user: User,
  ): Promise<CreateTaskOutput> {
    try {
      if (user.character === undefined)
        return { ok: false, error: 'Character does not exist.' };
      console.log(
        '🚀 ~ file: tasks.service.ts:21 ~ TasksService ~ user.character:',
        user.character,
      );
      const task = await this.tasks.save(
        this.tasks.create({
          character: user.character,
          ...createTaskInput,
        }),
      );
      return {
        ok: true,
        task,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when creating task.',
      };
    }
  }

  async getTask(
    getTaskInput: GetTaskInput,
    user: User,
  ): Promise<GetTaskOutput> {
    try {
      const task = await this.tasks.findOne({
        where: { id: getTaskInput.id },
        loadRelationIds: true,
      });
      if (!task || task.character.id !== user.character.id)
        return { ok: false, error: 'Task not found' };
      return {
        ok: true,
        task,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when retrieving task.',
      };
    }
  }
}
