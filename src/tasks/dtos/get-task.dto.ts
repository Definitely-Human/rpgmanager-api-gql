import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Task } from '../entities/task.entity';

@InputType()
export class GetTaskInput extends PickType(Task, ['id']) {}

@ObjectType()
export class GetTaskOutput extends CoreOutput {
  @Field((type) => Task, { nullable: true })
  task?: Task;
}
