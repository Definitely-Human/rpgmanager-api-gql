import { Resolver, Query, Args } from '@nestjs/graphql';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { Authorize } from './authorize.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Authorize(['Any'])
  @Query((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }
}
