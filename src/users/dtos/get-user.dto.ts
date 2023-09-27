import { InputType, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class GetUserInput {
  userId: number;
}

/**
 * Return type for getUser resolver.
 */
@ObjectType()
export class GetUserOutput extends CoreOutput {
  user?: User;
}
