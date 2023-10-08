import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateTaskInput, CreateTaskOutput } from './dtos/create-task.dto';
import { DeleteTaskInput, DeleteTaskOutput } from './dtos/delete-task.dto';
import { EditTaskInput, EditTaskOutput } from './dtos/edit-task.dto';
import { GetTaskInput, GetTaskOutput } from './dtos/get-task.dto';
import { GetTasksOutput } from './dtos/get-tasks.dto';
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

  async getTasks(user: User): Promise<GetTasksOutput> {
    try {
      const tasks = await this.tasks.find({
        where: { id: user.character.id },
        loadRelationIds: true,
      });
      return {
        ok: true,
        tasks,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when getting list tasks.',
      };
    }
  }

  async editTask(
    editTaskInput: EditTaskInput,
    user: User,
  ): Promise<EditTaskOutput> {
    try {
      let task = await this.tasks.findOne({
        where: { id: editTaskInput.id },
        loadRelationIds: true,
      });
      if (!task || task.character.id !== user.character.id)
        return { ok: false, error: 'Task not found' };

      if (editTaskInput.is_complete === true) task.completion_time = new Date();
      if (editTaskInput.is_complete === false) task.completion_time = null;

      task = {
        ...task,
        ...editTaskInput,
      };

      task = await this.tasks.save(task);
      return {
        ok: true,
        task,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when editing task.',
      };
    }
  }

  async deleteTask(
    deleteTaskInput: DeleteTaskInput,
    user: User,
  ): Promise<DeleteTaskOutput> {
    try {
      const task = await this.tasks.findOne({
        where: { id: deleteTaskInput.id },
        loadRelationIds: true,
      });
      if (!task || task.character.id !== user.character.id)
        return { ok: false, error: 'Task not found' };

      this.tasks.delete(task.id);
      return { ok: true };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when deleting task.',
      };
    }
  }
}
