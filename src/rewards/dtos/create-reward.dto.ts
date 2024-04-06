import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Reward } from '../entities/reward.entity';

@InputType()
export class CreateRewardInput extends PickType(Reward, [
  'coins',
  'experience',
]) {}

@ObjectType()
export class CreateRewardOutput extends CoreOutput {
  @Field((type) => Reward, { nullable: true })
  reward?: Reward;
}
