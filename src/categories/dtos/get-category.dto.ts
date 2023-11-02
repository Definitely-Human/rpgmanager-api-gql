import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Category } from '../entities/category.entity';

@InputType()
export class GetCategoryInput {
  @Field((type) => Int)
  categoryId: number;
}

@ObjectType()
export class GetCategoryOutput extends CoreOutput {
  @Field((type) => Category, { nullable: true })
  category?: Category;
}
