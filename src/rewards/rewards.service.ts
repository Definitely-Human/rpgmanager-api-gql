import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../character/entities/character.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import {
  CreateRewardInput,
  CreateRewardOutput,
} from './dtos/create-reward.dto';
import {
  DeleteRewardInput,
  DeleteRewardOutput,
} from './dtos/delete-reward.dto';
import { EditRewardInput, EditRewardOutput } from './dtos/edit-reward.dto';
import { GetRewardInput, GetRewardOutput } from './dtos/get-reward.dto';
import { GetRewardsInput, GetRewardsOutput } from './dtos/get-rewards.dto';
import { Reward } from './entities/reward.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward) private readonly rewards: Repository<Reward>,
    @InjectRepository(Task) private readonly tasks: Repository<Task>,
    @InjectRepository(Character)
    private readonly characters: Repository<Character>,
  ) {}

  async createReward(
    createRewardInput: CreateRewardInput,
    user: User,
  ): Promise<CreateRewardOutput> {
    try {
      if (user.character === null)
        return { ok: false, error: 'Character does not exist.' };

      const reward = await this.rewards.save(
        this.rewards.create({
          ...createRewardInput,
          character: user.character,
        }),
      );

      return {
        ok: true,
        reward,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when creating reward.',
      };
    }
  }

  async getReward(
    getRewardInput: GetRewardInput,
    user: User,
  ): Promise<GetRewardOutput> {
    try {
      const reward = await this.rewards.findOne({
        where: { id: getRewardInput.rewardId },
      });

      if (!reward || reward.characterId !== user.character.id)
        return { ok: false, error: 'Reward not found' };

      return {
        ok: true,
        reward,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when retrieving reward.',
      };
    }
  }

  async getRewards(
    getRewardsInput: GetRewardsInput,
    user: User,
  ): Promise<GetRewardsOutput> {
    try {
      const isReceivedFilter = getRewardsInput.isReceived;
      const rewards = await this.rewards.find({
        where: {
          character: { id: user.character.id },
          ...(isReceivedFilter && { isReceived: isReceivedFilter }), // If filter not null apply filter
        },
      });

      return {
        ok: false,
        rewards,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when retrieving rewards.',
      };
    }
  }

  async editReward(
    editRewardInput: EditRewardInput,
    user: User,
  ): Promise<EditRewardOutput> {
    try {
      let reward = await this.rewards.findOne({
        where: { id: editRewardInput.rewardId },
      });

      if (!reward || reward.characterId !== user.character.id)
        return { ok: false, error: 'Reward not found' };

      reward = {
        ...reward,
        ...editRewardInput,
      };

      reward = await this.rewards.save(reward);

      return {
        ok: true,
        reward,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when editing reward.',
      };
    }
  }

  async deleteReward(
    deleteRewardInput: DeleteRewardInput,
    user: User,
  ): Promise<DeleteRewardOutput> {
    try {
      const reward = await this.rewards.findOne({
        where: { id: deleteRewardInput.rewardId },
      });
      if (!reward || reward.characterId !== user.character.id)
        return { ok: false, error: 'Reward not found' };

      this.rewards.delete(reward.id);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Error when deleting reward.',
      };
    }
  }

  async checkIfRewardShouldBeReceived(rewardId: number) {
    const reward = await this.rewards.findOne({
      where: { id: rewardId },
      relations: { character: true },
    });
    const tasks = await this.tasks.find({
      where: { reward: { id: rewardId }, is_complete: false },
    });
    if (tasks.length === 0 && reward.isReceived === false) {
      reward.character.coins += reward.coins;
      reward.character.experience += reward.experience;
      await this.characters.save(reward.character);
      reward.isReceived = true;
      await this.rewards.save(reward);
    }
  }

  async checkIfRewardReceived(rewardId: number): Promise<boolean> {
    const reward = await this.rewards.findOne({
      select: { isReceived: true },
      where: { id: rewardId },
    });
    return reward.isReceived;
  }
}
