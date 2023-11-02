import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class DeleteCategoryInput {
  @Field((type) => Int)
  categoryId: number;
}

@ObjectType()
export class DeleteCategoryOutput extends CoreOutput {}
