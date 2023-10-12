import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../auth/authUser.decorator';
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
import { RewardsService } from './rewards.service';

@Resolver((of) => Reward)
export class RewardsResolver {
  constructor(private readonly rewardService: RewardsService) {}

  @Mutation((returns) => CreateRewardOutput)
  createReward(
    @Args('input') createRewardInput: CreateRewardInput,
    @AuthUser() authUser: User,
  ): Promise<CreateRewardOutput> {
    return this.rewardService.createReward(createRewardInput, authUser);
  }

  @Query((returns) => GetRewardOutput)
  getReward(
    @Args('input') getRewardInput: GetRewardInput,
    @AuthUser() authUser: User,
  ): Promise<GetRewardOutput> {
    return this.rewardService.getReward(getRewardInput, authUser);
  }

  @Query((returns) => GetRewardsOutput)
  getRewards(
    @Args('input') getRewardsInput: GetRewardsInput,
    @AuthUser() authUser: User,
  ): Promise<GetRewardsOutput> {
    return this.rewardService.getRewards(getRewardsInput, authUser);
  }

  @Mutation((returns) => EditRewardOutput)
  async editReward(
    @Args('input') editRewardInput: EditRewardInput,
    @AuthUser() authUser: User,
  ): Promise<EditRewardOutput> {
    return this.rewardService.editReward(editRewardInput, authUser);
  }

  @Mutation((returns) => DeleteRewardOutput)
  async deleteReward(
    @Args('input') deleteRewardInput: DeleteRewardInput,
    @AuthUser() authUser: User,
  ): Promise<DeleteRewardOutput> {
    return this.rewardService.deleteReward(deleteRewardInput, authUser);
  }
}
