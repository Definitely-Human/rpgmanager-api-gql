import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { GetProfileInput, GetProfileOutput } from './dtos/get-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private readonly profiles: Repository<Profile>,
  ) {}

  async createProfile(userId: number): Promise<boolean> {
    try {
      await this.profiles.save(
        this.profiles.create({
          user: userId,
        }),
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getProfileById({
    profileId,
  }: GetProfileInput): Promise<GetProfileOutput> {
    try {
      const profile = await this.profiles.findOne({ where: { id: profileId } });
      if (!profile) {
        return {
          ok: false,
          error: 'Profile not found',
        };
      }
      return {
        ok: true,
        profile,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when searching for profile.',
      };
    }
  }

  async editProfile(
    editProfileInput: EditProfileInput,
    user: User,
  ): Promise<EditProfileOutput> {
    try {
      let profile = await this.profiles.findOne({
        where: { user: user.id },
      });
      if (!profile) {
        return {
          ok: false,
          error: 'Profile not found',
        };
      }

      if (user.id !== profile.userId) {
        return {
          ok: false,
          error: "You can't edit other users profile.",
        };
      }
      profile = {
        ...profile,
        ...editProfileInput,
      };

      profile = await this.profiles.save(profile);
      return {
        ok: true,
        profile,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when editing profile.',
      };
    }
  }
}
