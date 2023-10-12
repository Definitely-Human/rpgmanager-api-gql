import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class DeleteRewardInput {
  @Field((type) => Int)
  rewardId: number;
}

@ObjectType()
export class DeleteRewardOutput {}
