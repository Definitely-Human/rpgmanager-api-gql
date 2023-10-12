import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Reward } from '../entities/reward.entity';

@InputType()
export class GetRewardsInput extends PartialType(
  PickType(Reward, ['isReceived']),
) {}

@ObjectType()
export class GetRewardsOutput extends CoreOutput {
  @Field((type) => [Reward], { nullable: true })
  rewards?: Reward[];
}
