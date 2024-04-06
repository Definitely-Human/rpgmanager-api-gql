import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import {
  DeleteCategoryInput,
  DeleteCategoryOutput,
} from './dtos/delete-category.dto';
import {
  EditCategoryInput,
  EditCategoryOutput,
} from './dtos/edit-categories.dto';
import { GetCategoriesOutput } from './dtos/get-categories.dto';
import { GetCategoryInput, GetCategoryOutput } from './dtos/get-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async createCategory(
    createCategoryInput: CreateCategoryInput,
    user: User,
  ): Promise<CreateCategoryOutput> {
    try {
      let parentCategory: Category = null;
      if (createCategoryInput.parentCategoryId)
        parentCategory = await this.categories.findOne({
          where: { id: createCategoryInput.parentCategoryId },
        });
      const category = await this.categories.save(
        this.categories.create({
          user,
          ...createCategoryInput,
          parentCategory,
        }),
      );
      return {
        ok: true,
        category,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when creating category.',
      };
    }
  }

  async getCategory(
    getCategoryInput: GetCategoryInput,
    user: User,
  ): Promise<GetCategoryOutput> {
    try {
      const category = await this.categories.findOne({
        where: { id: getCategoryInput.categoryId, user: { id: user.id } },
      });
      if (!category) return { ok: false, error: 'Category not found.' };
      return {
        ok: true,
        category,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when getting category.',
      };
    }
  }

  async getCategories(user: User): Promise<GetCategoriesOutput> {
    try {
      const categories = await this.categories.find({
        where: { user: { id: user.id } },
      });
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when getting list of categories.',
      };
    }
  }

  async editCategory(
    editCategoryInput: EditCategoryInput,
    user: User,
  ): Promise<EditCategoryOutput> {
    try {
      let category = await this.categories.findOne({
        where: { id: editCategoryInput.categoryId, user: { id: user.id } },
      });
      if (!category) return { ok: false, error: 'Category not found.' };

      if (editCategoryInput.parentCategoryId) {
        const parentCategory = await this.categories.findOne({
          where: {
            id: editCategoryInput.parentCategoryId,
            user: { id: user.id },
          },
        });
        if (!parentCategory)
          return { ok: false, error: 'Parent category not found.' };

        if (parentCategory.id === category.id)
          return {
            ok: false,
            error: 'Category cant be its own parent category.',
          };

        category.parentCategory = parentCategory;
      }

      category = {
        ...category,
        ...editCategoryInput,
      };

      category = await this.categories.save(category);
      return {
        ok: true,
        category,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when editing category.',
      };
    }
  }

  async deleteCategory(
    deleteCategoryInput: DeleteCategoryInput,
    user: User,
  ): Promise<DeleteCategoryOutput> {
    try {
      const category = await this.categories.findOne({
        where: { id: deleteCategoryInput.categoryId, user: { id: user.id } },
      });
      if (!category) return { ok: false, error: 'Category not found.' };

      this.categories.delete(deleteCategoryInput.categoryId);

      return { ok: true };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when deleting category.',
      };
    }
  }
}
