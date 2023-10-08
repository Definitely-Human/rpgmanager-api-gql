import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../auth/authUser.decorator';
import { User } from '../users/entities/user.entity';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import { GetCategoryInput, GetCategoryOutput } from './dtos/get-category.dto';
import { Category } from './entities/category.entity';

@Resolver((of) => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation((returns) => CreateCategoryOutput)
  async createCategory(
    @Args('input')
    createCategoryInput: CreateCategoryInput,
    @AuthUser()
    authUser: User,
  ): Promise<CreateCategoryOutput> {
    return this.categoriesService.createCategory(createCategoryInput, authUser);
  }

  @Query((returns) => GetCategoryOutput)
  async getCategory(
    @Args('input')
    getCategoryInput: GetCategoryInput,
    @AuthUser()
    authUser: User,
  ): Promise<GetCategoryOutput> {
    return this.categoriesService.getCategory(getCategoryInput, authUser);
  }
}
