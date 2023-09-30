import { InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Profile } from '../entities/profile.entity';

@InputType()
export class GetProfileInput {
  profileId: number;
}

@ObjectType()
export class GetProfileOutput extends CoreOutput {
  profile?: Profile;
}
