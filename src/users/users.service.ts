import { Injectable } from '@nestjs/common';
import { GetUserOutput } from './dtos/get-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}
  /**
   *  Given id returns user and ok:true if user exists or ok:false error:true otherwise.
   */
  async getUserById(userId: number): Promise<GetUserOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Error when getting user.' };
    }
  }

  async createAccount({
    email,
    password,
    username,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({
        where: [
          {
            email,
          },
          { username },
        ],
      });
      if (exists) {
        return {
          ok: false,
          error: 'There is a user with this email or username already.',
        };
      }

      await this.users.save(this.users.create({ email, password, username }));

      // TODO: Create profile
      // TODO: Send verification

      return { ok: true };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when creating account.',
      };
    }
  }

  async findUserByEmailOrName(usernameOrEmail: string) {
    return await this.users.findOne({
      where: [
        {
          email: usernameOrEmail,
        },
        {
          username: usernameOrEmail,
        },
      ],
      select: ['id', 'password'],
    });
  }
}
