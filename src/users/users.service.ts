import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { ProfilesService } from '../profiles/profiles.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto';
import { GetUserOutput } from './dtos/get-user.dto';
import { MeOutput } from './dtos/me.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly profilesService: ProfilesService,
    private readonly mailService: MailService,
  ) {}
  /**
   *  Given id returns user and ok:true if user exists or ok:false error:true otherwise.
   */
  async getUserById(userId: number): Promise<User> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPublicUserById(userId: number): Promise<GetUserOutput> {
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

  async me(user: User): Promise<MeOutput> {
    try {
      user.password = '';
      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error loading user info.',
      };
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

      const profileCreated = await this.profilesService.createProfile(user.id);
      if (!profileCreated) {
        this.users.delete({ id: user.id });
        throw new InternalServerErrorException();
      }

      const verification = await this.verifications.save(
        this.verifications.create({
          user: user,
        }),
      );

      this.mailService.sendVerificationEmail(user.email, verification.code);

      return { ok: true, user };
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
      let user = await this.users.findOne({
        where: {
          id: userId,
        },
      });
      if (email) {
        user.email = email;
        user.isVerified = false;

        let verification = await this.verifications.findOne({
          where: {
            user: {
              id: userId,
            },
          },
        });

        if (verification) this.verifications.delete(verification.id);

        verification = await this.verifications.save(
          this.verifications.create({ user: user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      user = await this.users.save(user);
      user.password = ''; // Remove password before returning user data.
      return {
        ok: true,
        user,
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
      if (!verification) {
        return { ok: false, error: 'Incorrect verification code.' };
      }
      verification.user.isVerified = true;
      await this.users.save(verification.user);
      await this.verifications.delete(verification.id);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Error when verifying email' };
    }
  }
}
