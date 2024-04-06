import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Profile } from '../entities/profile.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(Profile, ['aboutMe', 'firstName', 'lastName']),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {
  @Field((type) => Profile, { nullable: true })
  profile?: Profile;
}
