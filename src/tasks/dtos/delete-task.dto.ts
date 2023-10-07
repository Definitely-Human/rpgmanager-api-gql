import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Task } from '../entities/task.entity';

@InputType()
export class DeleteTaskInput extends PickType(Task, ['id']) {}

@ObjectType()
export class DeleteTaskOutput extends CoreOutput {}
