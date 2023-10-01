import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class LoginInput extends PickType(User, ['password']) {
  password: string;
  usernameOrEmail: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  token?: string;
}
