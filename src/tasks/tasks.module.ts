import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { Task } from './entities/task.entity';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), CategoriesModule],
  providers: [TasksService, TasksResolver],
})
export class TasksModule {}
