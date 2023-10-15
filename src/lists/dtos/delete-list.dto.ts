import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class DeleteListInput {
  @Field((type) => Int)
  listId: number;
}

@ObjectType()
export class DeleteListOutput extends CoreOutput {}
