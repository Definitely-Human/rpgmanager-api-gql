import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Task } from '../entities/task.entity';

@ObjectType()
export class GetTasksOutput extends CoreOutput {
  @Field((type) => [Task], { nullable: true })
  tasks?: Task[];
}
