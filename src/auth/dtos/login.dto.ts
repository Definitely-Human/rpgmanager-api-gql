import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../../users/entities/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['password']) {
  usernameOrEmail: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  token?: string;
}
