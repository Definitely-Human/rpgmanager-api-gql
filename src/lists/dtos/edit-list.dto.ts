import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { List } from '../entities/list.entity';

@InputType()
export class EditListInput extends PickType(PartialType(List), [
  'is_favorite',
  'title',
  'description',
]) {
  @Field((type) => Int)
  listId: number;
  @Field((type) => Int, { nullable: true })
  categoryId?: number;
}

@ObjectType()
export class EditListOutput extends CoreOutput {
  @Field((type) => List, { nullable: true })
  list?: List;
}
