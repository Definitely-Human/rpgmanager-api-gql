import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { Query } from '@nestjs/graphql';
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { AuthUser } from 'src/auth/authUser.decorator';
import { Authorize } from 'src/auth/authorize.decorator';
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { MeOutput } from './dtos/me.dto';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

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
}
