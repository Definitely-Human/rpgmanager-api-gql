import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { List } from '../entities/list.entity';

@ObjectType()
export class GetListsOutput extends CoreOutput {
  @Field((type) => [List], { nullable: true })
  lists?: List[];
}
