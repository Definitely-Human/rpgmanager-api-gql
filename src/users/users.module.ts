import { Module } from '@nestjs/common';
import { UserResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Verification } from './entities/verification.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Verification, Profile]),
    ProfilesModule,
  ],
  providers: [UserResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
