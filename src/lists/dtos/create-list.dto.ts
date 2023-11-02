import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { List } from '../entities/list.entity';

@InputType()
export class CreateListInput extends PickType(List, [
  'is_favorite',
  'title',
  'description',
]) {
  @Field((type) => Int, { nullable: true })
  categoryId?: number;
}

@ObjectType()
export class CreateListOutput extends CoreOutput {
  @Field((type) => List, { nullable: true })
  list?: List;
}
