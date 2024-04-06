import {
  ObjectType,
  PickType,
  PartialType,
  InputType,
  Field,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class EditUserInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}

@ObjectType()
export class EditUserOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
