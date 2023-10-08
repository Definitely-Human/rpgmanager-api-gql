import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
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
        where: { id: getCategoryInput.id, user: { id: user.id } },
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
}
