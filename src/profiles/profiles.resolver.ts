import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Profile } from './entities/profile.entity';
import { GetProfileInput, GetProfileOutput } from './dtos/get-profile.dto';
import { ProfilesService } from './profiles.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { User } from '../users/entities/user.entity';
import { AuthUser } from '../auth/authUser.decorator';

@Resolver((of) => Profile)
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @Query((returns) => GetProfileOutput)
  getProfile(
    @Args('input') getProfileInput: GetProfileInput,
  ): Promise<GetProfileOutput> {
    return this.profilesService.getProfileById(getProfileInput);
  }

  @Mutation((returns) => EditProfileOutput)
  editProfile(
    @Args('input') editProfileInput: EditProfileInput,
    @AuthUser() authUser: User,
  ): Promise<EditProfileOutput> {
    return this.profilesService.editProfile(editProfileInput, authUser);
  }
}
