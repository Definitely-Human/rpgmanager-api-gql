import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { ListItem } from '../entities/list-item.entity';

@InputType()
export class EditListItemInput extends PickType(PartialType(ListItem), [
  'title',
  'is_complete',
]) {
  @Field((type) => Int)
  listItemId: number;
  @Field((type) => Int, { nullable: true })
  listId?: number;
}

@ObjectType()
export class EditListItemOutput extends CoreOutput {
  @Field((type) => ListItem, { nullable: true })
  listItem?: ListItem;
}
