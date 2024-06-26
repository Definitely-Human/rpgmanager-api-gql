import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class LoginInput extends PickType(User, ['password']) {
  @Field((type) => String)
  password: string;
  @Field((type) => String)
  usernameOrEmail: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  token?: string;
}
