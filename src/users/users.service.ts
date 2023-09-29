import { Injectable } from '@nestjs/common';
import { GetUserOutput } from './dtos/get-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
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

      const user = await this.users.save(
        this.users.create({ email, password, username }),
      );

      // TODO: Create profile

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const verification = await this.verifications.save(
        this.verifications.create({
          user: user,
        }),
      );

      // this.mailService.sendVerificationEmail(user.email, verification.code);

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

  async editUser(
    userId: number,
    { email, password }: EditUserInput,
  ): Promise<EditUserOutput> {
    try {
      const user = await this.users.findOne({
        where: {
          id: userId,
        },
      });
      if (email) {
        user.email = email;
        user.isVerified = false;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const verification = await this.verifications.save(
          this.verifications.create(user),
        );
        // this.mailService.sendVerificationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: {
          code,
        },
        relations: ['user'],
      });
      if (verification) {
        verification.user.isVerified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
      }
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false };
    }
  }
}
