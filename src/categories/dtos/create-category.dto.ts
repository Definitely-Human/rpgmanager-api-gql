import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Category } from '../entities/category.entity';

@InputType()
export class CreateCategoryInput extends PickType(Category, ['name']) {
  @Field((type) => Int, { nullable: true })
  parentCategoryId: number;
}

@ObjectType()
export class CreateCategoryOutput extends CoreOutput {
  @Field((type) => Category, { nullable: true })
  category?: Category;
}
