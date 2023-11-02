import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { List } from '../entities/list.entity';

@InputType()
export class GetListInput {
  @Field((type) => Int)
  listId: number;
}

@ObjectType()
export class GetListOutput extends CoreOutput {
  @Field((type) => List, { nullable: true })
  list?: List;
}
