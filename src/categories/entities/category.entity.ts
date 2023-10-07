import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
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
  @JoinColumn()
  user: User;

  @Field((type) => String)
  @Column({ nullable: false })
  @IsString()
  @Length(2, 50)
  name: string;

  @ManyToOne((type) => Category, (category) => category.childCategories)
  parentCategory: Category;

  @OneToMany((type) => Category, (category) => category.parentCategory)
  childCategories: Category[];
}
