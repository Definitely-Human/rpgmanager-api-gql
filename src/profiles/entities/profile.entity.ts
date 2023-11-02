import { Field, HideField, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CoreEntity } from '../../common/entities/core.entity';

/**
 * Entity that describes user profile fields.
 */
@InputType('ProfileInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Profile extends CoreEntity {
  @Field((type) => Boolean)
  @Column({ default: false })
  @IsBoolean()
  isOnline: boolean;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  @MaxLength(1000)
  aboutMe?: string;

  @Field((type) => Number)
  @OneToOne((type) => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: number;

  @RelationId((profile: Profile) => profile.user)
  @HideField()
  userId: number;
}
