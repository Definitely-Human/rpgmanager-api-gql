import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthRoles } from './authorize.decorator';
import { AUTHORIZE } from './auth.constants';

/**
 * Decides if user can access the resolver.
 * If role set by Authorize() decorator is not present resolver will only be accessible to an authenticated user.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AuthRoles>(
      AUTHORIZE,
      context.getHandler(),
    );
    if (roles && roles.includes('Any')) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext['token'];
    if (!token) return false;
    const decoded = this.jwtService.verify(token.toString());
    if (typeof decoded === 'object' && decoded.hasOwnProperty('userId')) {
      const user = await this.userService.getUserById(decoded['userId']);
      if (!user) {
        return false;
      }
      gqlContext['user'] = user;
      if (!roles) {
        return true;
      }
      if (roles.includes('Admin')) {
        return user.isStuff;
      }
      console.log(`Unknown role user: ${user}`);
      return false;
    } else {
      return false;
    }
  }
}
