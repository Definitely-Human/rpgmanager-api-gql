import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../auth/authUser.decorator';
import { Authorize } from '../auth/authorize.decorator';
import { Profile } from '../profiles/entities/profile.entity.js';
import { ProfilesService } from '../profiles/profiles.service.js';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto';
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto';
import { MeOutput } from './dtos/me.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Authorize(['Any'])
  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Query((returns) => GetUserOutput)
  getUser(@Args('input') { userId }: GetUserInput): Promise<GetUserOutput> {
    return this.usersService.getPublicUserById(userId);
  }

  @Query((returns) => MeOutput)
  me(@AuthUser() authUser: User): Promise<MeOutput> {
    return this.usersService.me(authUser);
  }

  @Mutation((returns) => EditUserOutput)
  async editUser(
    @AuthUser() authUser: User,
    @Args('input') editUserInput: EditUserInput,
  ): Promise<EditUserOutput> {
    return this.usersService.editUser(authUser.id, editUserInput);
  }

  @Mutation((returns) => VerifyEmailOutput)
  @Authorize(['Any'])
  async verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return await this.usersService.verifyEmail(verifyEmailInput.code);
  }

  @ResolveField((returns) => Profile)
  async profile(@AuthUser() authUser: User) {
    console.log('profile');
    return (
      await this.profilesService.getProfileById({
        profileId: authUser.profileId,
      })
    ).profile;
  }
}
