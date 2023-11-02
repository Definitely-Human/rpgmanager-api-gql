import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Reward } from '../entities/reward.entity';

@InputType()
export class GetRewardInput {
  @Field((type) => Int)
  rewardId: number;
}

@ObjectType()
export class GetRewardOutput extends CoreOutput {
  @Field((type) => Reward, { nullable: true })
  reward?: Reward;
}
