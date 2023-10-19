import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { ListItem } from './entities/list-item.entity';
import { List } from './entities/list.entity';
import { ListItemsResolver } from './list-items.resolver';
import { ListItemsService } from './list-items.service';
import { ListRepository } from './lists.repository';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

@Module({
  imports: [TypeOrmModule.forFeature([List, ListItem]), CategoriesModule],
  providers: [
    ListsService,
    ListsResolver,
    ListRepository,
    ListItemsResolver,
    ListItemsService,
  ],
})
export class ListsModule {}
