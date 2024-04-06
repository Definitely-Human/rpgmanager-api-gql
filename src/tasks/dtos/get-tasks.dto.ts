import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Task } from '../entities/task.entity';

@InputType()
export class GetTasksInput {
  @Field((type) => Number, { nullable: true })
  categoryId?: number;
}

@ObjectType()
export class GetTasksOutput extends CoreOutput {
  @Field((type) => [Task], { nullable: true })
  tasks?: Task[];
}
