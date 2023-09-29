import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class GetUserInput {
  userId: number;
}

@ObjectType()
export class PublicUserOutput extends PickType(User, [
  'id',
  'username',
  'lastLoginDate',
  'createdAt',
]) {
  id: number;
  username: string;
  lastLoginDate?: Date;
  createdAt: Date;
}
/**
 * Return type for getUser resolver.
 */
@ObjectType()
export class GetUserOutput extends CoreOutput {
  user?: PublicUserOutput;
}
