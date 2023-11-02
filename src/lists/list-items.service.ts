import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { ListsService } from './lists.service';

@Injectable()
export class ListItemsService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItems: Repository<ListItem>,
    private readonly listsService: ListsService,
  ) {}

  async createListItem(
    createListInput: CreateListItemInput,
    user: User,
  ): Promise<CreateListItemOutput> {
    try {
      if (user.character === null)
        return { ok: false, error: 'Character does not exist.' };

      const listOutput = await this.listsService.getList(
        { listId: createListInput.listId },
        user,
      );
      if (!listOutput.ok) {
        return {
          ok: false,
          error: listOutput.error,
        };
      }
      const listItem = await this.listItems.save(
        this.listItems.create({
          list: listOutput.list,
          ...createListInput,
        }),
      );
      return {
        ok: true,
        listItem,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when creating list item.',
      };
    }
  }

  async getListItemsByListId(listId: number, user: User): Promise<ListItem[]> {
    const listOutput = await this.listsService.getList(
      { listId: listId },
      user,
    );
    if (!listOutput.ok) {
      return null;
    }

    return this.listItems.find({ where: { list: { id: listId } } });
  }

  async editListItem(
    editListItemInput: EditListItemInput,
    user: User,
  ): Promise<EditListItemOutput> {
    try {
      let list = null;
      if (editListItemInput.listId) {
        const listOutput = await this.listsService.getList(
          { listId: editListItemInput.listId },
          user,
        );
        if (!listOutput.ok) {
          return {
            ok: false,
            error: listOutput.error,
          };
        }
        list = listOutput.list;
      }

      let listItem = await this.listItems.findOne({
        where: {
          id: editListItemInput.listItemId,
          list: { character: { id: user.character.id } },
        },
      });

      if (!listItem) {
        return {
          ok: false,
          error: 'List item not found.',
        };
      }

      listItem = {
        ...listItem,
        ...editListItemInput,
        ...(list && { list }),
      };

      listItem = await this.listItems.save(listItem);
      return {
        ok: true,
        listItem,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when editing list item.',
      };
    }
  }

  async deleteList(
    deleteListInput: DeleteListItemInput,
    user: User,
  ): Promise<DeleteListItemOutput> {
    try {
      const listItem = await this.listItems.findOne({
        where: {
          id: deleteListInput.listItemId,
        },
        relations: {
          list: true,
        },
      });

      if (!listItem || listItem.list.characterId != user.character.id) {
        return {
          ok: false,
          error: 'List item not found.',
        };
      }

      await this.listItems.delete(listItem.id);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when deleting list item.',
      };
    }
  }
}
