import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { RewardsService } from '../rewards/rewards.service';
import { User } from '../users/entities/user.entity';
import { CreateTaskInput, CreateTaskOutput } from './dtos/create-task.dto';
import { DeleteTaskInput, DeleteTaskOutput } from './dtos/delete-task.dto';
import { EditTaskInput, EditTaskOutput } from './dtos/edit-task.dto';
import { GetTaskInput, GetTaskOutput } from './dtos/get-task.dto';
import { GetTasksInput, GetTasksOutput } from './dtos/get-tasks.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasks: Repository<Task>,
    private readonly categoriesService: CategoriesService,
    private readonly rewardsService: RewardsService,
  ) {}

  async createTask(
    createTaskInput: CreateTaskInput,
    user: User,
  ): Promise<CreateTaskOutput> {
    try {
      if (user.character === null)
        return { ok: false, error: 'Character does not exist.' };

      let category = null;
      if (createTaskInput.categoryId) {
        const categoryOutput = await this.categoriesService.getCategory(
          {
            categoryId: createTaskInput.categoryId,
          },
          user,
        );
        if (!categoryOutput.ok)
          return {
            ok: false,
            error: 'Category not found.',
          };
        category = categoryOutput.category;
      }

      let reward = null;
      if (createTaskInput.rewardId) {
        const rewardOutput = await this.rewardsService.getReward(
          {
            rewardId: createTaskInput.rewardId,
          },
          user,
        );
        if (!rewardOutput.ok) {
          return {
            ok: false,
            error: 'Reward not found.',
          };
        }
        reward = rewardOutput.reward;
      }

      const task = await this.tasks.save(
        this.tasks.create({
          character: user.character,
          ...createTaskInput,
          ...(category && { category }),
          ...(reward && { reward }),
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
        where: {
          id: getTaskInput.taskId,
          character: { id: user.character.id },
        },
        loadRelationIds: { relations: ['character'] },
        relations: { category: true, reward: true },
      });
      if (!task) return { ok: false, error: 'Task not found.' };
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

  async getTasks(
    getTasksInput: GetTasksInput,
    user: User,
  ): Promise<GetTasksOutput> {
    try {
      const tasks = await this.tasks.find({
        where: {
          character: { id: user.character.id },
          ...(getTasksInput?.categoryId && {
            category: { id: getTasksInput?.categoryId },
          }), // If categoryId provided filter by category
        },
        relations: { category: true, reward: true },
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
        where: { id: editTaskInput.taskId },
      });
      if (!task || task.characterId !== user.character.id)
        return { ok: false, error: 'Task not found' };

      let category = null;
      if (editTaskInput.categoryId) {
        const categoryOutput = await this.categoriesService.getCategory(
          {
            categoryId: editTaskInput.categoryId,
          },
          user,
        );
        if (!categoryOutput.ok)
          return {
            ok: false,
            error: 'Category not found.',
          };
        category = categoryOutput.category;
      }

      let reward = null;
      if (editTaskInput.rewardId) {
        const rewardOutput = await this.rewardsService.getReward(
          {
            rewardId: editTaskInput.rewardId,
          },
          user,
        );
        if (!rewardOutput.ok) {
          return {
            ok: false,
            error: 'Reward not found.',
          };
        }
        reward = rewardOutput.reward;
      }

      if (editTaskInput.is_complete === true) task.completion_time = new Date();
      if (editTaskInput.is_complete === false) task.completion_time = null;

      task = {
        ...task,
        ...editTaskInput,
        // If category is found or category should be set to null, update category | reward
        ...((category || editTaskInput.categoryId === null) && { category }),
        ...((reward || editTaskInput.rewardId === null) && { reward }),
      };

      task = await this.tasks.save(task);

      if (editTaskInput.is_complete === true && task.rewardId != null) {
        await this.rewardsService.checkIfRewardShouldBeReceived(task.rewardId);
      }

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
        where: { id: deleteTaskInput.taskId },
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
