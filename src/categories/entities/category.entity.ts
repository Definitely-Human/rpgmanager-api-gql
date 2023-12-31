import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { List } from '../../lists/entities/list.entity';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Class that describes user defined categories.
 */
@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.categories, { onDelete: 'CASCADE' })
  user: User;

  @Field((type) => String)
  @Column({ nullable: false })
  @IsString()
  @Length(2, 50)
  name: string;

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.childCategories)
  parentCategory?: Category;

  @Field((type) => Int, { nullable: true })
  @RelationId((category: Category) => category.parentCategory)
  parentCategoryId?: number;

  @OneToMany((type) => Category, (category) => category.parentCategory)
  childCategories?: Category[];

  @Field((type) => [Task])
  @OneToMany((type) => Task, (task) => task.category)
  tasks?: Task[];

  @Field((type) => [List])
  @OneToMany((type) => List, (list) => list.category)
  lists?: List[];
}
