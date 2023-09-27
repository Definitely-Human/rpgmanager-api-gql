import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { Query } from '@nestjs/graphql';
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Query((returns) => User)
  getUser(@Args('input') { userId }: GetUserInput): Promise<GetUserOutput> {
    return this.usersService.getUserById(userId);
  }
}
