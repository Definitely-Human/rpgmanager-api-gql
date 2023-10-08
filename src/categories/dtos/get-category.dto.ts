import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Category } from '../entities/category.entity';

@InputType()
export class GetCategoryInput extends PickType(Category, ['id']) {}

@ObjectType()
export class GetCategoryOutput extends CoreOutput {
  @Field((type) => Category, { nullable: true })
  category?: Category;
}
