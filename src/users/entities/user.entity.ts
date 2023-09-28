import { InternalServerErrorException } from '@nestjs/common';
import { InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, Length, IsBoolean, IsDate } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

/**
 * Class that describes account specific user fields
 */
@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
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

  @Column({ default: false })
  @IsBoolean()
  isVerified: boolean;

  @Column({ nullable: true })
  @IsDate()
  lastLoginDate?: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) return;
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
