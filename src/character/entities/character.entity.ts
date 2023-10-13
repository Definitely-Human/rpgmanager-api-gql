import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsInt, IsPositive, IsString, Length } from 'class-validator';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Reward } from '../../rewards/entities/reward.entity';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@InputType('CharacterInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Character extends CoreEntity {
  @Field((type) => User)
  @OneToOne((type) => User, (user) => user.character, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Field((type) => String)
  @Column({ nullable: false })
  @IsString()
  @Length(2, 50)
  name: string;

  @Field((type) => Number)
  @Column({ nullable: false, default: 0 })
  @IsPositive()
  @IsInt()
  experience: number;

  @Field((type) => Number)
  @Column({ nullable: false, default: 0 })
  @IsInt()
  coins: number;

  @Field((type) => [Task])
  @OneToMany((type) => Task, (task) => task.character)
  tasks: Task[];

  @Field((type) => [Reward])
  @OneToMany((type) => Reward, (reward) => reward.character)
  rewards: Reward[];
}
