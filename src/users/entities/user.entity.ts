import { InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsString()
  @Length(8, 255)
  password: string;
}
