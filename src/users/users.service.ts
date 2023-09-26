import { Injectable } from '@nestjs/common';
import { GetUserOutput } from './dtos/getUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

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
}
