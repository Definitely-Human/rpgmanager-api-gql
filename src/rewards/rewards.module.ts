import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from '../character/entities/character.entity';
import { Task } from '../tasks/entities/task.entity';
import { Reward } from './entities/reward.entity';
import { RewardsResolver } from './rewards.resolver';
import { RewardsService } from './rewards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reward, Task, Character])],
  providers: [RewardsService, RewardsResolver],
  exports: [RewardsService],
})
export class RewardsModule {}
