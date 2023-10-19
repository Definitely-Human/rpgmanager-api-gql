import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { List } from './list.entity';

@InputType('ListItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class ListItem extends CoreEntity {
  @Field((type) => List, { nullable: true })
  @ManyToOne((type) => List, (list) => list.listItems, {
    onDelete: 'CASCADE',
  })
  list: List;

  @RelationId((listItem: ListItem) => listItem.list)
  listId: number;

  @Field((type) => String)
  @Column({ nullable: false })
  @IsString()
  @Length(1, 255)
  title: string;

  @Field((type) => Boolean, { nullable: false })
  @Column({ nullable: false, default: false })
  @IsBoolean()
  is_complete: boolean;
}
