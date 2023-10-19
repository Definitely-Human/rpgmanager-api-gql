import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class DeleteTaskInput {
  @Field((type) => Int)
  taskId: number;
}

@ObjectType()
export class DeleteTaskOutput extends CoreOutput {}
