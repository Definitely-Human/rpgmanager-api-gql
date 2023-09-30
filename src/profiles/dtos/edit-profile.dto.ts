import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Profile } from '../entities/profile.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(Profile, ['aboutMe', 'firstName', 'lastName']),
) {
  profileId: number;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {
  profile?: Profile;
}
