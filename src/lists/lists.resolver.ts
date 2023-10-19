import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from '../auth/authUser.decorator';
import { User } from '../users/entities/user.entity';
import { CreateListInput, CreateListOutput } from './dtos/create-list.dto';
import { DeleteListInput, DeleteListOutput } from './dtos/delete-list.dto';
import { EditListInput, EditListOutput } from './dtos/edit-list.dto';
import { GetListInput, GetListOutput } from './dtos/get-list.dto';
import { GetListsOutput } from './dtos/get-lists.dto';
import { ListItem } from './entities/list-item.entity';
import { List } from './entities/list.entity';
import { ListItemsService } from './list-items.service';
import { ListsService } from './lists.service';

@Resolver((of) => List)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemsService,
  ) {}

  @Mutation((returns) => CreateListOutput)
  async createList(
    @Args('input') createListInput: CreateListInput,
    @AuthUser() authUser: User,
  ): Promise<CreateListOutput> {
    return this.listsService.createList(createListInput, authUser);
  }

  @Query((returns) => GetListOutput)
  async getList(
    @Args('input') getListInput: GetListInput,
    @AuthUser() authUser: User,
  ): Promise<GetListOutput> {
    return this.listsService.getList(getListInput, authUser);
  }

  @Query((returns) => GetListsOutput)
  async getLists(@AuthUser() authUser: User): Promise<GetListOutput> {
    return this.listsService.getLists(authUser);
  }

  @Mutation((returns) => EditListOutput)
  async editList(
    @Args('input') editCategoryInput: EditListInput,
    @AuthUser() authUser: User,
  ): Promise<EditListOutput> {
    return this.listsService.editList(editCategoryInput, authUser);
  }

  @Mutation((returns) => DeleteListOutput)
  async deleteList(
    @Args('input') deleteListInput: DeleteListInput,
    @AuthUser() authUser: User,
  ): Promise<DeleteListOutput> {
    return this.listsService.deleteList(deleteListInput, authUser);
  }

  @ResolveField((returns) => [ListItem])
  async listItems(@Parent() list: List, @AuthUser() authUser: User) {
    return this.listItemsService.getListItemsByListId(list.id, authUser);
  }
}
