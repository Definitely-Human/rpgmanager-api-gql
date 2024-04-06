import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class GetUserInput {
  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class PublicUserOutput extends PickType(User, [
  'id',
  'username',
  'lastLoginDate',
  'createdAt',
]) {
  @Field((type) => Number)
  id: number;
  @Field((type) => String)
  username: string;
  @Field((type) => Date, { nullable: true })
  lastLoginDate?: Date;
  @Field((type) => Date)
  createdAt: Date;
}
/**
 * Return type for getUser resolver.
 */
@ObjectType()
export class GetUserOutput extends CoreOutput {
  @Field((type) => PublicUserOutput, { nullable: true })
  user?: PublicUserOutput;
}
