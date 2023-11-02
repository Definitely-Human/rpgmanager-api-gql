import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'username',
]) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
