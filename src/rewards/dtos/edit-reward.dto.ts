import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Reward } from '../entities/reward.entity';

@InputType()
export class EditRewardInput extends PartialType(
  PickType(Reward, ['coins', 'experience']),
) {
  @Field((type) => Int)
  rewardId: number;
}

@ObjectType()
export class EditRewardOutput extends CoreOutput {
  @Field((type) => Reward, { nullable: true })
  reward?: Reward;
}
