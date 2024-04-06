import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class DeleteRewardInput {
  @Field((type) => Int)
  rewardId: number;
}

@ObjectType()
export class DeleteRewardOutput extends CoreOutput {}
