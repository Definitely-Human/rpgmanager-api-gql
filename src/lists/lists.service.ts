import { Injectable } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { User } from '../users/entities/user.entity';
import { CreateListInput, CreateListOutput } from './dtos/create-list.dto';
import { DeleteListInput, DeleteListOutput } from './dtos/delete-list.dto';
import { EditListInput, EditListOutput } from './dtos/edit-list.dto';
import { GetListInput, GetListOutput } from './dtos/get-list.dto';
import { GetListsOutput } from './dtos/get-lists.dto';
import { ListRepository } from './lists.repository';

@Injectable()
export class ListsService {
  constructor(
    private readonly lists: ListRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createList(
    createListInput: CreateListInput,
    user: User,
  ): Promise<CreateListOutput> {
    try {
      if (user.character === null)
        return { ok: false, error: 'Character does not exist.' };

      let category = null;
      if (createListInput.categoryId) {
        const categoryOutput = await this.categoriesService.getCategory(
          {
            categoryId: createListInput.categoryId,
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

      const list = await this.lists.save(
        this.lists.create({
          character: user.character,
          ...createListInput,
          ...(category && { category }),
        }),
      );
      return {
        ok: true,
        list,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when creating list.',
      };
    }
  }

  async getList(
    getListInput: GetListInput,
    user: User,
  ): Promise<GetListOutput> {
    try {
      const list = await this.lists.findOneWithCharacter(
        {
          where: { id: getListInput.listId },
        },
        user.character,
      );
      if (!list) return { ok: false, error: 'List not found' };
      return {
        ok: true,
        list,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when retrieving list.',
      };
    }
  }

  async getLists(user: User): Promise<GetListsOutput> {
    try {
      const lists = await this.lists.findWithCharacter({}, user.character);
      return {
        ok: true,
        lists,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when retrieving lists.',
      };
    }
  }

  async editList(
    editListInput: EditListInput,
    user: User,
  ): Promise<EditListOutput> {
    try {
      let list = await this.lists.findOneWithCharacter(
        {
          where: { id: editListInput.listId },
        },
        user.character,
      );
      if (!list) return { ok: false, error: 'List not found' };

      let category = null;
      if (editListInput.categoryId) {
        const categoryOutput = await this.categoriesService.getCategory(
          {
            categoryId: editListInput.categoryId,
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

      list = {
        ...list,
        ...editListInput,
        // If category is found or category should be set to null, update category
        ...((category || editListInput.categoryId === null) && { category }),
      };

      list = await this.lists.save(list);

      return {
        ok: true,
        list,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when editing list.',
      };
    }
  }

  async deleteList(
    deleteListInput: DeleteListInput,
    user: User,
  ): Promise<DeleteListOutput> {
    try {
      const list = await this.lists.findOneWithCharacter(
        {
          where: { id: deleteListInput.listId },
        },
        user.character,
      );
      if (!list) return { ok: false, error: 'List not found' };

      this.lists.delete(list.id);
      return { ok: true };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when deleting list.',
      };
    }
  }
}
