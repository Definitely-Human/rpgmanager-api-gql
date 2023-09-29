import { ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@ObjectType()
export class MeOutput extends CoreOutput {
  user?: User;
}
