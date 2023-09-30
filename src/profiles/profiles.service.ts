import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

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
}
