import { Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { Query } from '@nestjs/graphql';

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => Boolean)
  test() {
    return true;
  }
}
