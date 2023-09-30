import { InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, MaxLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@InputType('ProfileInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Profile extends CoreEntity {
  @Column({ default: false })
  @IsBoolean()
  isOnline: boolean;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(1000)
  aboutMe: string;

  @OneToOne((type) => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: number;
}
