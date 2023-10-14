import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length, MaxLength } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Character } from '../../character/entities/character.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { ListItem } from './list-item.entity';

@InputType('ListInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class List extends CoreEntity {
  @ManyToOne((type) => Character, (character) => character.lists, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  character: Character;

  @RelationId((list: List) => list.character)
  characterId: number;

  @Field((type) => String)
  @Column({ nullable: false })
  @IsString()
  @Length(1, 100)
  title: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: false, default: '' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @Field((type) => Boolean, { nullable: false })
  @Column({ nullable: false, default: false })
  @IsBoolean()
  is_deleted: boolean;

  @Field((type) => Boolean, { nullable: false })
  @Column({ nullable: false, default: false })
  @IsBoolean()
  is_favorite: boolean;

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.lists, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category?: Category;

  @RelationId((list: List) => list.category)
  categoryId?: number;

  @Field((type) => [ListItem])
  @OneToMany((type) => ListItem, (listItem) => listItem.list)
  listItems?: ListItem[];
}
