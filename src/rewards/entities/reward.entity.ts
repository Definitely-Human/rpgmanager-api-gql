import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsInt, Max, Min } from 'class-validator';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Character } from '../../character/entities/character.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { Task } from '../../tasks/entities/task.entity';

@InputType('RewardInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Reward extends CoreEntity {
  @ManyToOne((type) => Character, (character) => character.tasks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  character: Character;

  @RelationId((task: Task) => task.character)
  characterId: number;

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

  @Field((type) => Boolean)
  @Column({ default: false, nullable: false })
  @IsBoolean()
  isReceived: boolean;
}
