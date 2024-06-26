import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Task } from '../entities/task.entity';

@InputType()
export class EditTaskInput extends PartialType(
  PickType(Task, [
    'content',
    'title',
    'is_complete',
    'is_deleted',
    'is_favorite',
    'due_to',
  ]),
) {
  @Field((type) => Int)
  taskId: number;
  @Field((type) => Int, { nullable: true })
  categoryId?: number;
  @Field((type) => Int, { nullable: true })
  rewardId?: number;
}

@ObjectType()
export class EditTaskOutput extends CoreOutput {
  @Field((type) => Task, { nullable: true })
  task?: Task;
}
