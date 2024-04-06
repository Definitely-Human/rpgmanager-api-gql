import { Injectable } from '@nestjs/common';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ usernameOrEmail, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user =
        await this.usersService.findUserByEmailOrName(usernameOrEmail);
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Incorrect credentials.',
        };
      }
      const token = await this.jwtService.signAsync({ userId: user.id });
      return {
        ok: true,
        token: token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
