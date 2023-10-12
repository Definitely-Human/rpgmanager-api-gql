import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsInt, Max, Min } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

@InputType('RewardInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Reward extends CoreEntity {
  @Field((type) => Int)
  @Column({ default: 0, nullable: false })
  @IsInt()
  @Max(10000)
  @Min(0)
  coins: number;

  @Field((type) => Int)
  @Column({ default: 0, nullable: false })
  @IsInt()
  @Max(10000)
  @Min(0)
  experience: number;

  @Field((type) => Int)
  @Column({ default: false, nullable: false })
  @IsBoolean()
  isReceived: boolean;
}
