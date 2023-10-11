import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Category } from '../entities/category.entity';

@InputType()
export class EditCategoryInput extends PartialType(
  PickType(Category, ['name', 'parentCategoryId']),
) {
  @Field((type) => Int)
  categoryId: number;
}

@ObjectType()
export class EditCategoryOutput extends CoreOutput {
  @Field((type) => Category, { nullable: true })
  category?: Category;
}
