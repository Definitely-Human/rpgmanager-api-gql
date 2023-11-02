import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class DeleteListItemInput {
  @Field((type) => Int)
  listItemId: number;
}

@ObjectType()
export class DeleteListItemOutput extends CoreOutput {}
