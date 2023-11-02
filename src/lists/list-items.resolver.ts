import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../auth/authUser.decorator';
import { User } from '../users/entities/user.entity';
import {
  CreateListItemInput,
  CreateListItemOutput,
} from './dtos/create-list-item.dto';
import {
  DeleteListItemInput,
  DeleteListItemOutput,
} from './dtos/delete-list-item.dto';
import {
  EditListItemInput,
  EditListItemOutput,
} from './dtos/edit-list-item.dto';
import { ListItem } from './entities/list-item.entity';
import { ListItemsService } from './list-items.service';

@Resolver((of) => ListItem)
export class ListItemsResolver {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Mutation((returns) => CreateListItemOutput)
  async createListItem(
    @Args('input') createListInput: CreateListItemInput,
    @AuthUser() authUser: User,
  ): Promise<CreateListItemOutput> {
    return this.listItemsService.createListItem(createListInput, authUser);
  }

  @Mutation((returns) => EditListItemOutput)
  async editListItem(
    @Args('input') editListItemInput: EditListItemInput,
    @AuthUser() authUser: User,
  ): Promise<EditListItemOutput> {
    return this.listItemsService.editListItem(editListItemInput, authUser);
  }

  @Mutation((returns) => DeleteListItemOutput)
  async deleteListItem(
    @Args('input') deleteListInput: DeleteListItemInput,
    @AuthUser() authUser: User,
  ): Promise<DeleteListItemOutput> {
    return this.listItemsService.deleteList(deleteListInput, authUser);
  }
}
