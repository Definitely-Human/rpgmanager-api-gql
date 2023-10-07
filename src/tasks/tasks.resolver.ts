import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../auth/authUser.decorator';
import { User } from '../users/entities/user.entity';
import { CreateTaskInput, CreateTaskOutput } from './dtos/create-task.dto';
import { GetTaskInput, GetTaskOutput } from './dtos/get-task.dto';
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
}
