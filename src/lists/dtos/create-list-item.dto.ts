import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { ListItem } from '../entities/list-item.entity';

@InputType()
export class CreateListItemInput extends PickType(ListItem, ['title']) {
  @Field((type) => Int)
  listId: number;
}

@ObjectType()
export class CreateListItemOutput extends CoreOutput {
  @Field((type) => ListItem, { nullable: true })
  listItem?: ListItem;
}
