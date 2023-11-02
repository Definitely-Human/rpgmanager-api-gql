import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../auth/authUser.decorator';
import { User } from '../users/entities/user.entity';
import { CreateTaskInput, CreateTaskOutput } from './dtos/create-task.dto';
import { DeleteTaskInput, DeleteTaskOutput } from './dtos/delete-task.dto';
import { EditTaskInput, EditTaskOutput } from './dtos/edit-task.dto';
import { GetTaskInput, GetTaskOutput } from './dtos/get-task.dto';
import { GetTasksInput, GetTasksOutput } from './dtos/get-tasks.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Resolver((of) => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation((returns) => CreateTaskOutput)
  async createTask(
    @Args('input') createTaskInput: CreateTaskInput,
    @AuthUser() authUser: User,
  ): Promise<CreateTaskOutput> {
    return this.tasksService.createTask(createTaskInput, authUser);
  }

  @Query((returns) => GetTaskOutput)
  async getTask(
    @Args('input') getTaskInput: GetTaskInput,
    @AuthUser() authUser: User,
  ): Promise<GetTaskOutput> {
    return this.tasksService.getTask(getTaskInput, authUser);
  }

  @Query((returns) => GetTasksOutput)
  async getTasks(
    @Args('input', { nullable: true }) getTasksInput: GetTasksInput,
    @AuthUser() authUser: User,
  ): Promise<GetTasksOutput> {
    return this.tasksService.getTasks(getTasksInput, authUser);
  }

  @Mutation((returns) => EditTaskOutput)
  async editTask(
    @Args('input') editTaskInput: EditTaskInput,
    @AuthUser() authUser: User,
  ): Promise<EditTaskOutput> {
    return this.tasksService.editTask(editTaskInput, authUser);
  }

  @Mutation((returns) => DeleteTaskOutput)
  async deleteTask(
    @Args('input') deleteTaskInput: DeleteTaskInput,
    @AuthUser() authUser: User,
  ): Promise<DeleteTaskOutput> {
    return this.tasksService.deleteTask(deleteTaskInput, authUser);
  }
}
