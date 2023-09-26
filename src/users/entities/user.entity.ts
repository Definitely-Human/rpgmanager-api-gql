import { InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, Length, IsBoolean, IsDate } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Length(4, 50)
  username: string;

  @Column({ select: false })
  @IsString()
  @Length(8, 255)
  password: string;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ default: false })
  @IsBoolean()
  isStuff: boolean;

  @Column({ nullable: true })
  @IsDate()
  lastLoginDate?: boolean;
}
