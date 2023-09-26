import { Args, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { Query } from '@nestjs/graphql';
import { GetUserInput } from './dtos/getUser.dto';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => User)
  getUser(@Args('input') { userId }: GetUserInput) {
    this.usersService.getUserById(userId);
  }
}
