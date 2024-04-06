import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { RewardsModule } from '../rewards/rewards.module';
import { Task } from './entities/task.entity';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), CategoriesModule, RewardsModule],
  providers: [TasksService, TasksResolver],
})
export class TasksModule {}
