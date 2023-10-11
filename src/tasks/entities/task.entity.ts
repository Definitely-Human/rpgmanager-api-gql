import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
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

  @RelationId((task: Task) => task.character)
  characterId: number;

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

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.tasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category?: Category;

  @RelationId((task: Task) => task.category)
  categoryId?: number;
}
