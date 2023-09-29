import { ObjectType, PickType, PartialType, InputType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class EditUserInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}

@ObjectType()
export class EditUserOutput extends CoreOutput {}
