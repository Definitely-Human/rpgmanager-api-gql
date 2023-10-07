import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Character } from '../../character/entities/character.entity';
import { CoreEntity } from '../../common/entities/core.entity';

/**
 * Class that describes user defined tasks.
 */
@InputType('TaskInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Task extends CoreEntity {
  @ManyToOne((type) => Character, (character) => character.tasks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  character: Character;

  @Field((type) => String)
  @Column({ nullable: false })
  @IsString()
  @Length(1, 100)
  title: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: false, default: '' })
  @IsString()
  @MaxLength(5000)
  content: string;

  @Field((type) => Date)
  @Column({ nullable: false })
  @IsDate()
  due_to: Date;

  @Field((type) => Date, { nullable: true })
  @Column({ nullable: true })
  @IsDate()
  completion_time: Date;

  @Field((type) => Boolean, { nullable: false })
  @Column({ nullable: false, default: false })
  @IsBoolean()
  is_complete: boolean;

  @Field((type) => Boolean, { nullable: false })
  @Column({ nullable: false, default: false })
  @IsBoolean()
  is_deleted: boolean;

  @Field((type) => Boolean, { nullable: false })
  @Column({ nullable: false, default: false })
  @IsBoolean()
  is_favorite: boolean;
}
