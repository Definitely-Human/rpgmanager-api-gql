import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Profile } from '../entities/profile.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class GetProfileInput {
  @Field((type) => Number)
  profileId: number;
}

@ObjectType()
export class GetProfileOutput extends CoreOutput {
  @Field((type) => Profile, { nullable: true })
  profile?: Profile;
}
