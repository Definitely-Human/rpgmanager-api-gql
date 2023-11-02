import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@ObjectType()
export class MeOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
