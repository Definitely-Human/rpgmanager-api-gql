import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { List } from './entities/list.entity';
import { ListRepository } from './lists.repository';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

@Module({
  imports: [TypeOrmModule.forFeature([List]), CategoriesModule],
  providers: [ListsService, ListsResolver, ListRepository],
})
export class ListsModule {}
