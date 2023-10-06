import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsBoolean, IsDate, IsEmail, IsString, Length } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';
import { Character } from '../../character/entities/character.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { Profile } from '../../profiles/entities/profile.entity';

/**
 * Class that describes account specific user fields
 */
@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column({ unique: true, nullable: false })
  @IsString()
  @Length(4, 50)
  username: string;

  @Field((type) => String)
  @Column({ select: false, nullable: false })
  @IsString()
  @Length(8, 255)
  password: string;

  @Field((type) => Boolean)
  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Field((type) => Boolean)
  @Column({ default: false })
  @IsBoolean()
  isStuff: boolean;

  @Field((type) => Boolean)
  @Column({ default: false })
  @IsBoolean()
  isVerified: boolean;

  @Field((type) => Date)
  @Column({ nullable: true })
  @IsDate()
  lastLoginDate?: Date;

  @Field((type) => Profile)
  @OneToOne((type) => Profile, (profile) => profile.user, {
    onDelete: 'RESTRICT',
  })
  profile: Profile;

  @Field((type) => Character)
  @OneToOne((type) => Profile, (profile) => profile.user, {
    onDelete: 'RESTRICT',
  })
  character: Character;

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
