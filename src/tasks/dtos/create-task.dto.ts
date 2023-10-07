import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Task } from '../entities/task.entity';

@InputType()
export class CreateTaskInput extends PickType(Task, [
  'content',
  'title',
  'due_to',
  'is_favorite',
]) {}

@ObjectType()
export class CreateTaskOutput extends CoreOutput {
  @Field((type) => Task, { nullable: true })
  task?: Task;
}
